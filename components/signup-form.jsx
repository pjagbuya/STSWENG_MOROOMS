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
  const [eligibilityState, checkEligibility] = useFormState(
    checkPasswordChangeEligibility,
    { error: '', allowed: null },
  );

  // Re-authentication state for password changes
  const [showReauthModal, setShowReauthModal] = useState(false);
  const [pendingNewPassword, setPendingNewPassword] = useState('');
  const [pendingFormData, setPendingFormData] = useState(null);

  const state = isEdit ? editState : signupState;
  // Combine errors from edit state and eligibility check
  const displayError = eligibilityState.error || state.error;
  const formAction = isEdit ? editAction : signupAction;

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
    // Always ensure password is an empty string (never undefined)
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
      // Store pending data and check eligibility first (server-side)
      setPendingNewPassword(values.password);
      setPendingFormData({ form, values, selectedQuestions, formData });
      // Call server action to check eligibility - result will be in eligibilityState
      checkEligibility();
      return;
    }

    console.log('Form Data', formData);
    await formAction(formData);
  };

  const handlePasswordChangeSuccess = () => {
    // Password was changed successfully, now submit the rest of the form
    if (pendingFormData) {
      const { formData } = pendingFormData;
      // Remove password from form data since it was already changed
      formData.delete('password');
      formAction(formData);
      setPendingFormData(null);
      setPendingNewPassword('');
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

      {/* Re-authentication modal for password changes */}
      {isEdit && (
        <ReauthModal
          open={showReauthModal}
          onOpenChange={setShowReauthModal}
          userEmail={defaultValues?.email || ''}
          newPassword={pendingNewPassword}
          onSuccess={handlePasswordChangeSuccess}
        />
      )}
    </>
  );
}
