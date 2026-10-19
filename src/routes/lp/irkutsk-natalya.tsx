import { createFileRoute } from "@tanstack/react-router";
import { HostLanding, type HostLandingConfig } from "@/components/host-landing";
import natalyaPhoto from "@/assets/natalya-kireeva.webp";

const TITLE = "Раппóрт — Живая в Иркутске с ведущей Наталья Киреева";
const DESC = "Женская игра-практикум «Раппóрт — Живая» в Иркутске. Без лекций и советов: вы играете роль и видите свои сценарии со стороны. Ведущая — Наталья Киреева. Личные границы, любовь к себе, выбор себя, работа с тенью.";
const config: HostLandingConfig = {
  "landing": "irkutsk-natalya",
  "hostSlug": "natalya-kireeva",
  "host": "Наталья Киреева",
  "city": "Иркутск",
  "cityIn": "в Иркутске",
  "telegram": "@NataIgraRapport",
  "telegramUrl": "https://t.me/NataIgraRapport",
  "eyebrow": "Иркутск · Раппóрт — Живая",
  "headline": "Устала быть удобной для всех, кроме себя?",
  "sub": "Женская игра-практикум «Раппóрт — Живая» в Иркутске. Круг до 12 участниц, роли, сферы жизни и честный опыт — без лекций и советов.",
  "roles": "Практикующий психолог · коуч · парный семейный терапевт (ЭФТ)",
  "aboutTitle": "Я — Наталья Киреева, ведущая «Раппóрт — Живая» в Иркутске",
  "story": [
    "Меня пригласили на «Раппóрт» как участницу. В процессе игры я увидела, как люди говорят о важном, о чём молчат годами. В тот же вечер я написала автору, что хочу проводить игры в Иркутске. Сегодня я веду и «Раппóрт — Живая» — круг для женщин.",
    "Моя философия: говорить, пока не взорвался. Я помогаю слышать друг друга и договариваться так, чтобы в выигрыше остались оба.",
    "Более 50 игр каждую среду и более 600 участников."
  ],
  "audience": [
    "Женщинам, которые устали быть удобными",
    "Экспертам, психологам, мамам и предпринимательницам",
    "Тем, кто ищет живой женский круг поддержки"
  ],
  "quote": "«Я рядом всё время. Я не оцениваю. Я помогаю увидеть то, что ты сама не замечаешь».",
  "photo": natalyaPhoto
};

export const Route = createFileRoute("/lp/irkutsk-natalya")({
  head: () => ({ meta: [
    { title: TITLE }, { name: "description", content: DESC },
    { property: "og:title", content: TITLE }, { property: "og:description", content: DESC },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <HostLanding c={config} />,
});
