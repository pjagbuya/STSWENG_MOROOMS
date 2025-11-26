import { APILogger } from '../logger_actions';
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

// Helper function to log access control failures directly (for middleware use)
async function logAccessFailure(
  reason,
  path,
  userId = null,
  additionalData = {},
) {
  try {
    await APILogger.log(
      'ACCESS_CONTROL_FAILURE',
      'MIDDLEWARE',
      'access_control',
      userId,
      {
        reason,
        path,
        ...additionalData,
      },
      reason,
    );
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[Middleware] Failed to log access failure:', err);
    }
  }
}

export async function updateSession(request) {
  // Allow endpoints to api calls to be passed next
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/signup') &&
    !request.nextUrl.pathname.startsWith('/error') &&
    !request.nextUrl.pathname.startsWith('/auth')
  ) {
    // Log unauthenticated access attempt
    logAccessFailure('UNAUTHENTICATED', request.nextUrl.pathname, null, {
      attemptedPath: request.nextUrl.pathname,
    });
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (
    user &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/signup') &&
    !request.nextUrl.pathname.startsWith('/error') &&
    !request.nextUrl.pathname.startsWith('/pending') &&
    !request.nextUrl.pathname.startsWith('/auth')
  ) {
    // no user, potentially respond by redirecting the user to the login page
    const { data: isApproved } = await supabase.rpc('is_user_approved', {
      p_user_id: user.id,
    });
    // console.log('User ID:', user.id);
    // console.log('isApproved:', isApproved);
    if (!isApproved) {
      // Log unapproved user access attempt
      logAccessFailure('USER_NOT_APPROVED', request.nextUrl.pathname, user.id, {
        attemptedPath: request.nextUrl.pathname,
      });
      const url = request.nextUrl.clone();
      url.pathname = '/pending';
      // console.log(url);
      return NextResponse.redirect(url);
    }
  }

  if (request.nextUrl.pathname.includes('/users')) {
    const userId = request.nextUrl.pathname.split('/')[2];
    if (userId != user.id) {
      // Log user trying to access another user's profile
      logAccessFailure('USER_ID_MISMATCH', request.nextUrl.pathname, user.id, {
        attemptedUserId: userId,
        actualUserId: user.id,
      });
      const url = request.nextUrl.clone();
      url.pathname = '/error';
      return NextResponse.redirect(url);
    }
  }

  if (request.nextUrl.pathname.includes('/admin')) {
    const userId = request.nextUrl.pathname.split('/')[2];
    const { data, error } = await supabase.rpc('get_user_role', {
      p_user_id: user.id,
    });
    if (error) {
      // console.error(error);
    }
    if (!data || data.toLowerCase() != 'admin') {
      // Log non-admin trying to access admin route
      logAccessFailure(
        'ADMIN_ROUTE_UNAUTHORIZED',
        request.nextUrl.pathname,
        user.id,
        {
          userRole: data || 'unknown',
          requiredRole: 'admin',
        },
      );
      const url = request.nextUrl.clone();
      url.pathname = '/error';
      return NextResponse.redirect(url);
    }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
