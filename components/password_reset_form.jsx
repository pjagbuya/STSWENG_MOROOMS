'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// import { APILogger } from '@/utils/logger_actions';
import Link from 'next/link';
import { useState } from 'react';

export function PasswordResetForm({ onBackToLogin }) {
  const [step, setStep] = useState('email'); // 'email', 'security', 'reset'
  const [email, setEmail] = useState('');
  const [securityQuestions, setSecurityQuestions] = useState([]);
  const [answers, setAnswers] = useState({ q1: '', q2: '' });
  const [resetToken, setResetToken] = useState('');
  const [userId, setUserId] = useState(''); // Add this to store userId
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/password-reset/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      // console.log('Email verification response:', response);
      const result = await response.json();
      if (result.success) {
        setSecurityQuestions(result.questions);
        setUserId(result.userId); // Store the userId for next step
        setStep('security');
      } else {
        setError(result.error || 'Failed to verify email');
      }
    } catch (error) {
      // console.error('Email verification error:', error);
      // APILogger.log(
      //   'PasswordResetForm',
      //   'EMAIL-VERIFY',
      //   'password_reset',
      //   null,
      //   { email },
      //   error.message,
      // );
      setError('Failed to verify email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSecuritySubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/password-reset/verify-security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          userId, // Include userId from previous step
          answers: [
            { questionId: securityQuestions[0].id, answer: answers.q1 },
            { questionId: securityQuestions[1].id, answer: answers.q2 },
          ],
        }),
      });

      const result = await response.json();
      if (result.success) {
        // APILogger.log(
        //   'Password Reset Form',
        //   'SECURITY-VERIFY',
        //   'password_reset',
        //   null,
        //   { email, userId },
        //   null,
        // );
        setResetToken(result.token);
        setStep('reset');
      } else {
        setError(result.error || 'Failed to verify security answers');
      }
    } catch (error) {
      // console.error('Security verification error:', error);

      setError('Failed to verify security answers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async e => {
    e.preventDefault();
    setError('');

    // Validate passwords
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/password-reset/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          token: resetToken,
          newPassword,
          userId,
        }),
      });

      const result = await response.json();
      if (result.success) {
        // APILogger.log(
        //   'Password Reset Form',
        //   'PASSWORD-RESET',
        //   'password_reset',
        //   userId,
        //   { email, userId },
        //   null,
        // );
        alert(
          'Password reset successful! You can now login with your new password.',
        );
        // Go back to login or redirect
        if (onBackToLogin) {
          onBackToLogin();
        } else {
          window.location.href = '/login';
        }
      } else {
        setError(result.error || 'Failed to reset password');
      }
    } catch (error) {
      // console.error('Password reset error:', error);
      // APILogger.log(
      //   'PasswordResetForm',
      //   'PASSWORD-RESET',
      //   'password_reset',
      //   null,
      //   { email, userId },
      //   error.message,
      // );
      setError('Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'email') {
    return (
      <Card className="mx-auto w-[400px]">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              {error}
            </div>
          )}

          <form onSubmit={handleEmailSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? 'Verifying...' : 'Continue'}
              </Button>
            </div>
          </form>

          <div className="mt-4 text-center text-sm">
            {onBackToLogin ? (
              <button onClick={onBackToLogin} className="underline">
                Back to Login
              </button>
            ) : (
              <Link href="/login" className="underline">
                Back to Login
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 'security') {
    return (
      <Card className="mx-auto w-[500px]">
        <CardHeader>
          <CardTitle>Security Questions</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              {error}
            </div>
          )}

          <form onSubmit={handleSecuritySubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label>{securityQuestions[0]?.question}</Label>
                <Input
                  value={answers.q1}
                  onChange={e =>
                    setAnswers(prev => ({ ...prev, q1: e.target.value }))
                  }
                  disabled={loading}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label>{securityQuestions[1]?.question}</Label>
                <Input
                  value={answers.q2}
                  onChange={e =>
                    setAnswers(prev => ({ ...prev, q2: e.target.value }))
                  }
                  disabled={loading}
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep('email')}
                  disabled={loading}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? 'Verifying...' : 'Verify Answers'}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  if (step === 'reset') {
    return (
      <Card className="mx-auto w-[400px]">
        <CardHeader>
          <CardTitle>Set New Password</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              {error}
            </div>
          )}

          <form onSubmit={handlePasswordReset}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  disabled={loading}
                  required
                  minLength={8}
                  placeholder="At least 8 characters"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  required
                  minLength={8}
                  placeholder="Repeat your new password"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep('security')}
                  disabled={loading}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? 'Resetting...' : 'Reset Password'}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }
}
