import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";

export default async function ProfilePage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link
            href="/dashboard"
            className="text-xl font-bold tracking-tight text-blue-700"
          >
            QualityBank
          </Link>

          <Link
            href="/dashboard"
            className="text-sm font-medium text-slate-700 hover:text-blue-700"
          >
            Back to dashboard
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-10">
        <p className="text-sm font-medium text-slate-500">
          Customer
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
          Profile
        </h1>

        <p className="mt-2 text-slate-600">
          Your QualityBank customer information.
        </p>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <dl className="divide-y divide-slate-200">
            <div className="flex justify-between gap-6 py-4">
              <dt className="text-slate-600">First name</dt>
              <dd className="font-medium text-slate-950">
                {currentUser.firstName}
              </dd>
            </div>

            <div className="flex justify-between gap-6 py-4">
              <dt className="text-slate-600">Last name</dt>
              <dd className="font-medium text-slate-950">
                {currentUser.lastName}
              </dd>
            </div>

            <div className="flex justify-between gap-6 py-4">
              <dt className="text-slate-600">Email</dt>
              <dd className="font-medium text-slate-950">
                {currentUser.email}
              </dd>
            </div>

            <div className="flex justify-between gap-6 py-4">
              <dt className="text-slate-600">Customer status</dt>
              <dd className="font-semibold text-slate-950">
                {currentUser.status}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </main>
  );
}