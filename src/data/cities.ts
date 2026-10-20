import natalyaPhoto from "@/assets/natalya-kireeva.webp";
import artemPhoto from "@/assets/artem-efimov-portrait.webp";
import marinaPhoto from "@/assets/hosts/marina-kravchenko.jpg";
import andreyPhoto from "@/assets/hosts/andrey-feshchenko.jpg";
import tatyanaPhoto from "@/assets/hosts/tatyana-otto.jpg";
import yuliaPhoto from "@/assets/hosts/yulia-novitskaya.jpg";
import vanyushkinaPhoto from "@/assets/hosts/natalya-vanyushkina.jpg";
import zhilnikovaPhoto from "@/assets/hosts/olga-zhilnikova.jpg";
import elenaVrnPhoto from "@/assets/hosts/elena-voronezh.jpg";
import tsvetkovyPhoto from "@/assets/hosts/tsvetkovy.jpg";
import korunskyPhoto from "@/assets/hosts/sergey-korunsky.jpg";
import lednevPhoto from "@/assets/hosts/sergey-lednev.jpg";
import nnPhoto1 from "@/assets/hosts/udovichenkov-original-1.jpg";
import nnPhoto2 from "@/assets/hosts/udovichenkov-original-2.jpg";
import nskPhoto from "@/assets/hosts/evgeny-novosibirsk.jpg";
import evgenyIrkPhoto from "@/assets/hosts/evgeny-irkutsk.jpg";
import vrublevskayaAsset from "@/assets/hosts/victoria-vrublevskaya-new.jpg";
const vrublevskayaPhoto = vrublevskayaAsset;
import koldashevaPhoto from "@/assets/hosts/olga-koldasheva.jpg";
import samaraAsset from "@/assets/hosts/svetlana-tikhomirova-new.jpg";
const samaraPhoto = samaraAsset;
import kemerovoPhoto from "@/assets/hosts/victoria-kemerovo.jpg";
import elviraPhoto from "@/assets/hosts/elvira-spb.jpg";
import dinaPhoto from "@/assets/hosts/dina-magdenko.webp";
import nikitinPhoto from "@/assets/hosts/alexander-nikitin.jpg";
import katrinPhoto from "@/assets/hosts/katrin-krasnoyarsk.jpg";
import natalyaKrsPhoto from "@/assets/hosts/natalya-krasnoyarsk.jpg";
import timoshenkoPhoto from "@/assets/hosts/elena-timoshenko.jpg";
import mariannaPhoto from "@/assets/hosts/marianna.png";
import panasyukPhoto from "@/assets/hosts/margarita-panasyuk.jpg";
import efremovaPhoto from "@/assets/hosts/tatyana-efremova.jpg";
import moskvinaPhoto from "@/assets/hosts/maria-moskvina.jpg";

export type CityEvent = { date: string; time: string; game: string; place: string };

export type City = {
  slug: string;
  name: string;
  timeZone: string;
  facilitators: Facilitator[];
  schedule: CityEvent[];
};

export type Facilitator = {
  slug: string;
  name: string;
  surname: string;
  /** Empty string = no photo yet; the page shows initials. */
  photo: string;
  /** Optional extra photos; when present, the city page shows them as an auto-rotating slider. */
  photos?: string[];
  /** Optional short intro video URL; loads only when the visitor presses play. */
  introVideo?: string;
  roles: string[];
  story: string[];
  locations: string[];
  telegram: string;
  telegramUrl: string;
  /** Host's own Telegram channel, if any. */
  channelUrl?: string | undefined;
};

const artem: Facilitator = {
  slug: "artem-efimov",
  name: "Артём",
  surname: "Ефимов",
  photo: artemPhoto,
  roles: ["Автор серии игр «Раппóрт»", "Ведущий игр об отношениях и коммуникации", "Основатель Академии Раппóрт"],
  story: [
    "Артём Ефимов — автор серии психологических игр «Раппóрт». Он создаёт пространство, в котором сложные темы перестают быть тяжёлыми, а честный разговор становится началом настоящих изменений.",
    "В основе его подхода — партнёрство, развитие и гармония. Через игровые механики участники лучше слышат себя и друг друга, замечают привычные сценарии общения и находят новые решения.",
    "Проводит личные, парные, групповые и бизнес-игры в Москве, Санкт-Петербурге и онлайн. Также обучает ведущих в Академии Раппóрт.",
  ],
  locations: ["Москва", "Санкт-Петербург", "Онлайн"],
  telegram: "@artem_rapport",
  telegramUrl: "https://t.me/artem_rapport",
  channelUrl: "https://t.me/rapport_game",
};

