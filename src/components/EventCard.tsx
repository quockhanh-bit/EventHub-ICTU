import React from "react";
import Link from "next/link";
import { Calendar, MapPin, Ticket, Users, ArrowUpRight } from "lucide-react";

export interface TicketTier {
  id: string;
  name: string;
  price: number;
  quantity: number;
  sold: number;
}

export interface EventData {
  id: string;
  title: string;
  slug: string;
  shortDesc: string;
  bannerImage: string;
  startDate: string | Date;
  endDate: string | Date;
  location: string;
  locationType: string;
  status: string;
  isFeatured?: boolean;
  category?: {
    name: string;
    slug: string;
    color?: string | null;
  };
  organizer?: {
    name: string;
    avatar?: string | null;
    organization?: string | null;
  };
  ticketTiers?: TicketTier[];
  _count?: {
    bookings: number;
    reviews: number;
  };
}

export default function EventCard({ event }: { event: EventData }) {
  const minPrice =
    event.ticketTiers && event.ticketTiers.length > 0
      ? Math.min(...event.ticketTiers.map((t) => t.price))
      : 0;

  const totalTickets = event.ticketTiers?.reduce((acc, t) => acc + t.quantity, 0) || 0;
  const totalSold = event.ticketTiers?.reduce((acc, t) => acc + t.sold, 0) || 0;
  const isSoldOut = totalTickets > 0 && totalSold >= totalTickets;

  const eventDate = new Date(event.startDate);
  const formattedDate = eventDate.toLocaleDateString("vi-VN", {
    weekday: "short",
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
  const formattedTime = eventDate.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Banner with Tags */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={event.bannerImage}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

          {/* Category Badge */}
          {event.category && (
            <span
              className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full text-white shadow-sm backdrop-blur-md"
              style={{ backgroundColor: event.category.color || "#4F46E5" }}
            >
              {event.category.name}
            </span>
          )}

          {/* Location Type Badge */}
          <span className="absolute top-3 right-3 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-black/60 text-white backdrop-blur-md">
            {event.locationType === "ONLINE"
              ? "🌐 Trực tuyến"
              : event.locationType === "HYBRID"
              ? "⚡ Hybrid"
              : "📍 Trực tiếp"}
          </span>

          {/* Date pill overlay */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs font-medium text-white bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-lg">
            <Calendar className="w-3.5 h-3.5 text-indigo-300" />
            <span>{formattedDate} • {formattedTime}</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5">
          <Link href={`/events/${event.slug || event.id}`} className="block">
            <h3 className="font-bold text-slate-900 text-lg leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors">
              {event.title}
            </h3>
          </Link>

          <p className="text-slate-500 text-sm mt-2 line-clamp-2 leading-relaxed">
            {event.shortDesc}
          </p>

          {/* Location */}
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-3">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="line-clamp-1">{event.location}</span>
          </div>

          {/* Organizer */}
          {event.organizer && (
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
              <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    event.organizer.avatar ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                      event.organizer.name
                    )}`
                  }
                  alt={event.organizer.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xs text-slate-600 font-medium line-clamp-1">
                {event.organizer.organization || event.organizer.name}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Footer / Pricing & CTA */}
      <div className="p-5 pt-0 mt-2 flex items-center justify-between border-t border-slate-100">
        <div className="flex flex-col">
          <span className="text-[11px] text-slate-400 uppercase font-semibold">Giá vé từ</span>
          <span className="text-base font-black text-slate-900">
            {isSoldOut ? (
              <span className="text-rose-500">Hết vé</span>
            ) : minPrice === 0 ? (
              <span className="text-emerald-600">Miễn phí</span>
            ) : (
              `${minPrice.toLocaleString("vi-VN")} ₫`
            )}
          </span>
        </div>

        <Link
          href={`/events/${event.slug || event.id}`}
          className="inline-flex items-center gap-1 bg-slate-900 group-hover:bg-indigo-600 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-all shadow-sm"
        >
          <span>Đặt Vé</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
