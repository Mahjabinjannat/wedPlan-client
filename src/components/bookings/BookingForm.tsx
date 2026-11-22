
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, MapPin, MessageSquare } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  serviceId: string;
}

export default function BookingForm({ serviceId }: Props) {
  const router = useRouter();

  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const today = new Date().toLocaleDateString("en-CA");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!eventDate || !eventLocation.trim()) {
      toast.error("Please enter your event date and location.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serviceId,
          eventDate,
          eventLocation: eventLocation.trim(),
          message: message.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? "Booking failed.");
      }

      toast.success("Booking request submitted successfully!");

      router.push("/dashboard/bookings");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-8 border-t border-[#eadfda] pt-6">
      <div className="flex items-center gap-2">
        <CalendarDays className="h-5 w-5 text-[#8c2338]" />
        <h2 className="font-serif text-xl font-bold text-[#2b2023]">
          Request a Booking
        </h2>
      </div>

      <p className="mt-2 text-sm leading-6 text-[#806c72]">
        Share your event details with the vendor. Your request
        will remain pending until the vendor responds.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <Label htmlFor="eventDate" className="mb-2 text-[#30252a]">
            Event Date *
          </Label>

          <div className="relative">
            <CalendarDays
              size={17}
              className="pointer-events-none absolute left-3 top-3.5 text-[#806c72]"
            />
            <Input
              id="eventDate"
              type="date"
              required
              min={today}
              value={eventDate}
              onChange={(event) => setEventDate(event.target.value)}
              className="h-11 rounded-xl bg-white pl-10 pr-4"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="eventLocation" className="mb-2 text-[#30252a]">
            Event Location *
          </Label>

          <div className="relative">
            <MapPin
              size={17}
              className="pointer-events-none absolute left-3 top-3.5 text-[#806c72]"
            />
            <Input
              id="eventLocation"
              type="text"
              required
              maxLength={200}
              placeholder="e.g. San Francisco, CA"
              value={eventLocation}
              onChange={(event) =>
                setEventLocation(event.target.value)
              }
              className="h-11 rounded-xl bg-white pl-10 pr-4"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="message" className="mb-2 text-[#30252a]">
            Additional Message (Optional)
          </Label>

          <div className="relative">
            <MessageSquare
              size={17}
              className="pointer-events-none absolute left-3 top-3.5 text-[#806c72]"
            />
            <Textarea
              id="message"
              rows={3}
              maxLength={1000}
              placeholder="Tell the vendor about your wedding plans..."
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className="min-h-24 resize-y rounded-xl bg-white py-3 pl-10 pr-4"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="h-12 w-full rounded-xl text-base"
        >
          {loading ? "Submitting Request..." : "Request Booking"}
        </Button>

        <p className="text-center text-xs text-[#806c72]">
          Submitting a request does not confirm your booking
          or charge you a payment.
        </p>
      </form>
    </section>
  );
}
