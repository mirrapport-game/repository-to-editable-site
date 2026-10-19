import { Link } from "@tanstack/react-router";

/** Согласия для любой формы: обработка данных — обязательно, рассылка — по желанию. */
export function ConsentFields({ className = "" }: { className?: string }) {
  return <div className={`col-span-full grid min-w-0 gap-2 text-left text-xs leading-5 text-muted-foreground ${className}`}>
    <label className="flex items-start gap-2">
      <input type="checkbox" name="consent_personal" required className="mt-1 h-4 w-4 shrink-0 accent-primary"
        onInvalid={(e) => e.currentTarget.setCustomValidity("Отметьте согласие на обработку персональных данных")}
        onChange={(e) => e.currentTarget.setCustomValidity("")} />
      <span>Я даю согласие на обработку моих персональных данных и принимаю условия <Link to="/offer" className="underline underline-offset-2 hover:text-foreground">оферты</Link></span>
    </label>
    <label className="flex items-start gap-2">
      <input type="checkbox" name="consent_marketing" className="mt-1 h-4 w-4 shrink-0 accent-primary" />
      <span>Согласен(на) получать новости и рекламные материалы «Раппóрт»</span>
    </label>
  </div>;
}

/** Отмечена ли галочка рассылки в форме, где находится элемент. */
export function wantsMarketing(el: EventTarget | null): boolean {
  const node = el instanceof Element ? el : null;
  const form = node instanceof HTMLFormElement ? node : node?.closest("form");
  const box = form?.elements.namedItem("consent_marketing");
  return box instanceof HTMLInputElement && box.checked;
}
