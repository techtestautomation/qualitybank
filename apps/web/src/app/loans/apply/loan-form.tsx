"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function LoanForm() {
  const router = useRouter();

  const [amount, setAmount] = useState("");
  const [termMonths, setTermMonths] = useState("36");
  const [annualIncome, setAnnualIncome] = useState("");
  const [employmentStatus, setEmploymentStatus] =
    useState("EMPLOYED");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/loans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          termMonths: Number(termMonths),
          annualIncome,
          employmentStatus,
        }),
      });

      const body = await response.json();

      if (!response.ok) {
        setError(body.error ?? "Unable to submit loan application");
        return;
      }

      router.push(`/loans/${body.application.id}`);
    } catch {
      setError("Unable to submit loan application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="loanAmount"
          className="block text-sm font-medium text-slate-800"
        >
          Loan amount (NOK)
        </label>

        <input
          id="loanAmount"
          name="loanAmount"
          type="text"
          inputMode="decimal"
          required
          placeholder="100000"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-950"
        />
      </div>

      <div>
        <label
          htmlFor="termMonths"
          className="block text-sm font-medium text-slate-800"
        >
          Loan term
        </label>

        <select
          id="termMonths"
          name="termMonths"
          value={termMonths}
          onChange={(event) => setTermMonths(event.target.value)}
          className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-950"
        >
          <option value="12">12 months</option>
          <option value="24">24 months</option>
          <option value="36">36 months</option>
          <option value="48">48 months</option>
          <option value="60">60 months</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="annualIncome"
          className="block text-sm font-medium text-slate-800"
        >
          Annual income (NOK)
        </label>

        <input
          id="annualIncome"
          name="annualIncome"
          type="text"
          inputMode="decimal"
          required
          placeholder="750000"
          value={annualIncome}
          onChange={(event) => setAnnualIncome(event.target.value)}
          className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-950"
        />
      </div>

      <div>
        <label
          htmlFor="employmentStatus"
          className="block text-sm font-medium text-slate-800"
        >
          Employment status
        </label>

        <select
          id="employmentStatus"
          name="employmentStatus"
          value={employmentStatus}
          onChange={(event) =>
            setEmploymentStatus(event.target.value)
          }
          className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-950"
        >
          <option value="EMPLOYED">Employed</option>
          <option value="SELF_EMPLOYED">Self-employed</option>
          <option value="UNEMPLOYED">Unemployed</option>
          <option value="STUDENT">Student</option>
          <option value="RETIRED">Retired</option>
        </select>
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
        disabled={isSubmitting}
        className="w-full rounded-lg bg-blue-700 px-4 py-3 font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting
          ? "Submitting application..."
          : "Check eligibility"}
      </button>
    </form>
  );
}