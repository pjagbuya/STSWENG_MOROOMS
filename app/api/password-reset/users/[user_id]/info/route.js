// app/api/users/[user_id]/info/route.js
import { APILogger } from '@/utils/logger_actions';
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const supabase = createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user info from your database
    const { data: userInfo, error } = await supabase
      .from('Users') // Replace with your actual table name
      .select('*')
      .eq('user_id', params.user_id)
      .single();

    if (error) {
      // console.error('Error fetching user info:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Return user info
    return NextResponse.json({
      data: {
        userId: user.id,
        profileURL: userInfo?.user_profilepic || null,
        firstName: userInfo?.user_firstname || null,
        lastName: userInfo?.user_lastname || null,
        // Add other fields you need
      },
    });
  } catch (error) {
    // console.error('API Error:', error);
    await APILogger.log(
      'Fetch User Info',
      'GET',
      'Users',
      null,
      { user_id: params.user_id },
      error,
    );
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
