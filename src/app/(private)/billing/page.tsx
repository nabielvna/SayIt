/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Header } from "@/components/dynamic-header";
import { useEffect, useState, useCallback } from "react";
import {
  IconCircleCheck,
  IconDatabase,
  IconSparkles,
  IconAlertCircle,
  IconLoader2,
  IconCalendar,
  IconX,
} from "@tabler/icons-react";
import { siteConfig } from "@/config/site";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  fetchBillingPlans,
  fetchBillingHistory,
  createPaymentTransaction,
  type BillingPlan,
  type BillingHistoryItem,
} from "@/services/billing.service";
import {
  getSubscriptionStatus,
  cancelSubscription,
  type SubscriptionStatusResponse,
} from "@/services/subscription.service";
import { ApiError } from "@/services/subscription.service";

// --- Type Declaration for Midtrans Snap ---
declare global {
  interface Window {
    snap: any;
  }
}

// --- Helper & UI Components ---

const LoadingIndicator = ({ text = "Loading..." }: { text?: string }) => (
  <div className="text-center text-zinc-500 py-10">
    <IconLoader2 className="w-8 h-8 mx-auto animate-spin" />
    <p className="mt-2">{text}</p>
  </div>
);

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="text-center text-red-500 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg flex items-center justify-center gap-2">
    <IconAlertCircle className="w-5 h-5" />
    <span>{message}</span>
  </div>
);

// --- Subscription Status Component ---
interface SubscriptionStatusCardProps {
  subscriptionStatus: SubscriptionStatusResponse;
  onCancel: () => void;
  isCancelling: boolean;
}

const SubscriptionStatusCard = ({
  subscriptionStatus,
  onCancel,
  isCancelling,
}: SubscriptionStatusCardProps) => {
  const { subscription, tokenBalance } = subscriptionStatus;
  if (!subscription) return null;

  const formattedEndDate = new Date(
    subscription.currentPeriodEnd
  ).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-center mb-2">
        Manage Your Subscription
      </h2>
      <p className="text-center text-zinc-500 dark:text-zinc-400 mb-6">
        You are currently subscribed to the {subscription.planName} plan.
      </p>
      <div className="bg-white dark:bg-zinc-800/90 border border-zinc-200 dark:border-zinc-700 rounded-2xl p-8 max-w-2xl mx-auto shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h3 className="text-xl font-bold text-violet-500">
              {subscription.planName} Plan
            </h3>
            <p
              className={`text-sm font-semibold capitalize ${
                subscription.status === "active"
                  ? "text-emerald-500"
                  : "text-amber-500"
              }`}
            >
              Status: {subscription.status}
            </p>
          </div>
          <div className="mt-4 sm:mt-0 text-left sm:text-right">
            <p className="text-sm text-zinc-600 dark:text-zinc-300 flex items-center gap-2">
              <IconCalendar className="w-4 h-4" />
              Renews on {formattedEndDate}
            </p>
          </div>
        </div>
        <div className="border-t border-zinc-200 dark:border-zinc-700 my-6"></div>
        <div className="flex justify-between items-center mb-6">
          <p className="text-lg font-semibold">Token Balance</p>
          <div className="flex items-center gap-2 text-sky-500 font-bold text-lg">
            <IconDatabase className="w-5 h-5" />
            <span>{tokenBalance.toLocaleString("id-ID")} Tokens</span>
          </div>
        </div>
        <button
          onClick={onCancel}
          disabled={isCancelling || subscription.status !== "active"}
          className="w-full mt-4 py-2.5 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center bg-red-500/10 text-red-500 hover:bg-red-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isCancelling ? (
            <IconLoader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <IconX className="w-4 h-4 mr-2" />
              <span>Cancel Subscription</span>
            </>
          )}
        </button>
        <p className="text-xs text-center mt-3 text-zinc-500 dark:text-zinc-400">
          If you cancel, you can still use your plan until {formattedEndDate}.
        </p>
      </div>
    </div>
  );
};

interface PlanCardProps {
  plan: BillingPlan;
  onSelectPlan: (priceId: string) => void;
  isProcessing: boolean;
}

