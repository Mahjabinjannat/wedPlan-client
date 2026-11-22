"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Camera } from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { secureFetch } from "@/lib/api/secure-fetch";
import { uploadImage } from "@/lib/upload-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  role: "customer" | "vendor";
  initialName: string;
  initialImage: string;
  initialBusinessName: string;
}

const fieldClass = "h-11 rounded-xl bg-white px-4";

export default function ProfileForm({
  role,
  initialName,
  initialImage,
  initialBusinessName,
}: Props) {
  const router = useRouter();
  const { refetch } = authClient.useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(initialName);
  const [businessName, setBusinessName] = useState(initialBusinessName);
  const [image, setImage] = useState(initialImage);
  const [newFile, setNewFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(initialImage);
  const [loading, setLoading] = useState(false);

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      toast.error("Only PNG, JPG or WebP images are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB.");
      return;
    }

    setNewFile(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (name.trim().length < 2) {
      toast.error("Name must be at least 2 characters.");
      return;
    }

    setLoading(true);

    try {
      // Upload the new photo first (if one was picked)
      let imageUrl = image;
      if (newFile) {
        imageUrl = await uploadImage(newFile);
        setImage(imageUrl);
        setNewFile(null);
      }

      // Only name, image and businessName are sent.
      // Role and subscription can never be changed here.
      const result = await secureFetch("/profile", {
        method: "PATCH",
        body: JSON.stringify({
          name: name.trim(),
          image: imageUrl,
          ...(role === "vendor" ? { businessName: businessName.trim() } : {}),
        }),
      });

      toast.success(result.message);

      // Update the navbar name/photo and the server pages
      await refetch();
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Profile photo */}
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#eadfda] bg-[#f6e9ec] text-lg font-medium text-[#8c2338]">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Profile" className="h-full w-full object-cover" />
          ) : (
            name.charAt(0).toUpperCase() || "W"
          )}
        </div>

        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleImageChange}
            className="hidden"
            aria-label="Upload profile photo"
          />
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => fileInputRef.current?.click()}
          >
            <Camera className="text-[#8c2338]" />
            Change Photo
          </Button>
          <p className="mt-1 text-xs text-[#806c72]">
            PNG, JPG or WebP, max 5MB.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="profile-name">Full Name *</Label>
        <Input
          id="profile-name"
          type="text"
          required
          maxLength={80}
          value={name}
          onChange={(event) => setName(event.target.value)}
          className={fieldClass}
        />
      </div>

      {role === "vendor" && (
        <div className="space-y-2">
          <Label htmlFor="profile-business">Business Name</Label>
          <Input
            id="profile-business"
            type="text"
            maxLength={120}
            placeholder="e.g. Golden Hour Studio"
            value={businessName}
            onChange={(event) => setBusinessName(event.target.value)}
            className={fieldClass}
          />
          <p className="text-xs text-[#806c72]">
            Shown to customers on your services.
          </p>
        </div>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="h-11 rounded-xl px-6"
      >
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
