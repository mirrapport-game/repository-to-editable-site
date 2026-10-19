import gallery2 from "@/assets/gallery/gallery-2.jpg";
import gallery4 from "@/assets/gallery/gallery-4.jpg";
import gallery6 from "@/assets/gallery/gallery-6.jpg";
import artemAsset from "@/assets/artem-efimov.webp";
import artemPosterAsset from "@/assets/artem-efimov-poster.png";
import artemPortraitAsset from "@/assets/artem-efimov-portrait.webp";
import beautyAsset from "@/assets/rapport-beauty.webp";
import relationshipsAsset from "@/assets/rapport-relationships.webp";
import zhivayaAsset from "@/assets/rapport-zhivaya.webp";
import relationshipsCutout from "@/assets/rapport-relationships-cutout.webp";
import zhivayaCutout from "@/assets/rapport-zhivaya-rectangular.webp";
import beautyCutout from "@/assets/rapport-beauty-cutout.webp";
import businessCutout from "@/assets/rapport-business-cutout.webp";
import zhivayaAfterGameAsset from "@/assets/zhivaya-after-game.webp";
import zhivayaSpheresAsset from "@/assets/zhivaya-12-spheres.webp";
import zhivayaBeforeAfterAsset from "@/assets/zhivaya-before-after.webp";
import zhivayaProcessAsset from "@/assets/zhivaya-process.webp";
import rapportHero from "@/assets/rapport-hero-gathering.webp";
import gameCardMomentAsset from "@/assets/rapport-game-card-moment.png";
import gameInProgressAsset from "@/assets/rapport-game-in-progress.png";
import gameTableAsset from "@/assets/rapport-game-table.jpg";
import liveGameAudienceAsset from "@/assets/live-game-audience.jpg";
import liveGameGroupAsset from "@/assets/rapport-live-game-group.png";
import liveGameEveningAsset from "@/assets/rapport-live-game-evening.jpg";
import participantReview1Asset from "@/assets/participant-review-1.webp";
import participantReview2Asset from "@/assets/participant-review-2.webp";
import participantReview3Asset from "@/assets/participant-review-3.webp";
import participantReview4Asset from "@/assets/participant-review-4.webp";
import participantReview5Asset from "@/assets/participant-review-5.webp";
import participantReview6Asset from "@/assets/participant-review-6.webp";
import participantReview7Asset from "@/assets/participant-review-7.webp";
import participantReview8Asset from "@/assets/participant-review-8.webp";
import participantReview9Asset from "@/assets/participant-review-9.jpg";
import participantReview10Asset from "@/assets/participant-review-10.jpg";
import participantReview11Asset from "@/assets/participant-review-11.jpg";
import participantReview12Asset from "@/assets/participant-review-12.jpg";
import participantReview13Asset from "@/assets/participant-review-13.jpg";
import participantReview14Asset from "@/assets/participant-review-14.jpg";
import participantReview15Asset from "@/assets/participant-review-15.jpg";
import participantReview16Asset from "@/assets/participant-review-16.jpg";
import participantReview17Asset from "@/assets/participant-review-17.jpg";
import participantReview18Asset from "@/assets/participant-review-18.jpg";
import liveG3 from "@/assets/artem-gallery/g3.jpg";
import liveG5 from "@/assets/artem-gallery/g5.jpg";
import liveG6 from "@/assets/artem-gallery/g6.jpg";

export const TELEGRAM_URL = "https://t.me/artem_rapport";
export const TELEGRAM_CHANNEL_URL = "https://t.me/rapport_game";
export const SOCIAL_LINKS = [
  { label: "Telegram", url: "https://t.me/rapport_game" },
  { label: "ВКонтакте", url: "https://vk.com/pro_love_game" },
  { label: "YouTube", url: "https://www.youtube.com/@rapport_game" },
  { label: "Дзен", url: "https://dzen.ru/rapport_game" },
] as const;

export type GameFormat = { kind: "online" | "offline"; label: string; note: string };

export type Game = {
  slug: string;
  title: string;
  shortTitle: string;
  tagline: string;
  description: string;
  audience: string[];
  outcomes: string[];
  duration: string;
  format: string;
  formats?: ReadonlyArray<GameFormat>;
  price: string;
  image?: string;
  cutoutImage?: string;
  gallery?: ReadonlyArray<{ src: string; alt: string }>;
  audienceImage?: { src: string; alt: string };
  outcomeImage?: { src: string; alt: string };
  testimonials?: ReadonlyArray<{ text: string; author: string }>;
  sourceUrl?: string;
  comingSoon?: boolean;
  external?: boolean;
};

