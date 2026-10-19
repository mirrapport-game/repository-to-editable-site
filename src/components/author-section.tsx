import { authorPortraitImage } from "@/data/site";


export function AuthorSection() {
  return (
    <section className="section bg-foreground text-background">
      <div className="section-inner grid items-center gap-16 lg:grid-cols-12">
        <div className="relative lg:col-span-4">
          <div className="relative mx-auto max-w-sm">
            <div className="relative z-10">
              <img loading="lazy" decoding="async"
                src={authorPortraitImage}
                alt="Артём Ефимов, автор серии игр «Раппóрт»"
                className="aspect-[4/5] w-full object-cover shadow-2xl"
              />
              <p className="absolute bottom-0 left-0 z-20 bg-primary px-7 py-4 font-display text-lg italic text-primary-foreground shadow-xl">
                Автор серии игр
              </p>
            </div>
            <div aria-hidden className="absolute -left-4 -top-4 -z-0 h-full w-full translate-x-2 translate-y-2 border border-primary/25" />
          </div>
        </div>

        <div className="space-y-12 lg:col-span-7">
          <header className="space-y-6">
            <div className="flex items-center gap-4">
              <span aria-hidden className="h-px w-12 bg-primary" />
              <p className="eyebrow">Автор методики</p>
            </div>
            <h2 className="font-display text-5xl leading-[1.05] md:text-7xl">
              Артём <em className="font-medium text-accent">Ефимов</em>
            </h2>
            <p className="max-w-xl text-lg leading-8 text-background/90">
              Создатель серии игр «Раппóрт» — специалист по отношениям, методолог и игропрактик.
            </p>
          </header>

          <div className="hidden flex-wrap gap-10 border-y border-background/30 py-7 md:flex md:gap-16">
            <div>
              <span className="block font-display text-5xl leading-none text-accent">20</span>
              <span className="mt-2 block text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-background/90">городов</span>
            </div>
            <div>
              <span className="block font-display text-5xl leading-none text-accent">5000</span>
              <span className="mt-2 block text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-background/90">участников</span>
            </div>
          </div>

          <blockquote className="relative pt-2">
            <p className="font-display text-2xl italic leading-snug text-accent md:text-3xl">
              «Мы рядом, чтобы поддержать твой путь»
            </p>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
