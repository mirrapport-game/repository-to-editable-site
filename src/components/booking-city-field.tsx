import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OTHER_CITY, bookingCities } from "@/lib/booking-city";

/**
 * Поле «Город» для публичных форм заявки: список наших городов плюс
 * «Другой город», при выборе которого появляется поле для своего названия.
 */
export function BookingCityField({
  value,
  onChange,
  id = "booking-city",
  className,
}: {
  value: string;
  onChange: (city: string) => void;
  id?: string;
  className?: string;
}) {
  const [pick, setPick] = useState("");
  const isOther = pick === OTHER_CITY;
  return <div className={className ?? "space-y-2"}>
    <Label htmlFor={id}>Город</Label>
    <Select value={pick} onValueChange={(next: string) => { setPick(next); onChange(next === OTHER_CITY ? "" : next); }}>
      <SelectTrigger id={id} className="h-10"><SelectValue placeholder="Выберите город" /></SelectTrigger>
      <SelectContent className="z-[70]">
        {bookingCities.map((city) => <SelectItem key={city} value={city}>{city}</SelectItem>)}
        <SelectItem value={OTHER_CITY}>{OTHER_CITY}</SelectItem>
      </SelectContent>
    </Select>
    {isOther && <Input required maxLength={80} placeholder="Впишите свой город" value={value} onChange={(event) => onChange(event.target.value)} aria-label="Город" />}
  </div>;
}
