'use server';

import { SecurityService } from '@/lib/security';
import { callFunctionWithFormData } from '@/utils/action_template';
import { APILogger } from '@/utils/logger_actions';
import { createClient } from '@/utils/supabase/server';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';

async function uploadFile(file, path) {
  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from('Morooms-file')
    .upload(`proof${path ? `/${path}` : ''}/${file.name}`, file, {
      upsert: true,
    });
  if (error) {
    // console.error(error);
  }
}

export async function signup(prevState, formData) {
  const supabase = createClient(true);

  /*console.log(
    'Security Answers:',
    formData.get('securityAnswer1'),
    formData.get('securityAnswer2'),
  );*/

  // Sign up user with auth first
  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const { data: userSigninData, error } = await supabase.auth.signUp(data);

  if (error) {
    APILogger.log(
      'User Signup',
      'CREATE',
      'auth.users',
      null,
      { email: data.email },
      error.message,
    );
    return { error: error.message };
  }

  try {
    const hashedNewPassword = await bcrypt.hash(data.password, 12);

    const { error: historyInsertError } = await supabase
      .from('password_history')
      .insert({
        user_id: userSigninData.user.id,
        hashed_password: hashedNewPassword,
        created_at: new Date().toISOString(),
      });

    if (historyInsertError) {
      APILogger.log(
        'User Signup',
        'CREATE',
        'password_history',
        null,
        { user_id: user_signin_data.user.id },
        historyInsertError.message,
      );
      // Don't fail the request if history saving fails
    } else {
      /*console.log('Password saved to history');*/
    }
  } catch (historyError) {
    // console.error('Error managing password history:', historyError);
    APILogger.log(
      'User Signup',
      'CREATE',
      'password_history',
      null,
      { user_id: user_signin_data.user.id },
      historyError.message,
    );
    // Don't fail the request if history management fails
    return { error: 'Failed to create account. Please try again.' };
  }
  if (!user_signin_data.user) {
    APILogger.log(
      'User Signup',
      'CREATE',
      'auth.users',
      null,
      { email: data.email },
      'No user data returned after signup',
    );
  }

  try {
    // Handle security questions first
    const securityAnswers = [
      {
        questionId: parseInt(formData.get('question1')),
        answer: formData.get('securityAnswer1'),
      },
      {
        questionId: parseInt(formData.get('question2')),
        answer: formData.get('securityAnswer2'),
      },
    ];
    // Validate security answers
    if (!securityAnswers[0].answer || !securityAnswers[1].answer) {
      APILogger.log(
        'User Signup',
        'CREATE',
        'security_answers',
        user_signin_data.user.id,
        { securityAnswers },
        'Both security questions must be answered',
      );
    }

    if (securityAnswers[0].questionId === securityAnswers[1].questionId) {
      APILogger.log(
        'User Signup',
        'CREATE',
        'security_answers',
        user_signin_data.user.id,
        { securityAnswers },
        'Please select different security questions',
      );
    }

    // Handle file upload

    const file = formData.get('proof');
    let proofFileName = '';

    if (file && file.size > 0) {
      const path = userSigninData.user.id;
      await uploadFile(file, path);
      proofFileName = file.name;
    }

    // Prepare form data for the procedure (matching your parameter names)
    const procedureFormData = new FormData();

    // Map form fields to procedure parameters
    procedureFormData.append('user_id', userSigninData.user.id);
    procedureFormData.append('user_firstname', formData.get('userFirstname'));
    procedureFormData.append('user_lastname', formData.get('userLastname'));
    procedureFormData.append('proof', proofFileName);

    // Call the database procedure to create user record
    const result = await callFunctionWithFormData(
      null,
      'create_user', // Your procedure name
      '/login',
      procedureFormData,
      null, // No id column name needed since procedure handles it
    );
    // Save security answers
    await SecurityService.saveSecurityAnswers(
      user_signin_data.user.id,
      securityAnswers,
    );
    APILogger.log(
      'User Signup',
      'CREATE',
      'auth.users',
      user_signin_data.user.id,
      { email: data.email },
      null,
    );
    return { success: true };
  } catch (error) {
    APILogger.log(
      'User Signup',
      'CREATE',
      'auth.users',
      user_signin_data.user.id,
      { email: data.email },
      error.message,
    );
    console.error('Signup error:', error);
    return { error: 'Failed to create account. Please try again.' };
  }
}
