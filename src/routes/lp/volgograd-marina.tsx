import { createFileRoute } from "@tanstack/react-router";
import { HostLanding, type HostLandingConfig } from "@/components/host-landing";
import marinaPhoto from "@/assets/hosts/marina-kravchenko.jpg";

const TITLE = "Раппóрт — Живая в Волгограде с ведущей Марина Кравченко";
const DESC = "Женская игра-практикум «Раппóрт — Живая» в Волгограде. Без лекций и советов: вы играете роль и видите свои сценарии со стороны. Ведущая — Марина Кравченко. Личные границы, любовь к себе, выбор себя, работа с тенью.";
const config: HostLandingConfig = {
  "landing": "volgograd-marina",
  "hostSlug": "marina-kravchenko",
  "host": "Марина Кравченко",
  "city": "Волгоград",
  "cityIn": "в Волгограде",
  "telegram": "@marina_kravchenko_vlg",
  "telegramUrl": "https://t.me/propecypc",
  "eyebrow": "Волгоград · Раппóрт — Живая",
  "headline": "Где твой ресурс, когда ты всё время для других?",
  "sub": "Женская игра-практикум «Раппóрт — Живая» в Волгограде. Круг до 12 участниц, роли, сферы жизни и честный опыт — без лекций и советов.",
  "roles": "Семейный психолог · пространство PRO Ресурс",
  "aboutTitle": "Я — Марина Кравченко, ведущая «Раппóрт — Живая» в Волгограде",
  "story": [
    "«Эмоциональное здоровье — ваш главный ресурс». Игры «Раппóрт» я провожу в пространстве PRO Ресурс в Волгограде.",
    "На игре ты проживаешь ситуацию через персонажа и видишь со стороны, где теряешь силы, а где можешь их вернуть."
  ],
  "audience": [
    "Тем, кто отдаёт силы всем, кроме себя",
    "Тем, кто хочет научиться называть свои чувства",
    "Тем, кто ищет живой женский круг вместо очередной лекции"
  ],
  "quote": "«Я рядом всё время. Я бережно веду группу и помогаю увидеть, что даёт тебе ресурс».",
  "photo": marinaPhoto
};

export const Route = createFileRoute("/lp/volgograd-marina")({
  head: () => ({ meta: [
    { title: TITLE }, { name: "description", content: DESC },
    { property: "og:title", content: TITLE }, { property: "og:description", content: DESC },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <HostLanding c={config} />,
});
