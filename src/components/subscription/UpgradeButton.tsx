"use client";

import { useState } from "react";
import { Crown } from "lucide-react";
import { toast } from "sonner";

import { secureFetch } from "@/lib/api/secure-fetch";
import { Button } from "@/components/ui/button";

interface Props {
  label: string;
}

export default function UpgradeButton({ label }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleUpgrade() {
    setLoading(true);

    try {
      // The server creates a Stripe Checkout Session for the logged-in vendor
      const result = await secureFetch<{ url: string }>(
        "/payments/create-checkout-session",
        { method: "POST" }
      );

      // Go to the Stripe Checkout page
      window.location.href = result.url;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not start payment."
      );
      setLoading(false);
    }
  }

  return (
    <Button
      type="button"
      onClick={handleUpgrade}
      disabled={loading}
      className="h-12 w-full rounded-xl"
    >
      <Crown />
      {loading ? "Redirecting to Stripe..." : label}
    </Button>
  );
}
