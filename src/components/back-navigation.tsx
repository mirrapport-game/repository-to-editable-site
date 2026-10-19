import { useLocation, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BackNavigation() {
  const location = useLocation();
  const navigate = useNavigate();

  if (location.pathname === "/") return null;

  function goBack() {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    void navigate({ to: "/" });
  }

  return (
    <div className="border-b border-border bg-background">
      <div className="mx-auto flex h-12 max-w-7xl items-center px-5 lg:px-8">
        <Button type="button" variant="ghost" size="sm" onClick={goBack} className="-ml-3 text-muted-foreground hover:text-foreground">
          <ArrowLeft />
          Назад
        </Button>
      </div>
    </div>
  );
}