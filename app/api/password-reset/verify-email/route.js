import { APILogger } from '@/utils/logger_actions';
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// MUST use service_role client
export async function POST(request) {
  try {
    const { email } = await request.json();
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const supabase = createClient(true); // ensure this returns a service-role client on server

    // 1) Get auth user by email via admin API
    // Use admin.getUserByEmail if available; otherwise listUsers({ email }) or query auth.users via SQL with service role.
    let authUserId = null;
    try {
      // Preferred: admin.getUserByEmail (supabase-js v2+)
      // const { data: authUser, error: authError } = await supabase.auth.admin.getUserByEmail(email);
      // if (authUser) authUserId = authUser.id;

      // Fallback: admin.listUsers with filter (works but paginates)
      const { data: listRes, error: listErr } =
        await supabase.auth.admin.listUsers({
          // pass filter if supported; otherwise fetch and find
          // note: some SDKs return { users: [...] }
        });
      if (listErr) throw listErr;
      const usersArray = listRes?.users ?? listRes ?? [];
      const found = usersArray.find(
        u => u.email?.toLowerCase() === email.toLowerCase(),
      );
      if (found) authUserId = found.id;
    } catch (e) {
      // console.error('Auth lookup failed:', e);
      // If admin lookup fails, avoid returning detailed errors to client
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 },
      );
    }

    // 2) If you don't want to reveal existence, return a neutral message here:
    if (!authUserId) {
      // Neutral response — prevents email enumeration.
      return NextResponse.json({
        success: true,
        // don't include whether user exists; front-end shows same UI e.g. "If an account exists..."
      });
    }

    // 3) Find your app user row referencing the auth user id
    // Adjust column name: I assume your users table has `auth_id` or `uid`. Replace 'auth_id' below.
    const { data: userRow, error: userErr } = await supabase
      .from('User')
      .select('user_id') // request the columns you use
      .eq('user_id', authUserId)
      .limit(1)
      .maybeSingle();

    if (userErr) {
      // console.error('User table lookup error:', userErr);
      await APILogger.log(
        'Fetch User Info',
        'GET',
        'User',
        null,
        { email },
        userErr,
      );
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 },
      );
    }
    if (!userRow) {
      // If your business logic requires telling the user, do so. Otherwise return neutral response.
      return NextResponse.json({
        success: true,
        // neutral — user not found in app table
      });
    }

    const appUserId = userRow.user_id ?? userRow.id;

    // 4) Load security answers/questions
    const { data: answers, error: answersErr } = await supabase
      .from('user_security_answers')
      .select('question_id, security_questions ( id, question )')
      .eq('user_id', appUserId);

    if (answersErr) {
      // console.error('Security answers lookup error:', answersErr);

      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 },
      );
    }

    if (!answers || answers.length < 1) {
      // If you require at least N questions, enforce here
      return NextResponse.json(
        { error: 'Security questions not found' },
        { status: 404 },
      );
    }

    const questions = answers.map(a => a.security_questions);

    // 5) Return only what you need. Avoid returning sensitive info (answers).
    return NextResponse.json({
      success: true,
      questions,
      userId: appUserId,
    });
  } catch (err) {
    // console.error('Unexpected error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
