import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function formatMoney(amountMinor: bigint) {
  return new Intl.NumberFormat("en-NO", {
    style: "currency",
    currency: "NOK",
  }).format(Number(amountMinor) / 100);
}

type TransferReceiptProps = {
  params: Promise<{
    transferId: string;
  }>;
};

export default async function TransferReceiptPage({
  params,
}: TransferReceiptProps) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  const { transferId } = await params;

  const transfer = await prisma.transfer.findFirst({
    where: {
      id: transferId,
      fromAccount: {
        userId: currentUser.id,
      },
    },
    include: {
      fromAccount: true,
      beneficiary: true,
    },
  });

  if (!transfer) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-xl text-green-700">
            ✓
          </div>

          <h1 className="mt-6 text-3xl font-bold text-slate-950">
            Transfer completed
          </h1>

          <p className="mt-2 text-slate-600">
            Your payment has been processed successfully.
          </p>

          <dl className="mt-8 divide-y divide-slate-200 border-y border-slate-200">
            <div className="flex justify-between py-4">
              <dt className="text-slate-600">Amount</dt>
              <dd className="font-semibold text-slate-950">
                {formatMoney(transfer.amountMinor)}
              </dd>
            </div>

            <div className="flex justify-between py-4">
              <dt className="text-slate-600">Beneficiary</dt>
              <dd className="font-medium text-slate-950">
                {transfer.beneficiary.name}
              </dd>
            </div>

            <div className="flex justify-between py-4">
              <dt className="text-slate-600">From account</dt>
              <dd className="font-medium text-slate-950">
                {transfer.fromAccount.accountNumber}
              </dd>
            </div>

            <div className="flex justify-between py-4">
              <dt className="text-slate-600">Transfer number</dt>
              <dd className="font-mono text-sm text-slate-950">
                {transfer.transferNumber}
              </dd>
            </div>

            {transfer.reference ? (
              <div className="flex justify-between py-4">
                <dt className="text-slate-600">Message</dt>
                <dd className="font-medium text-slate-950">
                  {transfer.reference}
                </dd>
              </div>
            ) : null}
          </dl>

          <div className="mt-8 flex gap-3">
            <Link
              href={`/accounts/${transfer.fromAccountId}`}
              className="rounded-lg bg-blue-700 px-5 py-2.5 font-semibold text-white hover:bg-blue-800"
            >
              View account
            </Link>

            <Link
              href="/dashboard"
              className="rounded-lg border border-slate-300 px-5 py-2.5 font-semibold text-slate-700 hover:bg-slate-50"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}