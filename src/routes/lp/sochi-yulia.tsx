import { createFileRoute } from "@tanstack/react-router";
import { HostLanding, type HostLandingConfig } from "@/components/host-landing";
import yuliaPhoto from "@/assets/hosts/yulia-novitskaya.jpg";

const TITLE = "Раппóрт — Живая в Сочи с ведущей Юлия Новицкая";
const DESC = "Женская игра-практикум «Раппóрт — Живая» в Сочи. Без лекций и советов: вы играете роль и видите свои сценарии со стороны. Ведущая — Юлия Новицкая. Личные границы, любовь к себе, выбор себя, работа с тенью.";
const config: HostLandingConfig = {
  "landing": "sochi-yulia",
  "hostSlug": "yulia-novitskaya",
  "host": "Юлия Новицкая",
  "city": "Сочи",
  "cityIn": "в Сочи",
  "telegram": "@ulek_k",
  "telegramUrl": "https://t.me/oh_coach_me",
  "eyebrow": "Сочи · Раппóрт — Живая",
  "headline": "Хочешь отношений, в которых можно быть собой?",
  "sub": "Женская игра-практикум «Раппóрт — Живая» в Сочи. Круг до 12 участниц, роли, сферы жизни и честный опыт — без лекций и советов.",
  "roles": "Семейный терапевт · отношения в паре",
  "aboutTitle": "Я — Юлия Новицкая, ведущая «Раппóрт — Живая» в Сочи",
  "story": [
    "Я помогаю создавать союз нового времени: открытые и бережные отношения, доверие, прохождение через кризисы.",
    "На игре ты проживаешь роль в безопасном круге и видишь со стороны, как выбрать себя — и сохранить отношения."
  ],
  "audience": [
    "Женщинам, которые устали быть удобными",
    "Тем, кто хочет бережных и честных отношений",
    "Тем, кто ищет живой женский круг поддержки"
  ],
  "quote": "«Я рядом всё время. Я не оцениваю. Я помогаю увидеть то, что ты сама не замечаешь».",
  "photo": yuliaPhoto
};

export const Route = createFileRoute("/lp/sochi-yulia")({
  head: () => ({ meta: [
    { title: TITLE }, { name: "description", content: DESC },
    { property: "og:title", content: TITLE }, { property: "og:description", content: DESC },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <HostLanding c={config} />,
});
