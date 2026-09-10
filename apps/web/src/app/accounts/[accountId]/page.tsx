import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  TransactionType,
  type Prisma,
} from "@/generated/prisma/client";

function formatMoney(amountMinor: bigint, currency: string) {
  return new Intl.NumberFormat("en-NO", {
    style: "currency",
    currency,
  }).format(Number(amountMinor) / 100);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);
}

type AccountPageProps = {
  params: Promise<{
    accountId: string;
  }>;
  searchParams: Promise<{
    type?: string;
  }>;
};

export default async function AccountPage({
  params,
  searchParams,
}: AccountPageProps) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  const { accountId } = await params;

  const { type } = await searchParams;

  const transactionFilter: Prisma.TransactionWhereInput | undefined =
    type === "in"
        ? {
            type: {
            in: [
                TransactionType.CREDIT,
                TransactionType.TRANSFER_IN,
            ],
            },
        }
        : type === "out"
        ? {
            type: {
                in: [
                TransactionType.DEBIT,
                TransactionType.TRANSFER_OUT,
                ],
            },
            }
        : undefined;

  const account = await prisma.account.findFirst({
    where: {
      id: accountId,
      userId: currentUser.id,
    },
    include: {
      transactions: {
        where: transactionFilter,
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!account) {
    notFound();
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

      <div className="mx-auto max-w-6xl px-6 py-10">
        <section>
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
            {account.type.toLowerCase()} account
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-950">
            {account.accountNumber}
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            Status: {account.status.toLowerCase()}
          </p>
        </section>

        <section
            aria-labelledby="available-balance-heading"
            className="mt-8 rounded-2xl bg-blue-700 p-8 text-white"
            >
            <p
                id="available-balance-heading"
                className="text-sm font-medium text-blue-100"
            >
                Available balance
            </p>

            <p
                data-testid="available-balance"
                className="mt-2 text-4xl font-bold"
                >
                {formatMoney(account.balanceMinor, account.currency)}
            </p>
        </section>

        <section
          className="mt-10"
          aria-labelledby="transactions-heading"
        >
          <div>
            <h2
              id="transactions-heading"
              className="text-xl font-semibold text-slate-950"
            >
              Transaction history
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              Recent activity for this account.
            </p>
            <nav
                aria-label="Transaction filters"
                className="mt-5 flex gap-2"
                >
                <Link
                    href={`/accounts/${account.id}`}
                    aria-current={!type ? "page" : undefined}
                    className={`rounded-lg px-4 py-2 text-sm font-medium ${
                    !type
                        ? "bg-blue-700 text-white"
                        : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                >
                    All
                </Link>

                <Link
                    href={`/accounts/${account.id}?type=in`}
                    aria-current={type === "in" ? "page" : undefined}
                    className={`rounded-lg px-4 py-2 text-sm font-medium ${
                    type === "in"
                        ? "bg-blue-700 text-white"
                        : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                >
                    Money in
                </Link>

                <Link
                    href={`/accounts/${account.id}?type=out`}
                    aria-current={type === "out" ? "page" : undefined}
                    className={`rounded-lg px-4 py-2 text-sm font-medium ${
                    type === "out"
                        ? "bg-blue-700 text-white"
                        : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                >
                    Money out
                </Link>
                </nav>
          </div>

          {account.transactions.length === 0 ? (
            <div className="mt-6 rounded-xl border border-slate-200 bg-white p-8 text-center">
              <p className="font-medium text-slate-900">
                No transactions yet
              </p>

              <p className="mt-1 text-sm text-slate-600">
                Transactions will appear here once account activity begins.
              </p>
            </div>
          ) : (
            <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
              <table className="w-full text-left">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                      Date
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                      Description
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                      Type
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">
                      Amount
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {account.transactions.map((transaction) => {
                    const isCredit =
                      transaction.type === "CREDIT" ||
                      transaction.type === "TRANSFER_IN";

                    return (
                      <tr key={transaction.id}>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {formatDate(transaction.createdAt)}
                        </td>

                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-slate-900">
                              {transaction.description}
                            </p>

                            {transaction.reference ? (
                              <p className="mt-1 text-xs text-slate-500">
                                Ref: {transaction.reference}
                              </p>
                            ) : null}
                          </div>
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-600">
                          {transaction.type
                            .toLowerCase()
                            .replaceAll("_", " ")}
                        </td>

                        <td
                          className={`px-6 py-4 text-right font-medium ${
                            isCredit
                              ? "text-green-700"
                              : "text-slate-900"
                          }`}
                        >
                          {isCredit ? "+" : "-"}
                          {formatMoney(
                            transaction.amountMinor,
                            account.currency,
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}