
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CompleteAuthPage() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    async function completeRegistration() {
      try {
        const response = await fetch(
          "/api/profile/become-vendor",
          {
            method: "POST",
          }
        );

        if (!response.ok) {
          throw new Error(
            "Could not activate vendor account."
          );
        }

        if (!cancelled) {
          toast.success(
            "Vendor account activated successfully!"
          );
          router.replace("/dashboard");
          router.refresh();
        }
      } catch (error) {
        if (!cancelled) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Registration could not be completed."
          );
          router.replace("/dashboard");
        }
      }
    }

    void completeRegistration();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <p className="text-[#806c72]">
        Completing your registration...
      </p>
    </div>
  );
}