export const games: Game[] = [
  {
    slug: "otnosheniya",
    title: "Раппóрт — Отношения",
    shortTitle: "Отношения",
    tagline: "Ключ к здоровым отношениям",
    description:
      "Психологическая игра-диагностика, где вы видите привычные сценарии со стороны, тренируете общение и находите новые способы решать конфликты.",
    audience: ["Пары", "Тем, кто хочет лучше понимать себя", "Психологам и коучам"],
    outcomes: ["Понимание своих реакций", "Новые модели поведения", "Больше контакта в разговоре"],
    duration: "3–4 часа",
    format: "Онлайн и офлайн",
    formats: [
      { kind: "online", label: "Онлайн", note: "Видеовстреча из любой точки мира" },
      { kind: "offline", label: "Офлайн", note: "Живая встреча с ведущим" },
    ],
    audienceImage: { src: gameTableAsset, alt: "Пары за игровым полем «Раппóрт»" },
    outcomeImage: { src: liveGameEveningAsset, alt: "Тёплый вечер после игры «Раппóрт»" },
    testimonials: [
      { text: "Каждый получает ответ на свой запрос, несмотря на то, что это происходит через обыгрывание рандомных ситуаций в паре.", author: "Участница игры" },
      { text: "Есть возможность посмотреть на ситуацию со стороны и получить поддержку и оценку ведущих и людей в поле.", author: "Участница игры" },
      { text: "Чувство юмора — это очень мощный ресурс. Посмеяться с другим человеком до слёз в непонятной ситуации — то, что может отменить армагеддон.", author: "Участница игры" },
    ],
    price: "от 2 500 ₽",
    image: relationshipsAsset,
    cutoutImage: relationshipsCutout,
    sourceUrl: "https://rapportgame.ru/game/",
  },
  {
    slug: "zhivaya",
    title: "Раппóрт — Живая",
    shortTitle: "Живая",
    tagline: "Для женщин, которые устали быть удобными",
    description:
      "Игра-практикум о контакте с собой. Через роли, жизненные сферы и круг поддержки участницы замечают привычные сценарии и возвращают себе ресурс.",
    audience: ["Женщинам", "Экспертам и психологам", "Мамам и предпринимательницам"],
    outcomes: ["Контакт с собой", "Видение своих ролей", "Поддержка женского круга"],
    duration: "4 часа, до 12 участниц",
    format: "Групповая встреча",
    formats: [
      { kind: "offline", label: "Офлайн", note: "Живые встречи в кругу до 12 участниц" },
    ],
    audienceImage: { src: liveGameGroupAsset, alt: "Женский круг на игре «Раппóрт Живая»" },
    outcomeImage: { src: gameCardMomentAsset, alt: "Момент открытия карты на игре" },
    testimonials: [
      { text: "Я стала больше выбирать себя, своё тело и своё настроение. Внутри поселилось какое-то тепло и любовь к себе.", author: "Участница игры «Живая»" },
      { text: "Игра мягко, но очень точно помогает посмотреть на себя по-новому, услышать свои желания и вспомнить, какая ты на самом деле.", author: "Участница игры «Живая»" },
      { text: "Через игровое пространство можно отредактировать реакции, страхи, опасения и зажимы.", author: "Участник игры «Живая»" },
    ],
    price: "от 2 500 ₽",
    image: zhivayaAsset,
    cutoutImage: zhivayaCutout,
    gallery: [
      { src: zhivayaAfterGameAsset, alt: "Что участница может сказать себе после игры «Раппóрт Живая»" },
      { src: zhivayaSpheresAsset, alt: "Двенадцать сфер жизни женщины в игре «Раппóрт Живая»" },
      { src: zhivayaBeforeAfterAsset, alt: "Изменение взгляда на себя до и после игры «Раппóрт Живая»" },
      { src: zhivayaProcessAsset, alt: "Шесть этапов психологической игры «Раппóрт Живая»" },
    ],
    sourceUrl: "https://rapportgame.ru/zhivaya/",
  },
  {
    slug: "beauty",
    title: "Раппóрт Beauty",
    shortTitle: "Beauty",
    tagline: "Коммуникация и сервис в beauty-сфере",
    description:
      "Психологическая игра для салонов красоты: помогает команде внимательнее слышать клиента, укреплять доверие и развивать сервис через отношения.",
    audience: ["Владельцам салонов", "Командам", "Мастерам и администраторам"],
    outcomes: ["Сильнее коммуникация", "Больше доверия", "Рост через качество отношений"],
    duration: "По программе ведущего",
    format: "Для beauty-команд",
    audienceImage: { src: gameInProgressAsset, alt: "Команда во время игры «Раппóрт»" },
    outcomeImage: { src: gameCardMomentAsset, alt: "Участники обсуждают карту" },
    price: "от 2 500 ₽",
    image: beautyAsset,
    cutoutImage: beautyCutout,
    sourceUrl: "https://rapportgame.ru/RB",
  },
  {
    slug: "business",
    title: "Раппóрт Бизнес",
    shortTitle: "Бизнес",
    tagline: "Живой тренинг-интенсив для команд",
    description:
      "45 игр-симуляций и 1000+ офисных сценариев: тренинг-интенсив для сотрудников и руководителей, который развивает эмоциональное партнёрство, мотивацию и сплочённость команды.",
    audience: ["Владельцам бизнеса", "Руководителям", "Корпоративным командам"],
    outcomes: ["Командная коммуникация", "Разбор конфликтов", "Практика на реальных кейсах"],
    duration: "Корпоративный формат",
    format: "Для команд и руководителей",
    audienceImage: { src: gameTableAsset, alt: "Команда за игровым столом" },
    outcomeImage: { src: gameInProgressAsset, alt: "Разбор рабочих кейсов в игре" },
    price: "от 2 500 ₽",
    image: businessCutout,
    cutoutImage: businessCutout,
    sourceUrl: "https://rapport-business.ru",
  },
  {
    slug: "kids",
    title: "Раппóрт Kids",
    shortTitle: "Kids",
    tagline: "Для детей, родителей и педагогов",
    description: "Новое направление серии «Раппóрт» готовится к запуску.",
    audience: [], outcomes: [], duration: "Скоро", format: "Скоро", price: "Скоро", comingSoon: true,
  },
  {
    slug: "life",
    title: "Раппóрт Life",
    shortTitle: "Life",
    tagline: "Про баланс, ресурсы и счастье",
    description: "Новое направление серии «Раппóрт» готовится к запуску.",
    audience: [], outcomes: [], duration: "Скоро", format: "Скоро", price: "Скоро", comingSoon: true,
  },
];

