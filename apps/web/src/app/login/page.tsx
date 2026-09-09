"use client";

import { type SyntheticEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(
    event: SyntheticEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        const body = await response.json();

        setError(body.error ?? "Unable to sign in");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Unable to sign in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-12">
        <div className="grid w-full gap-12 lg:grid-cols-2">
          <section className="flex flex-col justify-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue-700">
              QualityBank
            </p>

            <h1 className="max-w-xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              Banking built for confidence.
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-slate-600">
              Manage accounts, review transactions, transfer money and apply
              for loans from one secure place.
            </p>

            <div className="mt-10 rounded-xl border border-blue-100 bg-blue-50 p-5 text-sm text-slate-700">
              <p className="font-semibold text-slate-900">
                Quality Engineering Demo
              </p>
              <p className="mt-1">
                QualityBank is a demonstration application. No real banking
                services or real money are involved.
              </p>
            </div>
          </section>

          <section className="flex items-center justify-center">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <div>
                <h2 className="text-2xl font-semibold text-slate-950">
                  Sign in
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  Access your QualityBank account.
                </p>
              </div>

              <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-slate-800"
                  >
                    Email address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-950 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-slate-800"
                  >
                    Password
                  </label>

                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-950 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
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
                    disabled={isSubmitting}
                    className="w-full rounded-lg bg-blue-700 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                    {isSubmitting ? "Signing in..." : "Sign in"}
                </button>
              </form>

              <div className="mt-8 border-t border-slate-200 pt-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Demo account
                </p>

                <dl className="mt-3 space-y-1 text-sm">
                  <div>
                    <dt className="inline font-medium text-slate-700">
                      Email:{" "}
                    </dt>
                    <dd className="inline text-slate-600">
                      qa.customer@qualitybank.test
                    </dd>
                  </div>

                  <div>
                    <dt className="inline font-medium text-slate-700">
                      Password:{" "}
                    </dt>
                    <dd className="inline text-slate-600">
                      QualityBank123!
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}