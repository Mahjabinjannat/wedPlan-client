import { requireUser } from "@/lib/require-user";
import { db } from "@/lib/mongodb";
import UsersTable, { type UserItem } from "@/components/admin/UsersTable";

function toDateString(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  return String(value ?? "");
}

export default async function ManageUsersPage() {
  await requireUser(["admin"]);

  const records = await db
    .collection("user")
    .find({})
    .sort({ createdAt: -1, _id: -1 })
    .toArray();

  const users: UserItem[] = records.map((record) => {
    const rawRole = String(record.role ?? "customer");

    return {
      id: String(record._id),
      name: String(record.name ?? ""),
      email: String(record.email ?? ""),
      image: typeof record.image === "string" ? record.image : "",
      role:
        rawRole === "vendor" || rawRole === "admin" ? rawRole : "customer",
      isBlocked: record.isBlocked === true,
      businessName: String(record.businessName ?? ""),
      subscriptionPlan: String(record.subscriptionPlan ?? "free"),
      createdAt: toDateString(record.createdAt),
    };
  });

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 border-b border-[#eadfda] pb-5">
        <h1 className="font-serif text-3xl font-bold text-[#2b2023]">
          Manage Users
        </h1>
        <p className="mt-2 text-sm text-[#806c72]">
          View registered customers and vendors, search accounts, and block or
          unblock users.
        </p>
      </div>

      <UsersTable users={users} />
    </div>
  );
}
