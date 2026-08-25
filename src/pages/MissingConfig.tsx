import { Mortarboard01Icon } from "hugeicons-react";
import { school } from "../data/mock";

export default function MissingConfig() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-8 shadow-xs">
        <div className="flex size-12 items-center justify-center rounded-xl bg-brand-600 text-white shadow-md">
          <Mortarboard01Icon size={26} />
        </div>
        <h1 className="mt-5 text-2xl font-bold tracking-tight text-gray-900">Portal is not configured</h1>
        <p className="mt-2 text-sm text-gray-500">
          {school.name} needs Supabase keys at build time. Add these in Vercel → Settings → Environment Variables, then redeploy:
        </p>
        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm font-medium text-gray-800">
          <li>VITE_SUPABASE_URL</li>
          <li>VITE_SUPABASE_ANON_KEY</li>
        </ul>
        <p className="mt-4 text-sm text-gray-500">
          Copy the values from your local <code className="rounded bg-gray-100 px-1 py-0.5 text-xs">.env.local</code> file. Vite inlines them during the production build, so a new deployment is required after they are added.
        </p>
      </div>
    </div>
  );
}
