"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Account = {
  id: string;
  accountNumber: string;
  type: string;
  currency: string;
  balanceMinor: string;
};

type Beneficiary = {
  id: string;
  name: string;
  accountNumber: string;
  bankName: string;
};

type TransferFormProps = {
  accounts: Account[];
  beneficiaries: Beneficiary[];
};

function formatMoney(balanceMinor: string, currency: string) {
  return new Intl.NumberFormat("en-NO", {
    style: "currency",
    currency,
  }).format(Number(BigInt(balanceMinor)) / 100);
}

export function TransferForm({
  accounts,
  beneficiaries,
}: TransferFormProps) {
  const router = useRouter();

  const [fromAccountId, setFromAccountId] = useState(
    accounts[0]?.id ?? "",
  );
  const [beneficiaryId, setBeneficiaryId] = useState(
    beneficiaries[0]?.id ?? "",
  );
  const [amount, setAmount] = useState("");
  const [reference, setReference] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/transfers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fromAccountId,
          beneficiaryId,
          amount,
          reference,
        }),
      });

      const body = await response.json();

      if (!response.ok) {
        setError(body.error ?? "Unable to complete transfer");
        return;
      }

      router.push(`/transfers/${body.transfer.id}`);
    } catch {
      setError("Unable to complete transfer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="fromAccount"
          className="block text-sm font-medium text-slate-800"
        >
          From account
        </label>

        <select
          id="fromAccount"
          value={fromAccountId}
          onChange={(event) => setFromAccountId(event.target.value)}
          required
          className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-950"
        >
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.type.toLowerCase()} — {account.accountNumber} —{" "}
              {formatMoney(account.balanceMinor, account.currency)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="beneficiary"
          className="block text-sm font-medium text-slate-800"
        >
          Beneficiary
        </label>

        <select
          id="beneficiary"
          value={beneficiaryId}
          onChange={(event) => setBeneficiaryId(event.target.value)}
          required
          className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-950"
        >
          {beneficiaries.map((beneficiary) => (
            <option key={beneficiary.id} value={beneficiary.id}>
              {beneficiary.name} — {beneficiary.accountNumber}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="amount"
          className="block text-sm font-medium text-slate-800"
        >
          Amount (NOK)
        </label>

        <input
          id="amount"
          name="amount"
          type="text"
          inputMode="decimal"
          required
          placeholder="5000.00"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-950"
        />
      </div>

      <div>
        <label
          htmlFor="reference"
          className="block text-sm font-medium text-slate-800"
        >
          Message
        </label>

        <input
          id="reference"
          name="reference"
          type="text"
          maxLength={140}
          value={reference}
          onChange={(event) => setReference(event.target.value)}
          className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-950"
        />
      </div>

      {error ? (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={
          isSubmitting ||
          accounts.length === 0 ||
          beneficiaries.length === 0
        }
        className="w-full rounded-lg bg-blue-700 px-4 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Processing transfer..." : "Transfer money"}
      </button>
    </form>
  );
}