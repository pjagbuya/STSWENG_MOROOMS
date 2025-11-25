'use client';

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
import { createClient } from '@/utils/supabase/client';
import { useState } from 'react';

export function ReauthModal({ open, onOpenChange, userEmail, onSuccess }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleReauthenticate = async e => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signInWithPassword(
        {
          email: userEmail,
          password: password,
        },
      );

      if (authError) {
        setError('Invalid password. Please try again.');
        setIsLoading(false);
        return;
      }

      // Generate a re-authentication token (timestamp-based)
      const reauthToken = `${data.user.id}:${Date.now()}`;

      // Clear password and call success callback
      setPassword('');
      setError('');
      setIsLoading(false);
      onSuccess(reauthToken);
      onOpenChange(false);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setPassword('');
    setError('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md [&>button:first-of-type]:hidden">
        <DialogHeader>
          <DialogTitle>Confirm Password Change</DialogTitle>
          <DialogDescription>
            For security reasons, please re-enter your current password to
            change your password.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleReauthenticate}>
          <ErrorMessage error={error} />

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
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your current password"
                required
                disabled={isLoading}
                autoFocus
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !password}>
              {isLoading ? 'Verifying...' : 'Verify'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
