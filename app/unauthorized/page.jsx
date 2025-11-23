import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="max-w-md px-6 text-center">
        <div className="mb-8">
          <h1 className="mb-2 text-6xl font-bold text-gray-900">403</h1>
          <h2 className="mb-4 text-2xl font-semibold text-gray-700">
            Access Denied
          </h2>
          <p className="text-gray-600">
            You don't have permission to access this page. Please contact your
            administrator if you believe this is an error.
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Go to Homepage
          </Link>

          <Link
            href="/login"
            className="inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Login with Different Account
          </Link>
        </div>
      </div>
    </div>
  );
}
