import { render, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ConsentFields } from "@/components/consent-fields";

vi.mock("@tanstack/react-router", () => ({ Link: ({ children }: { children: React.ReactNode }) => <a>{children}</a> }));
afterEach(cleanup);

describe("Consent form layout", () => {
  it("spans existing tracks without creating a second form column", () => {
    const { container } = render(<form className="grid grid-cols-1"><ConsentFields /></form>);
    const fields = container.querySelector("form > div");
    expect(fields?.className).toContain("col-span-full");
    expect(fields?.className).not.toContain("sm:col-span-2");
    expect(container.querySelector('input[name="consent_personal"]')?.hasAttribute("required")).toBe(true);
    expect(container.querySelector('input[name="consent_marketing"]')?.hasAttribute("required")).toBe(false);
  });
});