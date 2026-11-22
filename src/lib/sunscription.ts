
import "server-only";

export function getPremiumSubscription(
  plan: unknown,
  expiresAt: unknown
): {
  isPremium: boolean;
  expiry: Date | null;
} {
  if (!expiresAt) {
    return {
      isPremium: false,
      expiry: null,
    };
  }

  const expiry = new Date(String(expiresAt));

  if (Number.isNaN(expiry.getTime())) {
    return {
      isPremium: false,
      expiry: null,
    };
  }

  return {
    isPremium:
      plan === "premium" &&
      expiry.getTime() > Date.now(),
    expiry,
  };
}
