'use client';

import { AddPopupForm } from './popup_create_form';
import { ReauthModal } from './reauth-modal';
import { signup } from '@/app/signup/action';
import { signUpSecurityQuestionsSchema } from '@/app/signup/form_schema';
import {
  checkPasswordChangeEligibility,
  editProfile,
} from '@/app/users/[user_id]/profile/edit/action';
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
  const formAction = isEdit ? editAction : signupAction;

  const [eligibilityState, checkEligibility] = useFormState(
    checkPasswordChangeEligibility,
    { error: '', allowed: null },
  );

  // Re-authentication state for password changes
  const [showReauthModal, setShowReauthModal] = useState(false);
  const [pendingFormData, setPendingFormData] = useState(null);

  const state = isEdit ? editState : signupState;
  // Combine errors from edit state and eligibility check
  const displayError = eligibilityState.error || state.error;

  const finalSchema = isEdit
    ? editProfileSchema
    : signUpSecurityQuestionsSchema;

  // Ensure all form fields have defined values to prevent uncontrolled to controlled warning
  const mergedDefaultValues = {
    userFirstname: '',
    userLastname: '',
    email: '',
    password: '',
    securityAnswer1: '',
    securityAnswer2: '',
    proof: undefined,
    userProfilepic: undefined,
    ...defaultValues,
    password: defaultValues?.password ?? '',
  };

  useEffect(() => {
    if (state.success) {
      window.location.href = '/login?message=Account created successfully';
    }
  }, [state.success]);

  // When eligibility check passes, show the re-auth modal
  useEffect(() => {
    if (eligibilityState.allowed === true && pendingFormData) {
      setShowReauthModal(true);
    }
  }, [eligibilityState.allowed, pendingFormData]);

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

    for (const key in values) {
      const value = values[key];

      if (value !== undefined && value !== null) {
        if (value instanceof File) {
          // console.log(`Adding file: ${key}`, value.name, value.size);
          formData.append(key, value);
        } else {
          // console.log(`Adding field: ${key}`, value);
          formData.append(key, value);
        }
      }
    }
    // console.log('Values given', values);

    // Add security questions for new signups
    if (!isEdit && selectedQuestions) {
      formData.append('question1', selectedQuestions.q1);
      formData.append('question2', selectedQuestions.q2);
    }

    if (isEdit) {
      await editProfile(formData);
    } else {
      // Use formAction for proper state management
      // console.log('Form Data', formData);
      // Does the user intend to change their password?
    }
    if (isEdit && values.password && values.password.trim() !== '') {
      // Store pending data and check eligibility first (server-side)
      setPendingFormData({ form, values, selectedQuestions, formData });

      checkEligibility();
      return;
    }

    console.log('Form Data', formData);
    formAction(formData);
  };

  const handleReauthSuccess = currentPassword => {
    if (pendingFormData) {
      const { formData } = pendingFormData;

      // Add the current password for server-side verification
      formData.append('currentPassword', currentPassword);

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
          <ErrorMessage error={displayError} />

          <AddPopupForm
            onSubmit={handleFormSubmit}
            formSchema={finalSchema}
            defaultValues={mergedDefaultValues}
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
