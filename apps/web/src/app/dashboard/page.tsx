import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { LogoutButton } from "./logout-button";

function formatMoney(amountMinor: bigint, currency: string) {
  return new Intl.NumberFormat("en-NO", {
    style: "currency",
    currency,
  }).format(Number(amountMinor) / 100);
}

export default async function DashboardPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: currentUser.id,
    },
    include: {
      accounts: {
        orderBy: {
          type: "asc",
        },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  const totalBalanceMinor = user.accounts.reduce(
    (total, account) => total + account.balanceMinor,
    0n,
  );

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <span className="text-xl font-bold tracking-tight text-blue-700">
              QualityBank
            </span>
          </div>

          <div className="flex items-center gap-6">
            <span className="hidden text-sm text-slate-600 sm:block">
              {user.firstName} {user.lastName}
            </span>

            <Link
                href="/profile"
                className="text-sm font-medium text-slate-700 hover:text-blue-700"
            >
                Profile
            </Link>

            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <section>
          <p className="text-sm font-medium text-slate-500">
            Personal banking
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            Welcome back, {user.firstName}
          </h1>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
                href="/transfers/new"
                className="inline-flex rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
            >
                Transfer money
            </Link>

            <Link
                href="/loans/apply"
                className="inline-flex rounded-lg border border-blue-700 px-5 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-50"
            >
                Apply for loan
            </Link>
          </div>

          <p className="mt-2 text-slate-600">
            Here&apos;s an overview of your finances.
          </p>
        </section>

        <section
          aria-labelledby="balance-heading"
          className="mt-10 rounded-2xl bg-blue-700 p-8 text-white"
        >
          <p
            id="balance-heading"
            className="text-sm font-medium text-blue-100"
          >
            Total balance
          </p>

          <p className="mt-2 text-4xl font-bold tracking-tight">
            {formatMoney(totalBalanceMinor, "NOK")}
          </p>

          <p className="mt-3 text-sm text-blue-100">
            Across {user.accounts.length} accounts
          </p>
        </section>

        <section className="mt-10" aria-labelledby="accounts-heading">
          <div className="flex items-end justify-between">
            <div>
              <h2
                id="accounts-heading"
                className="text-xl font-semibold text-slate-950"
              >
                Your accounts
              </h2>

              <p className="mt-1 text-sm text-slate-600">
                Current balances across your QualityBank accounts.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {user.accounts.map((account) => (
            <Link
                key={account.id}
                href={`/accounts/${account.id}`}
                className="block rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                <article>
                    <div className="flex items-start justify-between">
                    <div>
                        <h3 className="font-semibold capitalize text-slate-950">
                        {account.type.toLowerCase()} account
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                        {account.accountNumber}
                        </p>
                    </div>

                    <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                        {account.status.toLowerCase()}
                    </span>
                    </div>

                    <p className="mt-8 text-sm text-slate-500">
                    Available balance
                    </p>

                    <p className="mt-1 text-2xl font-semibold text-slate-950">
                    {formatMoney(account.balanceMinor, account.currency)}
                    </p>

                    <p className="mt-6 text-sm font-medium text-blue-700">
                    View account details →
                    </p>
                </article>
            </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}