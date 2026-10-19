import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function BookingRepeat({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return <div role="status" className="col-span-full space-y-2 border border-border p-3">
    <p className="text-sm">Этот номер уже зарегистрирован</p>
    <Button asChild variant="outline" size="sm"><Link to="/auth" search={{ redirect: "/#booking" }}>Войти</Link></Button>
  </div>;
}
