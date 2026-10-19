// Посадочные страницы ведущих: slug ведущего → адрес страницы.
export const hostLandings: Record<string, { path: string; title: string }> = {
  "natalya-kireeva": { path: "/lp/irkutsk-natalya", title: "Раппóрт — Живая в Иркутске" },
  "natalya-vanyushkina": { path: "/lp/spb-natalya", title: "Раппóрт — Живая в Петербурге" },
  "marina-kravchenko": { path: "/lp/volgograd-marina", title: "Раппóрт — Живая в Волгограде" },
  "yulia-novitskaya": { path: "/lp/sochi-yulia", title: "Раппóрт — Живая в Сочи" },
};

// All landing pages with their tracking id (the "landing" value they send).
export const landingPages = Object.values(hostLandings).map((l) => ({ ...l, id: l.path.replace("/lp/", "") }));