/** Host whose details come from their own Telegram channel (text quoted, nothing invented). */
function host(slug: string, name: string, surname: string, photo: string, locations: string[], roles: string[], story: string[], url = "", handle = "", photos: string[] = []): Facilitator {
  const tg = handle || (url.includes("t.me/") && !url.includes("/+") ? "@" + url.split("t.me/")[1] : url ? "канал ведущего" : "");
  return { slug, name, surname, photo, photos, roles, story, locations, telegram: tg || "@artem_rapport", telegramUrl: url || "https://t.me/artem_rapport", channelUrl: url || undefined };
}
const noInfo = ["Подробное описание ведущего скоро появится. Записаться на игру можно через форму на сайте."];

const H = {
  marina: host("marina-kravchenko", "Марина", "Кравченко", marinaPhoto, ["Волгоград", "Онлайн"], ["Семейный психолог", "Пространство PRO Ресурс"], ["«Эмоциональное здоровье — ваш главный ресурс». Пространство PRO Ресурс в Волгограде."], "https://t.me/propecypc", "@marina_kravchenko_vlg"),
  andrey: host("andrey-feshchenko", "Андрей", "Фещенко", andreyPhoto, ["Иркутск", "Онлайн"], ["Психосоматика", "Работа очно и онлайн"], ["«Помогаю выйти из тупика болезни, долгов, отсутствия энергии и радости в отношениях. Работаю с головой и телом очно и онлайн»."], "https://t.me/andrey_psilife_blog", "@andrey_psilife"),
  otto: host("tatyana-otto", "Татьяна", "Отто", tatyanaPhoto, ["Москва"], ["Медиатор", "Тренер по созданию партнёрских отношений"], ["«Медиатор. Помогаю в решении конфликтов. Тренер по созданию партнёрских отношений»."], "https://t.me/Ottoogonek", "@Ottoogonek"),
  yulia: host("yulia-novitskaya", "Юлия", "Новицкая", yuliaPhoto, ["Сочи", "Онлайн"], ["Семейный терапевт", "Отношения в паре"], ["«Канал про то, как создать союз нового времени. Про открытые и бережные отношения в паре. Помогу пройти через кризисы, выстроить доверие в отношениях»."], "https://t.me/oh_coach_me", "@ulek_k"),
  vanyushkina: host("natalya-vanyushkina", "Наталья", "Ванюшкина", vanyushkinaPhoto, ["Санкт-Петербург"], ["Наставник, проводник", "Ведущая «Раппóрт Живая»"], ["«Для женщин, которые хотят перестать жить „как надо“ и вернуться к себе. Самоценность, опора, границы, проявленность»."], "https://t.me/proyavis_SPb", "@natalyavnshkn"),
  zhilnikova: host("olga-zhilnikova", "Ольга", "Жильникова", zhilnikovaPhoto, ["Санкт-Петербург"], ["Психолог-сексолог"], ["«Помогаю предпринимателям и экспертам жить свободно и ярко — направлять энергию на рост дохода и сильные отношения»."], "https://t.me/cQyYhLJc6ANiZjhi", "@zhilnikova_olga"),
  elenaVrn: host("elena-voronezh", "Елена", "", elenaVrnPhoto, ["Воронеж"], ["Ведущая игр «Раппóрт»"], ["Канал «Поговорим по душам»."], "https://t.me/MeanZdrav"),
  tsvetkovy: host("tsvetkovy", "Цветана и Роман", "Цветковы", tsvetkovyPhoto, ["Санкт-Петербург"], ["Ресурсные отношения с собой", "Пара ведущих"], ["Канал «О!Живая с Цветаной»: «экспертность по ресурсным отношениям с собой и всё, что умножает количество счастливых и пробуждённых женщин»."], "https://t.me/ozhivaya88", "@TsvetanaLove"),
  korunsky: host("sergey-korunsky", "Сергей", "Корунский", korunskyPhoto, ["Донецк"], ["Предприниматель", "Бакалавр психологии, гипнотерапевт", "Автор книги «Жизнь Вечная»"], ["Канал «Сергей Корунский — жизнь без страхов»."], "https://t.me/serg_korunskiy"),
  lednev: host("sergey-lednev", "Сергей", "Леднёв", lednevPhoto, ["Ярославль", "Онлайн"], ["Кризисы и взросление"], ["Канал «Сергей Вертекс. Реальность без намордника»: «говорю прямо про кризисы и взросление»."], "https://t.me/DoctorVertexClub"),
  nn: host("udovichenkov-maya", "Александр Удовиченко", "и Майя Селезнёва", nnPhoto1, ["Нижний Новгород"], ["Пара ведущих", "Игра про отношения мужчины и женщины"], ["«Проводим каждый четверг и воскресенье в 19:00 в Нижнем Новгороде»."], "https://t.me/rapportnn", "", [nnPhoto1, nnPhoto2]),
  dina: host("dina-magdenko", "Дина", "Магденко", dinaPhoto, ["Челябинск"], ["Психолог"], noInfo, "https://vk.ru/psyhologdina74", "ВКонтакте"),
  nikitin: host("alexander-nikitin", "Александр", "Никитин", nikitinPhoto, ["Челябинск"], ["Сексология", "Ведущий игр «Раппóрт»"], ["Канал «Сексология для всех»."], "https://t.me/sexology555"),
  evgenyNsk: host("evgeny-novosibirsk", "Евгений", "", nskPhoto, ["Новосибирск", "Онлайн"], ["Ведущий игры «Раппóрт Отношения»"], ["«Живое пространство, где люди исследуют отношения через игру „Раппóрт“, учатся понимать друг друга, знакомятся, находят друзей и любимых»."], "https://t.me/rapport_nsk", "@evbro"),
  elenaKrs: host("elena-timoshenko", "Елена", "Тимошенко", timoshenkoPhoto, ["Красноярск"], ["Психологическая поддержка", "Бизнес-тренер"], ["«Сопровождение в личном и профессиональном развитии, профессиональная поддержка в самоопределении, разрешение внутренних конфликтов»."], "https://t.me/it92DXoytoQ2MmEy"),
  katrin: host("katrin-krasnoyarsk", "Катрин", "", katrinPhoto, ["Красноярск"], ["Ведущая игр «Раппóрт»"], noInfo),
  natalyaKrs: host("natalya-krasnoyarsk", "Наталья", "", natalyaKrsPhoto, ["Красноярск"], ["Ведущая игр «Раппóрт»"], noInfo),
  evgenyIrk: host("evgeny-irkutsk", "Евгений", "Грозин", evgenyIrkPhoto, ["Иркутск"], ["Работа с подсознанием", "Ведущий игр «Раппóрт»"], ["Канал «Осознанность через транс»."], "https://t.me/transeEvgen", "@Hypno_grozin"),
  vrublevskaya: host("victoria-vrublevskaya", "Виктория", "Врублевская", vrublevskayaPhoto, ["Москва"], ["Ведущая игр «Раппóрт»"], ["Канал «Раппóрт для отношений»: психологическая ролевая игра для отношений."], "https://t.me/rapport_otnosheniya"),
  koldasheva: host("olga-koldasheva", "Ольга", "Колдашева", koldashevaPhoto, ["Москва"], ["Трансформационные игры", "Расстановки, МАК-карты"], ["Канал «Душевные игры с Блондинкой»: трансформационные игры, психология, отношения с самим собой и с миром."], "https://t.me/+vbAUEZi2hfZkMDg6"),
  moskvina: host("maria-moskaleva", "Мария", "Москалева", moskvinaPhoto, ["Москва"], ["Ведущая игр «Раппóрт»"], noInfo),
  tikhomirova: host("svetlana-tikhomirova", "Светлана", "Тихомирова", samaraPhoto, ["Самара"], ["Ведущая игр «Раппóрт»"], ["«Психологическая игра для всех, кто хочет улучшить отношения. Разбираем конфликты, учимся понимать друг друга»."], "https://t.me/rapport_samara"),
  victoriaKem: host("victoria-kemerovo", "Виктория", "", kemerovoPhoto, ["Кемерово"], ["Ведущая игр «Раппóрт»"], ["«Психологические игры для пар и тех, кто хочет улучшить отношения»."], "https://t.me/raportkemerovo"),
  marianna: host("marianna-lenoblast", "Марианна", "", mariannaPhoto, ["Ленинградская область"], ["Ведущая игр «Раппóрт»"], noInfo),
  panasyuk: host("margarita-panasyuk", "Маргарита", "Панасюк", panasyukPhoto, ["Краснодар"], ["Ведущая игр «Раппóрт»"], noInfo),
  efremova: host("tatyana-efremova", "Татьяна", "Ефремова", efremovaPhoto, ["Благовещенск"], ["Психолог-сексолог"], ["«Здесь про отношения с тобой и к себе»."], "https://t.me/sexologist_blg", "@Tatyana_Efremova"),
  elvira: host("elvira-spb", "Эльвира", "", elviraPhoto, ["Санкт-Петербург"], ["Ведущая игр «Раппóрт»"], ["Канал «Раппóрт — территория счастливых отношений»: как построить отношения, о которых мечтаешь."], "https://t.me/territoria_chastia"),
};

