import { createClient } from '@/utils/supabase/server';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { email, token, newPassword, userId } = await request.json();

    console.log('Password reset request:', {
      email,
      userId,
      hasToken: !!token,
      hasPassword: !!newPassword,
    });

    if (!email || !token || !newPassword || !userId) {
      return NextResponse.json(
        { error: 'Email, token, new password, and user ID are required' },
        { status: 400 },
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 },
      );
    }

    const supabase = createClient(true); // Admin client


    // Find the auth user by email using admin API
    const { data: authUsers, error: authError } =
      await supabase.auth.admin.listUsers();

    if (authError) {
      console.error('Auth admin error:', authError);
      return NextResponse.json(
        {
          error: 'Failed to find user: ' + authError.message,
        },
        { status: 500 },
      );
    }

    console.log('Found', authUsers.users.length, 'total users');

    const authUser = authUsers.users.find(
      user => user.email?.toLowerCase() === email.toLowerCase(),
    );

    if (!authUser) {
      console.log('Auth user not found for email:', email);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('Found auth user:', authUser.id);

    // ========================= PASSWORD HISTORY CHECK =====================================

    try {
      const { data: passwordHistory, error: historyError } = await supabase
        .from('password_history')
        .select('hashed_password, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (historyError) {
        console.error('Error fetching password history:', historyError);
        // Continue without history check if table doesn't exist
      } else if (passwordHistory && passwordHistory.length > 0) {
        console.log(
          'Found',
          passwordHistory.length,
          'previous passwords to check',
        );

        // Check if new password matches any recent password
        for (const oldPassword of passwordHistory) {
          const isMatch = await bcrypt.compare(
            newPassword,
            oldPassword.hashed_password,
          );
          if (isMatch) {
            console.log(
              'Password matches previous password from:',
              oldPassword.created_at,
            );
            return NextResponse.json(
              {
                error:
                  'You cannot reuse a recent password. Please choose a different password.',
              },
              { status: 400 },
            );
          }
        }

        console.log('New password does not match any recent passwords');
      } else {
        console.log('No password history found for user');
      }
    } catch (historyError) {
      console.log('Password history check skipped:', historyError.message);
      // Continue without history check if there's an error
    }
    // Optional: Verify token if you're storing them in database
    // try {
    //   const { data: tokenData, error: tokenError } = await supabase
    //     .from('password_reset_tokens')
    //     .select('*')
    //     .eq('token', token)
    //     .eq('user_id', userId)
    //     .eq('used', false)
    //     .single();

    //   if (tokenError || !tokenData) {
    //     console.log('Token verification failed:', tokenError?.message);
    //     // Continue without token verification if table doesn't exist
    //   } else {
    //     // Check if token is expired
    //     if (new Date() > new Date(tokenData.expires_at)) {
    //       return NextResponse.json(
    //         { error: 'Reset token has expired' },
    //         { status: 400 },
    //       );
    //     }

    //     // Mark token as used
    //     await supabase
    //       .from('password_reset_tokens')
    //       .update({ used: true })
    //       .eq('id', tokenData.id);

    //     console.log('Token verified and marked as used');
    //   }
    // } catch (tokenError) {
    //   console.log(
    //     'Token verification skipped (table might not exist):',
    //     tokenError.message,
    //   );
    // }

    console.log('Updating password for auth user:', authUser.id);

    // Update the user's password in Supabase Auth using admin API
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      authUser.id,
      { password: newPassword },
    );

    if (updateError) {
      console.error('Password update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update password: ' + updateError.message },
        { status: 500 },
      );
    }

    console.log('Password updated successfully');
    // ========================= PASSWORD HISTORY =====================================
    // Add new password to history
    try {
      const hashedNewPassword = await bcrypt.hash(newPassword, 12);

      const { error: historyInsertError } = await supabase
        .from('password_history')
        .insert({
          user_id: userId,
          hashed_password: hashedNewPassword,
        });

      if (historyInsertError) {
        console.error(
          'Failed to save password to history:',
          historyInsertError,
        );
        // Don't fail the request if history saving fails
      } else {
        console.log('Password saved to history');
      }

      // Optional: Clean up old password history (keep only last 10)
      // const { data: allHistory, error: cleanupFetchError } = await supabase
      //   .from('password_history')
      //   .select('id, created_at')
      //   .eq('user_id', userId)
      //   .order('created_at', { ascending: false });

      // if (!cleanupFetchError && allHistory && allHistory.length > 10) {
      //   const toDelete = allHistory.slice(10); // Keep only first 10 (most recent)
      //   const deleteIds = toDelete.map(h => h.id);

      //   const { error: cleanupError } = await supabase
      //     .from('password_history')
      //     .delete()
      //     .in('id', deleteIds);

      //   if (cleanupError) {
      //     console.error('Failed to cleanup old password history:', cleanupError);
      //   } else {
      //     console.log('Cleaned up', toDelete.length, 'old password entries');
      //   }
      // }
    } catch (historyError) {
      console.error('Error inserting password to history:', historyError);
      return NextResponse.json(
        { error: 'Internal server error: ' + historyError.message },
        { status: 500 },
      );
      // Don't fail the request if history management fails
    }

    // Optional: Log the password reset event in your User table
    // try {
    //   // await supabase
    //   //   .from('User')
    //   //   .update({
    //   //     updated_at: new Date().toISOString(),
    //   //     // Add any other fields you want to update
    //   //   })
    //   //   .eq('user_id', authUser.id);

    //   console.log('User table updated with reset timestamp');
    // } catch (logError) {
    //   console.log(
    //     'Failed to update user table (field might not exist):',
    //     logError.message,
    //   );
    // }

    return NextResponse.json({
      success: true,
      message: 'Password has been reset successfully',
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 },
    );
  }
}
