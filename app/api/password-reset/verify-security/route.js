import { SecurityService } from '@/lib/security';
import { createClient } from '@/utils/supabase/server';
import { randomBytes } from 'crypto';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { email, answers } = await request.json();

    const supabase = createClient(true);

    // First, find the auth user by email
    const { data: authUsers, error: authError } =
      await supabase.auth.admin.listUsers();

    if (authError) {
      // console.error('Auth error:', authError);
      return NextResponse.json(
        { error: 'Failed to verify user' },
        { status: 500 },
      );
    }

    // Find user with matching email
    const authUser = authUsers.users.find(user => user.email === email);

    if (!authUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get user from your User table using the auth ID
    const { data: userData, error: userError } = await supabase
      .from('User') // Make sure this matches your actual table name
      .select('user_id') // Select both possible ID fields
      .eq('user_id', authUser.id) // Match with auth user ID
      .single();

    if (userError || !userData) {
      // console.error('User table error:', userError);
      await APILogger.log(
        'Verify Security Answers',
        'POST',
        'User',
        null,
        { email },
        userError || 'User profile not found',
      );
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 },
      );
    }

    // Use the correct ID field from your User table
    const userId = userData.user_id || userData.id;

    // Verify security answers
    const isValid = await SecurityService.verifySecurityAnswers(
      userId, // Use the User table ID, not the auth ID
      answers,
    );

    if (!isValid) {
      await APILogger.log(
        'Verify Security Answers',
        'POST',
        'User Security Answers',
        userId,
        { email },
        { error: 'Security answers are incorrect' },
      );
      return NextResponse.json(
        { error: 'Security answers are incorrect' },
        { status: 400 },
      );
    }

    // Generate reset token
    const resetToken = randomBytes(32).toString('hex');

    // Store the token with expiration (recommended)
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Optional: Store token in database for security
    try {
      await supabase
        .from('password_reset_tokens') // Create this table if you want to store tokens
        .insert({
          user_id: userId,
          token: resetToken,
          expires_at: expiresAt.toISOString(),
          used: false,
        });
    } catch (tokenError) {
      // console.log(
      //   'Token storage failed (table might not exist):',
      //   tokenError.message,
      // );
      // Continue without storing - just return the token
    }

    return NextResponse.json({
      success: true,
      token: resetToken,
      userId: userId, // Include this for the next step
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error) {
    // console.error('Error verifying security answers:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
