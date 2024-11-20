import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';

function PendingUserPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-lg">
        {/* Status Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
              <Clock className="h-10 w-10 animate-pulse text-blue-600" />
            </div>
            <div className="absolute -bottom-1 -right-1 rounded-full bg-yellow-400 p-2">
              <AlertCircle className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Application Pending
          </h1>
          <p className="text-gray-600">
            Your application is currently under review by our administrative
            team.
          </p>
        </div>

        {/* Status Timeline */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-500" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                Application Submitted
              </p>
              <p className="text-xs text-gray-500">
                Your application has been received
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 border-blue-500">
              <div className="h-2 w-2 animate-pulse rounded-full bg-blue-500"></div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Under Review</p>
              <p className="text-xs text-gray-500">
                Awaiting administrative approval
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 opacity-50">
            <div className="h-5 w-5 flex-shrink-0 rounded-full border-2 border-gray-300"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                Access Granted
              </p>
              <p className="text-xs text-gray-500">
                Pending approval completion
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 rounded-lg bg-blue-50 p-4">
          <p className="text-sm text-blue-800">
            We'll notify you via email once your application has been reviewed.
          </p>
        </div>
      </div>
    </div>
  );
}

export default PendingUserPage;