export const authorImage = artemAsset;
export const authorPortraitImage = artemPortraitAsset;
export const authorPosterImage = artemPosterAsset;
export const heroImage = rapportHero;

export const processPhotos = [
  {
    src: liveGameEveningAsset,
    alt: "Участники живой игры «Раппóрт» обсуждают ситуацию за общим столом",
    caption: "Настоящие встречи и настоящие эмоции",
  },
  {
    src: gallery2,
    alt: "Ведущий и участники обсуждают ситуацию за столом с карточками «Раппóрт»",
    caption: "Разговор, в котором слышат каждого",
  },
  {
    src: gameInProgressAsset,
    alt: "Участник игры «Раппóрт» выбирает карту во время встречи",
    caption: "Живой диалог вместо готовых ответов",
  },
  {
    src: gameTableAsset,
    alt: "Коробка и карточки игры «Раппóрт» на игровом столе",
    caption: "Пространство для честного разговора",
  },
  { src: gallery6, alt: "Участники игры «Раппóрт» на диване в кафе вечером", caption: "Живая игра в уютной атмосфере" },
  { src: liveG6, alt: "Ведущий и участники во время игры «Раппóрт» в кафе", caption: "Разговор, который хочется продолжить" },
] as const;

export const participantReviewImages = [
  { src: participantReview1Asset, alt: "Отзыв участницы о подходе ведущего и ответах на запросы в игре «Раппóрт»", game: "Раппóрт — Отношения" },
  { src: participantReview2Asset, alt: "Отзыв участницы о поддержке и возможности посмотреть на ситуацию со стороны", game: "Раппóрт — Живая" },
  { src: participantReview3Asset, alt: "Отзыв участницы о юморе как ресурсе во время игры", game: "Раппóрт — Живая" },
  { src: participantReview4Asset, alt: "Отзыв участницы о проживании ролей и знакомстве с собой", game: "Раппóрт — Живая" },
  { src: participantReview5Asset, alt: "Отзыв участницы об изменениях после игры «Раппóрт — Живая»", game: "Раппóрт — Живая" },
  { src: participantReview6Asset, alt: "Отзыв о безопасном игровом пространстве «Раппóрт — Живая»", game: "Раппóрт — Живая" },
  { src: participantReview7Asset, alt: "Отзыв участницы о внутренней силе после игры «Раппóрт — Живая»", game: "Раппóрт — Живая" },
  { src: participantReview8Asset, alt: "Отзыв участницы о первом опыте трансформационной игры «Раппóрт»", game: "Раппóрт — Живая" },
  { src: participantReview9Asset, alt: "Отзыв: Татьяна Павлова об игре «Раппóрт»", game: "Раппóрт — Отношения" },
  { src: participantReview10Asset, alt: "Отзыв: Елена Назарова об игре «Раппóрт»", game: "Раппóрт — Отношения" },
  { src: participantReview11Asset, alt: "Отзыв: Алла об игре «Раппóрт»", game: "Раппóрт — Отношения" },
  { src: participantReview12Asset, alt: "Отзыв: Лана Лаппо об игре «Раппóрт»", game: "Раппóрт — Отношения" },
  { src: participantReview13Asset, alt: "Отзыв: Михаил об игре «Раппóрт»", game: "Раппóрт — Отношения" },
  { src: participantReview14Asset, alt: "Отзыв: Аида Эльканова об игре «Раппóрт»", game: "Раппóрт — Отношения" },
  { src: participantReview15Asset, alt: "Отзыв: Елена (Воронеж) об игре «Раппóрт»", game: "Раппóрт — Отношения" },
  { src: participantReview16Asset, alt: "Отзыв: Анна Николаевна об игре «Раппóрт»", game: "Раппóрт — Отношения" },
  { src: participantReview17Asset, alt: "Отзыв: Елена Гречко об игре «Раппóрт»", game: "Раппóрт — Отношения" },
  { src: participantReview18Asset, alt: "Отзыв: Елена об игре «Раппóрт»", game: "Раппóрт — Отношения" },
] as const;

