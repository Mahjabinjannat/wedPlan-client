"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, Users } from "lucide-react";
import { toast } from "sonner";

import { secureFetch } from "@/lib/api/secure-fetch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface UserItem {
  id: string;
  name: string;
  email: string;
  image: string;
  role: "customer" | "vendor" | "admin";
  isBlocked: boolean;
  businessName: string;
  subscriptionPlan: string;
  createdAt: string;
}

interface Props {
  users: UserItem[];
}

// Labels for the role filter dropdown
const ROLE_FILTERS: Record<string, string> = {
  all: "All Roles",
  customer: "Customers",
  vendor: "Vendors",
  admin: "Admins",
};

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "-"
    : date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
}

export default function UsersTable({ users }: Props) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Search by name or email + filter by role
  const keyword = search.trim().toLowerCase();
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(keyword) ||
      user.email.toLowerCase().includes(keyword);
    const matchesRole = role === "all" || user.role === role;
    return matchesSearch && matchesRole;
  });

  async function toggleBlock(user: UserItem) {
    setBusyId(user.id);

    try {
      const result = await secureFetch(`/admin/users/${user.id}/block`, {
        method: "PATCH",
        body: JSON.stringify({ isBlocked: !user.isBlocked }),
      });
      toast.success(result.message);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      {/* Search & filter */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#806c72]"
          />
          <Input
            type="text"
            placeholder="Search by name or email"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-11 rounded-xl bg-white pl-9"
          />
        </div>

        <Select
          items={ROLE_FILTERS}
          value={role}
          onValueChange={(value) => {
            if (value) setRole(String(value));
          }}
        >
          <SelectTrigger
            aria-label="Filter by role"
            className="h-11 w-full rounded-xl bg-white px-4 data-[size=default]:h-11 sm:w-48"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false} sideOffset={6} className="rounded-xl p-1">
            {Object.entries(ROLE_FILTERS).map(([itemValue, label]) => (
              <SelectItem key={itemValue} value={itemValue} className="rounded-lg py-2.5">
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredUsers.length === 0 ? (
        <Card className="items-center border border-dashed border-[#eadfda] px-5 py-14 text-center ring-0">
          <Users size={32} className="text-[#8c2338]" />
          <p className="font-medium text-[#2b2023]">No users found</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredUsers.map((user) => (
            <Card
              key={user.id}
              className="gap-0 border border-[#eadfda] p-4 shadow-sm ring-0"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#f6e9ec] text-sm font-medium text-[#8c2338]">
                    {user.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={user.image}
                        alt={user.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      user.name.charAt(0).toUpperCase()
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-semibold text-[#2b2023]">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-[#806c72]">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="h-6 px-3 capitalize">
                    {user.role}
                  </Badge>

                  {user.isBlocked && (
                    <Badge
                      variant="outline"
                      className="h-6 border-rose-300 bg-rose-50 px-3 text-rose-700"
                    >
                      Blocked
                    </Badge>
                  )}

                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() =>
                      setSelectedId(selectedId === user.id ? null : user.id)
                    }
                  >
                    {selectedId === user.id ? "Hide Details" : "View Details"}
                  </Button>

                  {user.role !== "admin" && (
                    <Button
                      type="button"
                      variant={user.isBlocked ? "default" : "destructive"}
                      size="lg"
                      disabled={busyId !== null}
                      onClick={() => toggleBlock(user)}
                      className={
                        user.isBlocked
                          ? "bg-emerald-600 text-white hover:bg-emerald-700"
                          : ""
                      }
                    >
                      {busyId === user.id
                        ? "Processing..."
                        : user.isBlocked
                          ? "Unblock"
                          : "Block"}
                    </Button>
                  )}
                </div>
              </div>

              {/* User details */}
              {selectedId === user.id && (
                <dl className="mt-4 grid gap-3 rounded-lg bg-[#fcfaf9] p-4 text-sm sm:grid-cols-3">
                  <div>
                    <dt className="text-xs text-[#806c72]">Joined</dt>
                    <dd className="font-medium text-[#2b2023]">
                      {formatDate(user.createdAt)}
                    </dd>
                  </div>
                  {user.role === "vendor" && (
                    <>
                      <div>
                        <dt className="text-xs text-[#806c72]">Business Name</dt>
                        <dd className="font-medium text-[#2b2023]">
                          {user.businessName || "-"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-[#806c72]">Plan</dt>
                        <dd className="font-medium capitalize text-[#2b2023]">
                          {user.subscriptionPlan}
                        </dd>
                      </div>
                    </>
                  )}
                </dl>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
