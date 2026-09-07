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

type LoanResultPageProps = {
  params: Promise<{
    applicationId: string;
  }>;
};

export default async function LoanResultPage({
  params,
}: LoanResultPageProps) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  const { applicationId } = await params;

  const application =
    await prisma.loanApplication.findFirst({
      where: {
        id: applicationId,
        userId: currentUser.id,
      },
    });

  if (!application) {
    notFound();
  }

  const approved = application.status === "APPROVED";

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div
            className={
              approved
                ? "flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-xl text-green-700"
                : "flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-700"
            }
          >
            {approved ? "✓" : "!"}
          </div>

          <h1 className="mt-6 text-3xl font-bold text-slate-950">
            {approved
              ? "Loan application approved"
              : "Loan application not approved"}
          </h1>

          <p className="mt-2 text-slate-600">
            {approved
              ? "Your demo eligibility assessment was successful."
              : "Your application does not meet the current demo eligibility rules."}
          </p>

          <dl className="mt-8 divide-y divide-slate-200 border-y border-slate-200">
            <div className="flex justify-between py-4">
              <dt className="text-slate-600">
                Loan amount
              </dt>

              <dd className="font-semibold text-slate-950">
                {formatMoney(application.amountMinor)}
              </dd>
            </div>

            <div className="flex justify-between py-4">
              <dt className="text-slate-600">
                Term
              </dt>

              <dd className="font-medium text-slate-950">
                {application.termMonths} months
              </dd>
            </div>

            <div className="flex justify-between py-4">
              <dt className="text-slate-600">
                Employment
              </dt>

              <dd className="font-medium text-slate-950">
                {application.employmentStatus.replaceAll("_", " ")}
              </dd>
            </div>

            <div className="flex justify-between py-4">
              <dt className="text-slate-600">
                Decision
              </dt>

              <dd className="font-semibold text-slate-950">
                {application.status}
              </dd>
            </div>

            {approved &&
            application.interestRateBps !== null ? (
              <div className="flex justify-between py-4">
                <dt className="text-slate-600">
                  Interest rate
                </dt>

                <dd className="font-semibold text-slate-950">
                  {(
                    application.interestRateBps / 100
                  ).toFixed(2)}
                  %
                </dd>
              </div>
            ) : null}
          </dl>

          <div className="mt-8 flex gap-3">
            <Link
              href="/loans/apply"
              className="rounded-lg bg-blue-700 px-5 py-2.5 font-semibold text-white hover:bg-blue-800"
            >
              New application
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