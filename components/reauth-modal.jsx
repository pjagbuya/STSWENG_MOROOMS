'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

export function ReauthModal({ open, onOpenChange, userEmail, onSuccess }) {
  const [currentPassword, setCurrentPassword] = useState('');

  const handleCancel = () => {
    setCurrentPassword('');
    onOpenChange(false);
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (currentPassword.trim()) {
      onSuccess(currentPassword);
      setCurrentPassword('');
      onOpenChange(false);
    }
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

        <form onSubmit={handleSubmit}>
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
                placeholder="Enter your current password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                required
                autoFocus
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit">Confirm</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
