'use client';

export function ErrorMessage({ error, isLocked = false }) {
  if (!error) return null;

  return (
    <div
      className={`mb-4 rounded-md p-3 ${
        isLocked ? 'border border-orange-200 bg-orange-50' : 'bg-red-50'
      }`}
    >
      <p
        className={`text-sm font-medium ${
          isLocked ? 'text-orange-700' : 'text-red-600'
        }`}
      >
        {error}
      </p>
    </div>
  );
}