const c = (slug: string, name: string, facilitators: Facilitator[], timeZone = "Europe/Moscow"): City => ({ slug, name, timeZone, facilitators, schedule: [] });

/** Ведущая «Раппóрт» в Иркутске; проводит и онлайн-игры. */
const natalyaKireeva: Facilitator = {
  slug: "natalya-kireeva",
  name: "Наталья",
  surname: "Киреева",
  photo: natalyaPhoto,
  roles: ["Практикующий психолог", "Коуч", "Парный семейный терапевт (ЭФТ)"],
  story: [
    "После множества трансформационных игр меня пригласили на «Раппóрт» как участницу. В процессе игры я увидела, как пары говорят о важном, о чём молчат годами. В тот же вечер я написала автору: «Я хочу приобрести „Раппóрт“ и проводить его в Иркутске». Это было импульсивное и самое верное профессиональное решение.",
    "«Раппóрт» стал терапией и для меня. За полтора года совместной игры с мужем мы узнали друг о друге больше, чем за 10 лет брака. Из психолога я превратилась в живого игрока, который учится договариваться вместе с участниками.",
    "Моя философия: говорить, пока не взорвался. Я учу пары слышать друг друга до эмоционального взрыва и договариваться так, чтобы в выигрыше остались оба. Решение рождается в контакте, который и называется раппóрт.",
    "Более 50 игр каждую среду уже полтора года и более 600 участников. Они уходят с игры с ощущением: «У нас всё получится». Ради этого состояния и стоит играть.",
  ],
  locations: ["Иркутск", "Онлайн"],
  telegram: "@NataIgraRapport",
  telegramUrl: "https://t.me/NataIgraRapport",
};

