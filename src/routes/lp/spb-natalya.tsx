import { createFileRoute } from "@tanstack/react-router";
import { HostLanding, type HostLandingConfig } from "@/components/host-landing";
import vanyushkinaPhoto from "@/assets/hosts/natalya-vanyushkina.jpg";

const TITLE = "Раппóрт — Живая в Петербурге с ведущей Наталья Ванюшкина";
const DESC = "Женская игра-практикум «Раппóрт — Живая» в Петербурге. Без лекций и советов: вы играете роль и видите свои сценарии со стороны. Ведущая — Наталья Ванюшкина. Личные границы, любовь к себе, выбор себя, работа с тенью.";
import r1 from "@/assets/spb-natalya-review-1.jpg";
import r2 from "@/assets/spb-natalya-review-2.jpg";
import r3 from "@/assets/spb-natalya-review-3.jpg";

const config: HostLandingConfig = {
  "landing": "spb-natalya",
  "hostSlug": "natalya-vanyushkina",
  "host": "Наталья Ванюшкина",
  "city": "Санкт-Петербург",
  "cityIn": "в Петербурге",
  "telegram": "@natalyavnshkn",
  "telegramUrl": "https://t.me/proyavis_SPb",
  "eyebrow": "Санкт-Петербург · Раппóрт — Живая",
  "headline": "Хватит жить «как надо». Пора вернуться к себе",
  "sub": "Женская игра-практикум «Раппóрт — Живая» в Петербурге. Круг до 12 участниц, роли, сферы жизни и честный опыт — без лекций и советов.",
  "roles": "Наставник, проводник · ведущая «Раппóрт Живая»",
  "aboutTitle": "Я — Наталья Ванюшкина, ведущая «Раппóрт — Живая» в Петербурге",
  "story": [
    "Я работаю с женщинами, которые хотят перестать жить «как надо» и вернуться к себе: самоценность, опора, границы, проявленность.",
    "На игре ты пробуешь новые реакции через персонажа — в безопасной среде, без последствий — и видишь, как можно иначе."
  ],
  "audience": [
    "Тем, кто привыкла подстраиваться и забывать о себе",
    "Тем, кто хочет научиться держать границы в отношениях",
    "Тем, кто готова проявляться смелее"
  ],
  "quote": "«Я рядом всё время. Я не оцениваю. Я помогаю увидеть, где ты прячешься от себя».",
  "extraReviews": [
    { src: r1, alt: "Отзыв участницы о взгляде на игру «Раппóрт — Живая»" },
    { src: r2, alt: "Отзыв участницы о ролевом формате «Раппóрт — Живая»" },
    { src: r3, alt: "Отзыв психолога о том, как Наталья ведёт «Раппóрт — Живая»" },
  ],
  "photo": vanyushkinaPhoto
};

export const Route = createFileRoute("/lp/spb-natalya")({
  head: () => ({ meta: [
    { title: TITLE }, { name: "description", content: DESC },
    { property: "og:title", content: TITLE }, { property: "og:description", content: DESC },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <HostLanding c={config} />,
});
