'use client';

import { reauthenticateAndChangePassword } from '@/app/users/[user_id]/profile/edit/action';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ErrorMessage } from '@/components/ui/error-message';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';

function SubmitButton({ disabled }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={disabled || pending}>
      {pending ? 'Changing Password...' : 'Change Password'}
    </Button>
  );
}

export function ReauthModal({
  open,
  onOpenChange,
  userEmail,
  newPassword,
  onSuccess,
}) {
  const [state, formAction] = useFormState(reauthenticateAndChangePassword, {});

  // Handle successful password change
  useEffect(() => {
    if (state.success) {
      onSuccess();
      onOpenChange(false);
    }
  }, [state.success, onSuccess, onOpenChange]);

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md [&>button:first-of-type]:hidden">
        <DialogHeader>
          <DialogTitle>Confirm Password Change</DialogTitle>
          <DialogDescription>
            For security reasons, please enter your current password to confirm
            the password change.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction}>
          <input type="hidden" name="email" value={userEmail} />
          <input type="hidden" name="newPassword" value={newPassword} />

          {state.error && <ErrorMessage error={state.error} />}

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="reauth-email">Email</Label>
              <Input
                id="reauth-email"
                type="email"
                value={userEmail}
                disabled
                className="bg-gray-100"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reauth-password">Current Password</Label>
              <Input
                id="reauth-password"
                name="currentPassword"
                type="password"
                placeholder="Enter your current password"
                required
                autoFocus
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <SubmitButton />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
