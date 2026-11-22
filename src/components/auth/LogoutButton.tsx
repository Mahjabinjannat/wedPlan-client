
"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const result = await authClient.signOut();

    if (result.error) {
      toast.error("Unable to log out.");
      return;
    }

    toast.success("Logged out successfully.");

    router.push("/login");
    router.refresh();
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      onClick={handleLogout}
      className="h-10 rounded-xl px-4 text-[#8b2339] hover:bg-[#f8edef]"
    >
      Logout
    </Button>
  );
}
