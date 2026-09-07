import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";

import { LoanForm } from "./loan-form";

export default async function LoanApplicationPage() {
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
          Borrowing
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
          Apply for a personal loan
        </h1>

        <p className="mt-2 text-slate-600">
          Enter your details to receive an immediate demo eligibility decision.
        </p>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <LoanForm />
        </div>

        <p className="mt-4 text-xs text-slate-500">
          QualityBank is a demonstration application. Loan decisions shown here
          are generated using simplified test rules.
        </p>
      </div>
    </main>
  );
}