export type ArticleSection = { heading: string; paragraphs?: string[]; bullets?: string[] };
export type Article = {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  readTime: string;
  intro: string;
  sections: ArticleSection[];
  author?: string;
  authorBio?: string;
  authorTelegram?: string;
  authorChannel?: string;
};

import { contributedArticles } from "@/data/articles-contributed";

// Статьи разных авторов идут вперемешку: по одной от каждого по кругу
function interleaveByAuthor(list: Article[]): Article[] {
  const groups = new Map<string, Article[]>();
  for (const a of list) groups.set(a.author ?? "", [...(groups.get(a.author ?? "") ?? []), a]);
  const out: Article[] = []; const queues = [...groups.values()];
  while (queues.some((q) => q.length)) for (const q of queues) { const a = q.shift(); if (a) out.push(a); }
  return out;
}

export const articles: Article[] = interleaveByAuthor([...contributedArticles,
  {
    slug: "chto-takoe-transformacionnaya-igra",
    title: "Что такое трансформационная игра и чем она отличается от тренинга",
    description: "Что такое трансформационная игра, чем она отличается от психологического тренинга и кому подходит. Разбираем на примере игр серии «Раппóрт».",
    category: "Игры", date: "2 октября 2026", readTime: "5 минут",
    intro: "Слово «трансформационная» звучит загадочно. На деле всё проще: это игра, в которой человек меняет не знания, а своё поведение.",
    sections: [
      { heading: "Определение", paragraphs: ["Трансформационная игра — это структурированный игровой процесс, где участник через роли, правила и обратную связь видит свои привычные реакции и пробует новые модели поведения."] },
      { heading: "Чем отличается от тренинга", bullets: ["Тренинг даёт информацию и упражнения.", "Трансформационная игра создаёт ситуацию, в которой человек сам приходит к выводу.", "Психологическая консультация работает один на один, а игра показывает динамику между людьми."] },
      { heading: "Как это работает на примере «Раппóрт»", paragraphs: ["Участники разыгрывают ситуации из семьи, пары и бизнеса. Ведущий не советует и не «лечит» — он задаёт вопросы и помогает увидеть ключевой момент."], bullets: ["Заметить, как вы уходите от конфликта", "Увидеть, где теряете контакт с собой", "Попробовать сказать то, что давно не говорили", "Получить ресурс из обычного разговора"] },
      { heading: "Кому подходит", bullets: ["Тем, кто устал от теории без практики", "Парам, которые хотят разобраться в отношениях", "Психологам и коучам", "Предпринимателям и командам"] },
      { heading: "Вывод", paragraphs: ["Трансформационная игра — это не развлечение и не терапия. Это практика, в которой вы меняете поведение через опыт, а не через советы."] },
    ],
  },
  {
    slug: "kak-stat-vedushim",
    title: "Как стать ведущим трансформационных игр с нуля: 5 шагов",
    description: "Пошаговый план, как стать ведущим трансформационных игр без психологического образования: обучение, первая игра и практика.",
    category: "Практика", date: "2 октября 2026", readTime: "6 минут",
    intro: "«Хочу вести игры, но не знаю, с чего начать» — самый частый вопрос. Разберём по шагам.",
    sections: [
      { heading: "1. Сыграйте сами", paragraphs: ["Нельзя вести игру, которую не прочувствовал. Сыграйте в 2–3 игры серии «Раппóрт» онлайн или офлайн."] },
      { heading: "2. Пройдите обучение", bullets: ["Методичка с правилами", "Методичка по обратной связи", "Видео с демонстрацией ведения", "Поддержка сообщества", "Разбор первой игры"] },
      { heading: "3. Проведите первую игру", paragraphs: ["Первую игру можно провести уже в первый месяц обучения. Начните с друзей и знакомых — это безопасная среда для практики."] },
      { heading: "4. Соберите комьюнити", paragraphs: ["Регулярность важнее масштаба. Одна игра в неделю — уже стабильная практика."] },
      { heading: "5. Выйдите на доход", paragraphs: ["Доход зависит от частоты игр, размера группы, формата и аудитории. Начинайте с устойчивой практики, а не с обещаний быстрых результатов."] },
    ],
  },
  {
    slug: "skolko-zarabatyvaet-vedushiy",
    title: "Сколько зарабатывает ведущий психологических игр",
    description: "Как формируется доход ведущего трансформационных игр: чек, количество участников, частота встреч и дополнительные форматы.",
    category: "Практика", date: "2 октября 2026", readTime: "5 минут",
    intro: "Один из главных вопросов при выборе профессии — деньги. Считаем честно и без обещаний лёгкого дохода.",
    sections: [
      { heading: "Из чего складывается доход", paragraphs: ["Доход ведущего = количество игр × чек × количество участников."], bullets: ["Участие: 1 500–5 000 ₽ с человека", "Группа: 6–12 человек", "Одна игра: от 9 000 до 60 000 ₽"] },
      { heading: "Модель «одна игра в неделю»", paragraphs: ["Группа 8 человек × 2 000 ₽ = 16 000 ₽ за игру. Четыре игры в месяц = 64 000 ₽."] },
      { heading: "Дополнительные источники", bullets: ["Корпоративные игры", "Индивидуальные сессии", "Продажа коробочной версии", "Рекомендации внутри системы"] },
      { heading: "Что влияет на доход", bullets: ["Ваша аудитория", "География", "Онлайн- или офлайн-формат", "Регулярность практики"] },
      { heading: "Вывод", paragraphs: ["Это не лёгкие деньги, а работающая модель для ведущего, который регулярно собирает группы и развивает практику."] },
    ],
  },
  {
    slug: "kak-provesti-pervuyu-igru",
    title: "Как провести первую трансформационную игру: чек-лист ведущего",
    description: "Пошаговый чек-лист: как подготовить группу, провести игру, работать с обратной связью и завершить встречу.",
    category: "За кулисами", date: "2 октября 2026", readTime: "6 минут",
    intro: "Первая игра — самая волнительная. Ниже — структура, которая снимает большую часть тревоги.",
    sections: [
      { heading: "До игры", bullets: ["Выберите формат", "Соберите группу 6–8 человек", "Подготовьте тихое светлое пространство", "Проговорите правила конфиденциальности и уважения"] },
      { heading: "Во время игры", bullets: ["Объясните цель и правила", "Проведите лёгкое знакомство", "Следуйте методичке", "Задавайте вопросы вместо советов", "Дайте каждому сказать финальное слово"] },
      { heading: "После игры", bullets: ["Соберите отзывы", "Разберите игру с сообществом ведущих", "Зафиксируйте выводы", "Назначьте следующую дату"] },
      { heading: "Частые ошибки", bullets: ["Давать советы", "Слишком рано спасать участника от эмоций", "Пропускать обратную связь", "Остановиться после одной игры"] },
    ],
  },
  {
    slug: "igra-rapport-obzor",
    title: "Игра «Раппóрт»: обзор трансформационной игры про отношения",
    description: "Подробный обзор игры «Раппóрт»: для чего нужна, как проходит, кому подходит и как стать ведущим.",
    category: "Отношения", date: "2 октября 2026", readTime: "5 минут",
    intro: "«Раппóрт» — это серия коммуникационных и ролевых игр про отношения. Разберём, что это и кому подходит.",
    sections: [
      { heading: "Что это за игра", bullets: ["Диагностика отношений в паре, семье и бизнесе", "Тренажёр коммуникативных навыков", "Инструмент контакта с собой"] },
      { heading: "Как проходит игра", paragraphs: ["Участники разыгрывают ситуации, ведущий задаёт вопросы и помогает увидеть ключевой момент. Игра идёт 2–4 часа, онлайн или офлайн, для группы или пары."] },
      { heading: "Кому подходит", bullets: ["Парам", "Психологам", "Коучам", "Сообществам и клубам", "Будущим ведущим"] },
      { heading: "Что получают участники", bullets: ["Понимание своих реакций в конфликте", "Новые модели поведения", "Ресурс из обычного разговора", "Опыт, который не даёт книга"] },
      { heading: "Как стать ведущим", paragraphs: ["Ведущим может стать человек, который прошёл обучение. Игра даёт готовую методику и поддержку сообщества."] },
    ],
  },
  {
    slug: "kak-prohodit-transformacionnaya-igra",
    title: "Как проходит трансформационная игра: этапы, правила и что вы унесёте с собой",
    description: "Как проходит трансформационная игра шаг за шагом: запрос, персонаж, игровые ситуации, обратная связь и выводы. На примере психологических игр «Раппóрт».",
    category: "Игры", date: "11 октября 2026", readTime: "6 минут",
    intro: "Перед первой трансформационной игрой многие волнуются: придётся ли рассказывать о себе, будут ли «копаться» в прошлом, что делать, если не получится. Рассказываем, как всё устроено на самом деле.",
    sections: [
      { heading: "Сколько длится и кто участвует", paragraphs: ["Обычно игра идёт несколько часов, в ней участвует небольшая группа и ведущий-игропрактик. Бывают онлайн- и офлайн-форматы, а также индивидуальные игры и игры для пары."] },
      { heading: "Этап 1. Знакомство и запрос", paragraphs: ["Ведущий объясняет правила и помогает каждому сформулировать, с чем он пришёл: понять себя, разобраться в отношениях, найти решение в работе. Запрос можно не озвучивать вслух — достаточно держать его в голове."] },
      { heading: "Этап 2. Персонаж", paragraphs: ["В играх «Раппóрт» участник действует не от своего имени, а за персонажа. Это снимает напряжение: можно смело пробовать новые реакции, ведь обратная связь адресована персонажу, а не вам лично."] },
      { heading: "Этап 3. Игровые ситуации", bullets: ["Карточки задают ситуацию из жизни: разговор с партнёром, конфликт, просьба, отказ", "Игроки по очереди отвечают и действуют за своих персонажей", "Остальные наблюдают и замечают, что происходит"] },
      { heading: "Этап 4. Обратная связь", paragraphs: ["Участники говорят персонажу, что почувствовали и увидели. Ведущий не советует и не оценивает — он задаёт вопросы, которые помогают заметить привычные сценарии."] },
      { heading: "Этап 5. Выводы и новый шаг", paragraphs: ["В конце каждый возвращается к своему запросу: что стало понятнее, какое одно действие можно сделать уже на этой неделе. Именно этот шаг и делает игру трансформационной — меняется не знание, а поведение."] },
      { heading: "Как подготовиться", bullets: ["Подумайте, какой вопрос для вас сейчас важен", "Приходите отдохнувшим — игра требует внимания", "Не нужно ничего знать о психологии заранее"] },
    ],
  },
  {
    slug: "psihologicheskaya-igra-ili-trening",
    title: "Чем психологическая игра отличается от тренинга и что выбрать",
    description: "Психологическая игра или тренинг: в чём разница, что эффективнее для отношений и личных изменений, и кому какой формат подходит.",
    category: "Игры", date: "11 октября 2026", readTime: "5 минут",
    intro: "И тренинг, и психологическая игра обещают изменения. Но работают они по-разному — и от этого зависит, что вы получите в итоге.",
    sections: [
      { heading: "Тренинг: знания и упражнения", paragraphs: ["На тренинге ведущий даёт информацию, модели и техники, а участники отрабатывают их в упражнениях. Это хорошо, когда нужен конкретный навык: переговоры, публичные выступления, тайм-менеджмент."] },
      { heading: "Психологическая игра: опыт и осознание", paragraphs: ["В психологической игре нет лекции. Участники попадают в игровую ситуацию и сами замечают свои реакции. Вывод не приходит от ведущего — он рождается у игрока, поэтому запоминается лучше."] },
      { heading: "Главные различия", bullets: ["Тренинг учит «как надо», игра показывает «как у меня»", "На тренинге роль ведущего — эксперт, в игре — проводник, который задаёт вопросы", "Тренинг чаще про навык, игра — про отношения, выбор и внутренние сценарии", "В играх «Раппóрт» вы действуете за персонажа — это безопаснее, чем говорить о себе напрямую"] },
      { heading: "Что выбрать", bullets: ["Нужен конкретный рабочий навык — тренинг", "Хотите понять себя, свои реакции в паре или в команде — психологическая игра", "Хотите и то и другое — начните с игры: она покажет, какой навык вам действительно нужен"] },
      { heading: "Вывод", paragraphs: ["Психологическая игра не заменяет тренинг и терапию, но даёт то, чего им часто не хватает: живой опыт в безопасной форме и ясность, что делать дальше."] },
    ],
  },
  {
    slug: "igra-dlya-par-kak-vernut-blizost",
    title: "Игра для пар: как вернуть близость через игру",
    description: "Как психологическая игра для пар помогает вернуть близость, начать трудный разговор и услышать друг друга. Формат «Раппóрт — Отношения».",
    category: "Отношения", date: "11 октября 2026", readTime: "5 минут",
    intro: "Бывает, что пара живёт рядом, но разговаривает только о делах. Сказать «мне тебя не хватает» сложно, а обычный разговор быстро превращается в спор. Игра для пар даёт безопасный способ снова начать говорить.",
    sections: [
      { heading: "Почему пары перестают разговаривать", bullets: ["Усталость и быт вытесняют личные темы", "Страх задеть или получить упрёк", "Привычка решать всё молча", "Ощущение, что «и так всё понятно»"] },
      { heading: "Чем помогает игра", paragraphs: ["Карточки задают вопрос, который в обычной жизни трудно задать первым. Вы отвечаете за персонажа — и это снимает давление: можно сказать важное, не превращая разговор в выяснение отношений."] },
      { heading: "Что происходит на игре «Раппóрт — Отношения»", bullets: ["Партнёры по очереди отвечают на вопросы о чувствах, желаниях и ожиданиях", "Ведущий помогает услышать друг друга, а не спорить", "Обратная связь адресована персонажу, без обвинений", "В конце — один общий шаг, который пара готова сделать"] },
      { heading: "Кому подходит", bullets: ["Парам, у которых стало мало близости", "Тем, кто часто ссорится по мелочам", "Парам на старте отношений, чтобы лучше узнать друг друга", "Тем, кто просто хочет провести вечер вдвоём по-новому"] },
      { heading: "Важно", paragraphs: ["Игра для пар — это не семейная терапия. Если в отношениях есть насилие или угрозы, лучше обратиться к специалисту лично. Для остальных пар игра — бережный способ вернуть разговор, а с ним и близость."] },
    ],
  },
]);

export function getGame(slug: string) { return games.find((game) => game.slug === slug); }
export function getArticle(slug: string) { return articles.find((article) => article.slug === slug); }