'use client';

import { AddPopupForm } from './popup_create_form';
import { ReauthModal } from './reauth-modal';
import { signup } from '@/app/signup/action';
import { signUpSecurityQuestionsSchema } from '@/app/signup/form_schema';
import { editProfile } from '@/app/users/[user_id]/profile/edit/action';
import { editProfileSchema } from '@/app/users/[user_id]/profile/edit/form_schema';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ErrorMessage } from '@/components/ui/error-message';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';

export function Signup({ defaultValues, isEdit, var2securityQuestions }) {
  const [signupState, signupAction] = useFormState(signup, { error: '' });
  const [editState, editAction] = useFormState(editProfile, { error: '' });

  // Re-authentication state for password changes
  const [showReauthModal, setShowReauthModal] = useState(false);
  const [reauthToken, setReauthToken] = useState('');
  const [pendingFormData, setPendingFormData] = useState(null);
  const [isPasswordChanged, setIsPasswordChanged] = useState(false);

  const state = isEdit ? editState : signupState;
  const formAction = isEdit ? editAction : signupAction;

  const finalSchema = isEdit
    ? editProfileSchema
    : signUpSecurityQuestionsSchema;

  useEffect(() => {
    if (state.success) {
      window.location.href = '/login?message=Account created successfully';
    }
  }, [state.success]);

  const handleFormSubmit = async (form, values, selectedQuestions) => {
    // Only validate security questions for new signups (not edits)
    if (!isEdit) {
      if (!selectedQuestions?.q1 || !selectedQuestions?.q2) {
        form.setError('root', {
          message: 'Please select both security questions',
        });
        return;
      }

      if (selectedQuestions.q1 === selectedQuestions.q2) {
        form.setError('root', {
          message: 'Please select different security questions',
        });
        return;
      }
    }

    const formData = new FormData();

    // Add all form values
    for (const key in values) {
      const value = values[key];

      if (value !== undefined && value !== null) {
        // Handle File objects specifically
        if (value instanceof File) {
          console.log(`Adding file: ${key}`, value.name, value.size);
          formData.append(key, value);
        } else {
          console.log(`Adding field: ${key}`, value);
          formData.append(key, value);
        }
      }
    }
    console.log('Values given', values);

    // Add security questions for new signups
    if (!isEdit && selectedQuestions) {
      formData.append('question1', selectedQuestions.q1);
      formData.append('question2', selectedQuestions.q2);
    }

    // Check if password is being changed in edit mode
    const passwordChanged =
      isEdit && values.password && values.password.trim() !== '';

    if (passwordChanged) {
      setIsPasswordChanged(true);

      // If no re-authentication token, show modal
      if (!reauthToken) {
        setPendingFormData({ form, values, selectedQuestions, formData });
        setShowReauthModal(true);
        return;
      }

      // Add re-authentication token to form data
      formData.append('reauthToken', reauthToken);
    }

    console.log('Form Data', formData);
    await formAction(formData);

    // Clear re-auth token after submission
    if (passwordChanged) {
      setReauthToken('');
      setIsPasswordChanged(false);
    }
  };

  const handleReauthSuccess = token => {
    setReauthToken(token);

    // If there's pending form data, submit it now
    if (pendingFormData) {
      const { formData } = pendingFormData;
      formData.append('reauthToken', token);
      formAction(formData);
      setPendingFormData(null);
    }
  };

  return (
    <>
      <Card className="mx-auto max-h-[800px] w-[900px] max-w-4xl">
        <CardHeader>
          <CardTitle className="text-2xl">
            {isEdit ? 'Edit Profile' : 'Step 1: Fill account details'}
          </CardTitle>
          <CardDescription>
            {isEdit
              ? 'Update your profile information'
              : 'Fill out the following details and set up security questions.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ErrorMessage error={state.error} />

          <AddPopupForm
            onSubmit={handleFormSubmit}
            formSchema={finalSchema}
            defaultValues={
              defaultValues || {
                first_name: '',
                last_name: '',
                email: '',
                password: '',
                securityAnswer1: '',
                securityAnswer2: '',
              }
            }
            includeSecurityQuestions={!isEdit} // Only show for new signups
            securityQuestions={var2securityQuestions}
          />

          {!isEdit && (
            <div className="mt-4 text-center text-sm">
              Already have an account?{' '}
              <Link href="/login" className="underline">
                Login
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Re-authentication modal for password changes */}
      {isEdit && (
        <ReauthModal
          open={showReauthModal}
          onOpenChange={setShowReauthModal}
          userEmail={defaultValues?.email || ''}
          onSuccess={handleReauthSuccess}
        />
      )}
    </>
  );
}
