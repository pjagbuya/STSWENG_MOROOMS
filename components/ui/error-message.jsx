'use client';

export function ErrorMessage({ error }) {
  if (!error) return null;

  return (
    <div className="mb-4 rounded-md bg-red-50 p-3">
      <p className="text-sm text-red-600">{error}</p>
    </div>
  );
}
