"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, X } from "lucide-react";
import { toast } from "sonner";

import { SERVICE_CATEGORIES } from "@/types/service";
import { secureFetch } from "@/lib/api/secure-fetch";
import { uploadImage } from "@/lib/upload-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MAX_IMAGES = 5;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export interface ServiceFormData {
  id: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  location: string;
  images: string[];
}

interface Props {
  // When initialData is passed, the form edits that service.
  initialData?: ServiceFormData;
}

// Bigger fields than the ShadCN default, to match the rest of the site
const fieldClass = "h-11 rounded-xl bg-white px-4";

export default function ServiceForm({ initialData }: Props) {
  const router = useRouter();
  const isEdit = Boolean(initialData);

  const [serviceName, setServiceName] = useState(
    initialData?.serviceName ?? ""
  );
  const [category, setCategory] = useState(
    initialData?.category ?? SERVICE_CATEGORIES[0]
  );
  const [description, setDescription] = useState(
    initialData?.description ?? ""
  );
  const [price, setPrice] = useState(
    initialData ? String(initialData.price) : ""
  );
  const [location, setLocation] = useState(initialData?.location ?? "");

  // Already uploaded image URLs (kept when editing)
  const [existingImages, setExistingImages] = useState<string[]>(
    initialData?.images ?? []
  );
  // New files picked by the vendor (uploaded on submit)
  const [newFiles, setNewFiles] = useState<File[]>([]);

  const [loading, setLoading] = useState(false);

  const totalImages = existingImages.length + newFiles.length;

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";

    const allowedTypes = ["image/png", "image/jpeg", "image/webp"];

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        toast.error(`${file.name}: only PNG, JPG or WebP images are allowed.`);
        return;
      }
      if (file.size > MAX_IMAGE_SIZE) {
        toast.error(`${file.name}: image must be smaller than 5MB.`);
        return;
      }
    }

    if (totalImages + files.length > MAX_IMAGES) {
      toast.error(`You can add up to ${MAX_IMAGES} images.`);
      return;
    }

    setNewFiles([...newFiles, ...files]);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const priceNumber = Number(price);

    if (serviceName.trim().length < 3) {
      toast.error("Service name must be at least 3 characters.");
      return;
    }
    if (description.trim().length < 20) {
      toast.error("Description must be at least 20 characters.");
      return;
    }
    if (!Number.isFinite(priceNumber) || priceNumber <= 0) {
      toast.error("Please enter a valid price.");
      return;
    }
    if (location.trim().length < 2) {
      toast.error("Please enter a location.");
      return;
    }
    if (totalImages === 0) {
      toast.error("Please add at least one service image.");
      return;
    }

    setLoading(true);

    try {
      // 1. Upload new images to ImgBB
      const uploadedUrls: string[] = [];
      for (const file of newFiles) {
        uploadedUrls.push(await uploadImage(file));
      }

      // 2. Save the service on the Express server
      const body = JSON.stringify({
        serviceName: serviceName.trim(),
        category,
        description: description.trim(),
        price: priceNumber,
        location: location.trim(),
        images: [...existingImages, ...uploadedUrls],
      });

      const result = isEdit
        ? await secureFetch(`/vendor/services/${initialData?.id}`, {
            method: "PATCH",
            body,
          })
        : await secureFetch("/vendor/services", {
            method: "POST",
            body,
          });

      toast.success(result.message);

      router.push("/dashboard/services");
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
      <div className="space-y-2">
        <Label htmlFor="service-name">Service Name *</Label>
        <Input
          id="service-name"
          type="text"
          required
          maxLength={120}
          placeholder="e.g. Golden Hour Wedding Photography"
          value={serviceName}
          onChange={(event) => setServiceName(event.target.value)}
          className={fieldClass}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="service-category">Category *</Label>
          <Select
            value={category}
            onValueChange={(value) => {
              if (value) setCategory(String(value));
            }}
          >
            <SelectTrigger
              id="service-category"
              className="h-11 w-full rounded-xl bg-white px-4 data-[size=default]:h-11"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent
              alignItemWithTrigger={false}
              sideOffset={6}
              className="rounded-xl p-1"
            >
              {SERVICE_CATEGORIES.map((item) => (
                <SelectItem key={item} value={item} className="rounded-lg py-2.5">
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="service-price">Price (USD) *</Label>
          <Input
            id="service-price"
            type="number"
            required
            min={1}
            step="0.01"
            placeholder="e.g. 1500"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            className={fieldClass}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="service-location">Location *</Label>
        <Input
          id="service-location"
          type="text"
          required
          maxLength={120}
          placeholder="e.g. San Francisco, CA"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          className={fieldClass}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="service-description">Description *</Label>
        <Textarea
          id="service-description"
          required
          rows={5}
          maxLength={3000}
          placeholder="Describe what is included in this service..."
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className="min-h-32 rounded-xl bg-white px-4 py-3"
        />
      </div>

      {/* Images */}
      <div className="space-y-2">
        <Label>
          Service Images * ({totalImages}/{MAX_IMAGES})
        </Label>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {existingImages.map((url) => (
            <div
              key={url}
              className="relative h-28 overflow-hidden rounded-xl border border-[#eadfda]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="Service" className="h-full w-full object-cover" />
              <Button
                type="button"
                variant="outline"
                size="icon-xs"
                onClick={() =>
                  setExistingImages(existingImages.filter((item) => item !== url))
                }
                className="absolute right-1.5 top-1.5 rounded-full text-[#8c2338]"
                aria-label="Remove image"
              >
                <X />
              </Button>
            </div>
          ))}

          {newFiles.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="relative flex h-28 items-center justify-center rounded-xl border border-dashed border-[#caa7ae] bg-[#fcfaf9] p-2 text-center text-xs text-[#806c72]"
            >
              <span className="line-clamp-3 break-all">{file.name}</span>
              <Button
                type="button"
                variant="outline"
                size="icon-xs"
                onClick={() =>
                  setNewFiles(newFiles.filter((_, i) => i !== index))
                }
                className="absolute right-1.5 top-1.5 rounded-full text-[#8c2338]"
                aria-label="Remove file"
              >
                <X />
              </Button>
            </div>
          ))}

          {totalImages < MAX_IMAGES && (
            <label className="flex h-28 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-[#eadfda] bg-white text-xs text-[#806c72] hover:border-[#8c2338]">
              <ImagePlus size={20} className="text-[#8c2338]" />
              Add Image
              <input
                type="file"
                multiple
                accept="image/png,image/jpeg,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        <p className="text-xs text-[#806c72]">
          PNG, JPG or WebP, max 5MB each. Images are hosted on ImgBB.
        </p>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="h-12 w-full rounded-xl text-base"
      >
        {loading
          ? "Saving Service..."
          : isEdit
            ? "Update Service"
            : "Submit Service for Review"}
      </Button>

      <p className="text-center text-xs text-[#806c72]">
        {isEdit
          ? "Edited services go back to pending until an admin approves them again."
          : "New services stay pending until an admin approves them."}
      </p>
    </form>
  );
}
