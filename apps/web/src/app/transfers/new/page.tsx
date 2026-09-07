import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { TransferForm } from "./transfer-form";

export default async function NewTransferPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  const [accounts, beneficiaries] = await Promise.all([
    prisma.account.findMany({
      where: {
        userId: currentUser.id,
        status: "ACTIVE",
      },
      orderBy: {
        type: "asc",
      },
    }),
    prisma.beneficiary.findMany({
      where: {
        userId: currentUser.id,
      },
      orderBy: {
        name: "asc",
      },
    }),
  ]);

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
        <section>
          <p className="text-sm font-medium text-slate-500">
            Payments
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            Transfer money
          </h1>

          <p className="mt-2 text-slate-600">
            Send money to one of your saved beneficiaries.
          </p>
        </section>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <TransferForm
            accounts={accounts.map((account) => ({
              id: account.id,
              accountNumber: account.accountNumber,
              type: account.type,
              currency: account.currency,
              balanceMinor: account.balanceMinor.toString(),
            }))}
            beneficiaries={beneficiaries.map((beneficiary) => ({
              id: beneficiary.id,
              name: beneficiary.name,
              accountNumber: beneficiary.accountNumber,
              bankName: beneficiary.bankName,
            }))}
          />
        </div>
      </div>
    </main>
  );
}