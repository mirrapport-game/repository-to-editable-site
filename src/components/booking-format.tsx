import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const bookingFormats = ["Онлайн", "Офлайн", "Индивидуально", "Для группы"] as const;
export type BookingFormat = (typeof bookingFormats)[number];

export const BOOKING_WIDGET_EVENT = "rapport:open-booking";

export function openBookingWidget() {
  window.dispatchEvent(new Event(BOOKING_WIDGET_EVENT));
}

export function BookingFormatField({
  value,
  onChange,
  id = "booking-format",
  className,
}: {
  value: BookingFormat;
  onChange: (value: BookingFormat) => void;
  id?: string;
  className?: string;
}) {
  return <div className={className ?? "space-y-2"}>
    <Label htmlFor={id}>Формат</Label>
    <Select value={value} onValueChange={(next: BookingFormat) => onChange(next)}>
      <SelectTrigger id={id} className="h-10"><SelectValue /></SelectTrigger>
      <SelectContent className="z-[70]">{bookingFormats.map((format) => <SelectItem key={format} value={format}>{format}</SelectItem>)}</SelectContent>
    </Select>
  </div>;
}