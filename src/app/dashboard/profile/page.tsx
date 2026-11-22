import { ObjectId } from "mongodb";

import { requireUser } from "@/lib/require-user";
import { db } from "@/lib/mongodb";
import ProfileForm from "@/components/profile/ProfileForm";

export default async function ProfilePage() {
  const user = await requireUser(["customer", "vendor"]);

  const record = await db.collection("user").findOne({
    _id: new ObjectId(user.id),
  });

  return (
    <section className="rounded-2xl border border-[#eadfda] bg-white p-5 sm:p-7">
      <h1 className="font-serif text-3xl font-bold text-[#2b2023]">
        Profile Settings
      </h1>

      <p className="mt-2 text-sm text-[#806c71]">
        Manage your WedPlan account information.
      </p>

      <div className="mt-6 grid gap-4 rounded-xl bg-[#fcfaf9] p-4 text-sm sm:grid-cols-2">
        <div>
          <p className="text-xs font-medium uppercase text-[#806c71]">Email</p>
          <p className="mt-1 font-semibold text-[#2b2023]">{user.email}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase text-[#806c71]">
            Account Role
          </p>
          <p className="mt-1 font-semibold capitalize text-[#2b2023]">
            {user.role}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <ProfileForm
          role={user.role === "vendor" ? "vendor" : "customer"}
          initialName={user.name}
          initialImage={user.image ?? ""}
          initialBusinessName={String(record?.businessName ?? "")}
        />
      </div>
    </section>
  );
}
