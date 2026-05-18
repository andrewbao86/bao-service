import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <p className="text-sm font-medium text-brand-600">404</p>
      <h1 className="mt-2 text-2xl font-semibold text-slate-900">Page not found</h1>
      <p className="mt-3 max-w-md text-slate-600">
        The page you requested does not exist or may have moved.
      </p>
      <Link
        href="/en"
        className="mt-8 inline-flex rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
      >
        Back to homepage
      </Link>
    </main>
  );
}
