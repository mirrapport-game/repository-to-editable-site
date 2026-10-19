import type { LucideIcon } from "lucide-react";
import { CalendarDays, Gamepad2, Radio, UserRoundCheck, UsersRound, Video } from "lucide-react";

export const POLEGAME_URL = "https://polegame.ru";
export const POLEGAME_CALENDAR_URL = `${POLEGAME_URL}/calendar`;

export const platformBenefits: ReadonlyArray<{ Icon: LucideIcon; title: string; text: string }> = [
  { Icon: CalendarDays, title: "Календарь игр", text: "Создавайте встречу, указывайте дату и время — участники увидят её в общем расписании." },
  { Icon: UsersRound, title: "Сбор участников", text: "На странице игры видно ведущего, количество мест и кто уже присоединился." },
  { Icon: Video, title: "Игра из любого города", text: "Собирайте людей онлайн без привязки к помещению и географии." },
] as const;

export const audiencePaths = {
  facilitator: {
    eyebrow: "Для ведущих",
    title: "Ваша игра — на одной платформе",
    text: "Открывайте онлайн-встречи, приглашайте свою аудиторию и проводите «Раппóрт» для участников из разных городов.",
    steps: [
      { Icon: UserRoundCheck, title: "Создайте профиль", text: "Зарегистрируйтесь как ведущий и расскажите участникам о себе." },
      { Icon: CalendarDays, title: "Назначьте игру", text: "Выберите тему, дату, время и количество мест за игровым столом." },
      { Icon: Radio, title: "Проведите онлайн", text: "Соберите группу и проведите игру в привычном для вас формате видеовстречи." },
    ],
  },
  participant: {
    eyebrow: "Для участников",
    title: "Найдите свою игру и ведущего",
    text: "Смотрите ближайшие встречи, тему игры, ведущего и свободные места. Присоединиться можно из любой точки мира.",
    steps: [
      { Icon: CalendarDays, title: "Выберите дату", text: "Откройте календарь и найдите удобную онлайн-встречу." },
      { Icon: UsersRound, title: "Займите место", text: "Посмотрите состав группы и зарегистрируйтесь на выбранную игру." },
      { Icon: Gamepad2, title: "Войдите в игру", text: "В назначенное время присоединитесь к ведущему и другим участникам." },
    ],
  },
} as const;

export const playPasses = [
  { games: 1, label: "Попробовать", note: "Одна самостоятельная онлайн-игра" },
  { games: 3, label: "Продолжить", note: "Три игры для своей компании или сообщества" },
  { games: 5, label: "Практиковаться", note: "Пять игр для регулярных встреч" },
] as const;