const PlanCard = ({
  plan,
  onSelectPlan,
  isProcessing,
}: PlanCardProps) => {
  const price = plan.prices[0];
  if (!price) return null;

  const displayPrice = price.unitAmount ? price.unitAmount / 100 : 0;
  const cardClasses = `relative flex flex-col h-full rounded-2xl border bg-white dark:bg-zinc-800/90 p-8 shadow-sm transition-all border-zinc-200 dark:border-zinc-700 hover:shadow-lg hover:-translate-y-1`;

  const buttonClasses = `w-full mt-auto py-2.5 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed ${
    plan.isFeatured
      ? "bg-violet-500 text-white hover:bg-violet-600"
      : "bg-zinc-100 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-600"
  }`;

  return (
    <div key={plan.id} className={cardClasses}>
      {plan.isFeatured && (
        <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
          <span className="text-xs font-semibold text-white bg-violet-500 px-3 py-1 rounded-full flex items-center gap-1">
            <IconSparkles className="w-4 h-4" />
            Most Popular
          </span>
        </div>
      )}
      <h3 className="text-xl font-semibold mb-1">{plan.name}</h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
        {plan.description}
      </p>

      <div className="mb-6">
        <span className="text-4xl font-bold">
          Rp {displayPrice.toLocaleString("id-ID")}
        </span>
        <span className="text-zinc-500 dark:text-zinc-400">
          /{price.interval}
        </span>
      </div>

      <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300 mb-6 p-3 bg-zinc-100 dark:bg-zinc-700/50 rounded-lg">
        <IconDatabase className="w-5 h-5 text-sky-500 shrink-0" />
        <span>
          {plan.tokens
            ? `${plan.tokens.toLocaleString("id-ID")} Tokens/month`
            : "Unlimited Tokens"}
        </span>
      </div>

      <ul className="space-y-3 mb-8">
        {plan.features?.map((feature) => (
          <li key={feature} className="flex items-start">
            <IconCircleCheck className="w-5 h-5 text-emerald-500 mr-3 mt-0.5 shrink-0" />
            <span className="text-sm text-zinc-700 dark:text-zinc-300">
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <button
        onClick={() => onSelectPlan(price.id)}
        disabled={isProcessing}
        className={buttonClasses}
      >
        {isProcessing ? (
          <IconLoader2 className="w-5 h-5 animate-spin" />
        ) : (
          "Choose Plan"
        )}
      </button>
    </div>
  );
};

// --- Main Component ---

export default function BillingPage() {
  const [plans, setPlans] = useState<BillingPlan[]>([]);
  const [subscriptionStatus, setSubscriptionStatus] =
    useState<SubscriptionStatusResponse | null>(null);
  const [history, setHistory] = useState<BillingHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [payingPriceId, setPayingPriceId] = useState<string | null>(null);

  const { getToken, isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  // Effect to load Midtrans Snap.js script
  useEffect(() => {
    const snapScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;

    if (!clientKey) {
      console.error("Midtrans client key is not set.");
      return;
    }

    const script = document.createElement("script");
    script.src = snapScriptUrl;
    script.setAttribute("data-client-key", clientKey);
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const loadData = useCallback(async () => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      router.push("/sign-in?redirect_url=/billing");
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsHistoryLoading(true);
    setHistoryError(null);

    try {
      const authToken = await getToken();
      if (!authToken) throw new ApiError("Authentication token not found.", 401);

      const [plansResult, statusResult, historyResult] = await Promise.allSettled([
        fetchBillingPlans(authToken),
        getSubscriptionStatus(authToken),
        fetchBillingHistory(authToken),
      ]);

      // Plans
      if (plansResult.status === "fulfilled") {
        setPlans(plansResult.value);
      } else {
        const { reason } = plansResult;
        console.error("Failed to fetch billing plans:", reason);
        if (reason instanceof ApiError && reason.status === 401) {
          router.push("/sign-in?redirect_url=/billing");
          return;
        }
        setError(reason?.message || "Failed to load billing plans.");
      }

      // Subscription Status
      if (statusResult.status === "fulfilled") {
        setSubscriptionStatus(statusResult.value);
      } else {
        const { reason } = statusResult;
        console.error("Failed to fetch subscription status:", reason);
        if (reason instanceof ApiError && reason.status === 401) {
          router.push("/sign-in?redirect_url=/billing");
          return;
        }
      }

      // Billing History
      if (historyResult.status === "fulfilled") {
        setHistory(historyResult.value);
      } else {
        console.error("Failed to fetch billing history:", historyResult.reason);
        setHistoryError(
          historyResult.reason instanceof Error
            ? historyResult.reason.message
            : "Could not load billing history."
        );
      }
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        router.push("/sign-in?redirect_url=/billing");
      } else {
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
      setIsHistoryLoading(false);
    }
  }, [getToken, isLoaded, isSignedIn, router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSelectPlan = useCallback(
    async (priceId: string) => {
      if (!isSignedIn) {
        router.push("/sign-in?redirect_url=/billing");
        return;
      }

      setPayingPriceId(priceId);
      setError(null);

      try {
        const authToken = await getToken();
        if (!authToken) throw new Error("Authentication token not found.");

        const { token: paymentToken } = await createPaymentTransaction(
          priceId,
          authToken
        );

        if (paymentToken && window.snap) {
          window.snap.pay(paymentToken, {
            onSuccess: () => {
              loadData();
            },
            onPending: (result: any) => console.log("Payment pending.", result),
            onError: () => setError("Payment failed. Please try again."),
            onClose: () => setPayingPriceId(null),
          });
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An error occurred while initiating payment."
        );
        setPayingPriceId(null);
      }
    },
    [getToken, isSignedIn, loadData, router]
  );

  const handleCancelSubscription = useCallback(async () => {
    if (!window.confirm("Are you sure you want to cancel your subscription?")) {
      return;
    }

    setIsCancelling(true);
    setError(null);
    try {
      const authToken = await getToken();
      if (!authToken) throw new Error("Authentication token not found.");

      await cancelSubscription(authToken);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to cancel subscription.");
    } finally {
      setIsCancelling(false);
    }
  }, [getToken, loadData]);

  const renderPlanContent = () => {
    if (plans.length === 0) {
      return <div className="text-center text-zinc-500 py-10">No billing plans are available at this time.</div>;
    }

    return (
      <div className="mt-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold">Choose Your Plan</h1>
          <p className="text-md text-zinc-500 dark:text-zinc-400 mt-2">
            {siteConfig.appName} is free to use, upgrade to unlock more features.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onSelectPlan={handleSelectPlan}
              isProcessing={payingPriceId === plan.prices[0]?.id}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen dark:bg-zinc-900/20">
      <Header>Flexible plans for everyone.</Header>

      <main className="row-start-2 w-full max-w-6xl mx-auto px-6 py-8 space-y-12">
        {isLoading ? (
          <LoadingIndicator text="Loading your billing details…" />
        ) : (
          <>
            {subscriptionStatus?.subscription && (
              <SubscriptionStatusCard
                subscriptionStatus={subscriptionStatus}
                onCancel={handleCancelSubscription}
                isCancelling={isCancelling}
              />
            )}

            {error ? (
              <ErrorMessage message={error} />
            ) : (
              renderPlanContent()
            )}

            {/* Billing History Section */}
            <section className="mt-16">
              <h2 className="text-2xl font-bold mb-4">Your Billing History</h2>

              {isHistoryLoading ? (
                <LoadingIndicator text="Fetching billing history…" />
              ) : historyError ? (
                <ErrorMessage message={historyError} />
              ) : history.length === 0 ? (
                <p className="text-center text-zinc-500">No past invoices found.</p>
              ) : (
                <ul className="space-y-4">
                  {history.map((item) => (
                    <li
                      key={item.id}
                      className="p-4 border rounded-lg bg-white dark:bg-zinc-800/90"
                    >
                      <div className="flex justify-between">
                        <span className="font-semibold">
                          {new Date(item.createdAt).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                        <span>
                          Rp {(item.amount).toLocaleString("id-ID")}{" "}
                          {item.currency.toUpperCase()}
                        </span>
                      </div>
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-sm text-zinc-500 capitalize">
                          {item.status}
                        </span>
                        {item.invoicePdf && (
                          <a
                            href={item.invoicePdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium underline"
                          >
                            View Invoice
                          </a>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
