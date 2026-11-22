
import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ObjectId } from "mongodb";

import { auth } from "@/lib/auth";
import { db } from "@/lib/mongodb";

export type UserRole = "customer" | "vendor" | "admin";

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: UserRole;
  isBlocked: boolean;
}

export async function requireUser(
  allowedRoles?: UserRole[]
): Promise<CurrentUser> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  if (!ObjectId.isValid(session.user.id)) {
    redirect("/login");
  }

  const user = await db.collection("user").findOne({
    _id: new ObjectId(session.user.id),
  });

  if (!user) {
    redirect("/login");
  }

  if (user.isBlocked === true) {
    redirect("/account-blocked");
  }

  if (
    user.role !== "customer" &&
    user.role !== "vendor" &&
    user.role !== "admin"
  ) {
    redirect("/access-denied");
  }

  const role: UserRole = user.role;

  if (allowedRoles && !allowedRoles.includes(role)) {
    redirect("/access-denied");
  }

  return {
    id: session.user.id,
    name: String(user.name ?? ""),
    email: String(user.email ?? ""),
    image: typeof user.image === "string" ? user.image : null,
    role,
    isBlocked: false,
  };
}
