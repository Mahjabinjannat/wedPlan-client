import { Receipt } from "lucide-react";

import { requireUser } from "@/lib/require-user";
import { db } from "@/lib/mongodb";
import { Badge } from "@/components/ui/badge";

const statusStyles: Record<string, string> = {
  paid: "border-emerald-300 bg-emerald-50 text-emerald-800",
  pending: "border-amber-300 bg-amber-50 text-amber-800",
  expired: "border-gray-300 bg-gray-50 text-gray-600",
};

function formatDate(value: unknown): string {
  const date = new Date(String(value ?? ""));
  return Number.isNaN(date.getTime())
    ? "-"
    : date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
}

// Read-only page: payment records are only written by the Stripe webhook.
export default async function TransactionsPage() {
  await requireUser(["admin"]);

  const records = await db
    .collection("transactions")
    .find({})
    .sort({ createdAt: -1, _id: -1 })
    .toArray();

  const totalPaid = records
    .filter((record) => record.status === "paid")
    .reduce((sum, record) => sum + Number(record.amount ?? 0), 0);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 border-b border-[#eadfda] pb-5">
        <h1 className="font-serif text-3xl font-bold text-[#2b2023]">
          Platform Transactions
        </h1>
        <p className="mt-2 text-sm text-[#806c72]">
          Vendor subscription payments verified by Stripe.
        </p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-[#eadfda] bg-white p-5 shadow-sm">
          <p className="text-sm text-[#806c72]">Total Transactions</p>
          <p className="mt-2 font-serif text-3xl font-bold text-[#2b2023]">
            {records.length}
          </p>
        </div>
        <div className="rounded-xl border border-[#eadfda] bg-white p-5 shadow-sm">
          <p className="text-sm text-[#806c72]">Total Paid</p>
          <p className="mt-2 font-serif text-3xl font-bold text-[#2b2023]">
            ${totalPaid.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {records.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#eadfda] bg-white px-5 py-14 text-center">
          <Receipt size={32} className="mx-auto text-[#8c2338]" />
          <p className="mt-3 font-medium text-[#2b2023]">No transactions yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#eadfda] bg-white shadow-sm">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-[#fcfaf9] text-xs uppercase text-[#806c72]">
              <tr>
                <th className="px-4 py-3">Vendor</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => {
                const status = String(record.status ?? "pending");

                return (
                  <tr
                    key={String(record._id)}
                    className="border-t border-[#eadfda]"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-[#2b2023]">
                        {String(record.vendorName ?? "Vendor")}
                      </p>
                      <p className="text-xs text-[#806c72]">
                        {String(record.vendorEmail ?? "")}
                      </p>
                    </td>
                    <td className="px-4 py-3 capitalize">
                      {String(record.plan ?? "premium")}
                    </td>
                    <td className="px-4 py-3">
                      ${Number(record.amount ?? 0).toFixed(2)}{" "}
                      <span className="uppercase text-[#806c72]">
                        {String(record.currency ?? "usd")}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className={`h-6 px-3 capitalize ${
                          statusStyles[status] ?? statusStyles.expired
                        }`}
                      >
                        {status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-[#806c72]">
                      {formatDate(record.createdAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
