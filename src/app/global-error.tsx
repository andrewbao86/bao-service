"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 text-center antialiased">
        <h1 className="text-2xl font-semibold text-slate-900">Something went wrong</h1>
        <p className="mt-3 max-w-md text-slate-600">Please try again or return to the homepage.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
          >
            Try again
          </button>
          <Link
            href="/en"
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-white"
          >
            Go to homepage
          </Link>
        </div>
      </body>
    </html>
  );
}