const allCities: City[] = [
  {
    slug: "irkutsk",
    name: "Иркутск",
    timeZone: "Asia/Irkutsk",
    facilitators: [natalyaKireeva, H.andrey, H.evgenyIrk],
    schedule: [],
  },
  {
    slug: "moscow",
    name: "Москва",
    timeZone: "Europe/Moscow",
    facilitators: [artem, H.vrublevskaya, H.koldasheva, H.otto, H.moskvina],
    schedule: [],
  },
  {
    slug: "saint-petersburg",
    name: "Санкт-Петербург",
    timeZone: "Europe/Moscow",
    facilitators: [artem, H.vanyushkina, H.elvira, H.zhilnikova, H.tsvetkovy],
    schedule: [],
  },
  {
    slug: "online",
    name: "Онлайн",
    timeZone: "Europe/Moscow",
    facilitators: [artem, H.evgenyNsk, H.andrey, H.marina, natalyaKireeva, H.lednev, H.yulia],
    schedule: [],
  },
  c("voronezh", "Воронеж", [H.elenaVrn]),
  c("volgograd", "Волгоград", [H.marina], "Europe/Volgograd"),
  c("samara", "Самара", [H.tikhomirova], "Europe/Samara"),
  c("nizhny-novgorod", "Нижний Новгород", [H.nn]),
  c("chelyabinsk", "Челябинск", [H.dina, H.nikitin], "Asia/Yekaterinburg"),
  c("novosibirsk", "Новосибирск", [H.evgenyNsk], "Asia/Novosibirsk"),
  c("krasnoyarsk", "Красноярск", [H.elenaKrs, H.katrin, H.natalyaKrs], "Asia/Krasnoyarsk"),
  c("kemerovo", "Кемерово", [H.victoriaKem], "Asia/Novokuznetsk"),
  c("leningrad-oblast", "Ленинградская область", [H.marianna]),
  c("sochi", "Сочи", [H.yulia]),
  c("krasnodar", "Краснодар", [H.panasyuk]),
  c("donetsk", "Донецк", [H.korunsky]),
  c("yaroslavl", "Ярославль", [H.lednev]),
  c("blagoveshchensk", "Благовещенск", [H.efremova], "Asia/Yakutsk"),
];

// Порядок показа: Петербург, Москва, Сочи, Иркутск, затем остальные.
const CITY_ORDER = ["saint-petersburg", "moscow", "sochi", "irkutsk"];
const rank = (slug: string) => { const i = CITY_ORDER.indexOf(slug); return i < 0 ? CITY_ORDER.length : i; };
export const cities: City[] = allCities.map((c, i) => ({ c, i })).sort((a, b) => rank(a.c.slug) - rank(b.c.slug) || a.i - b.i).map(({ c }) => c);

export const getCity = (slug: string) => cities.find((c) => c.slug === slug);

export const eventFormats = [
  "Девичники", "Свадьбы", "Дни рождения", "Корпоративы", "Встречи друзей",
  "Семейные праздники", "Тимбилдинги", "Женские клубы", "Ретриты", "Встречи пар",
];
