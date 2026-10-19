// Shared explanation of the core idea: players act a character, not themselves.
export function CharacterNote() {
  return <section className="section border-y border-border bg-secondary"><div className="section-inner grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
    <div><p className="eyebrow">Главное правило игры</p><h2 className="section-title">Вы играете <em>персонажа</em>, а не себя</h2></div>
    <div className="space-y-4 text-lg leading-8 text-muted-foreground">
      <p>Участники отыгрывают персонажа, а не свою личность — и обратную связь получает персонаж, а не человек. Поэтому здесь безопасно.</p>
      <p>Персонаж может быть любым — даже тем, кем вы боитесь проявиться в реальной жизни.</p>
      <div className="flex flex-wrap gap-2 pt-2">{["Тренажёр отношений", "Полигон чувств и эмоций", "Здесь можно смеяться и плакать"].map((t) => <span key={t} className="rounded-full border border-border bg-background px-4 py-2 text-base text-foreground">{t}</span>)}</div>
    </div>
  </div></section>;
}

// Author's words about «Раппóрт. Живая».
export function ZhivayaStory() {
  return <section className="section bg-foreground text-background"><div className="section-inner max-w-4xl">
    <p className="eyebrow text-accent">Слово автора</p>
    <h2 className="mt-4 font-display text-5xl leading-none md:text-7xl">А ларчик-то <em className="text-accent">открывается просто…</em></h2>
    <div className="mt-10 space-y-6 text-lg leading-8 text-background/80">
      <p>Мы все всю жизнь в проработках. Но кто из вас задумывался о ресурсе, который хранится в вашей тени — в самокритике, злости, зависти и обидах?</p>
      <p>Пришло время дать этому место: стать наблюдателем, а не подопытным, научиться распознавать и проживать свои чувства, понять, как управлять эмоциями, — и познакомиться со своей тенью.</p>
      <p>Кто-то скажет: «Я привыкла жить в таких сценариях». И будет права — мы все привыкли. Но очень часто привычки бывают вредными.</p>
      <p className="font-display text-3xl italic text-background">Пришло время прикоснуться к себе — Живой, настоящей.</p>
      <p>«Раппóрт. Живая» — глубокая игра про тебя, про меня, про жизнь. Без масок, без понтов, по-настоящему. Безопасный круг красивых женщин и один-два мужчины, которые делятся своим видением современной женщины.</p>
      <p>Волшебное поле игры, где тайное становится явным, а то, что было глубоко скрыто, обнаруживается и перестаёт иметь прежнее значение. Где мы учимся выбирать себя, партнёра, дело, которым хотим заниматься, и разговор, который хотим начать — или закончить.</p>
    </div>
    <div className="mt-10 grid gap-px bg-background/20 sm:grid-cols-3">{[["3 часа", "игры"], ["3 часа", "жизни"], ["надолго", "послевкусие"]].map(([v, l]) => <div key={l} className="bg-foreground p-6"><p className="font-display text-4xl text-accent">{v}</p><p className="mt-1 text-background/70">{l}</p></div>)}</div>
    <p className="mt-10 text-lg text-background/80">Жизнь сама расставит всё по местам — но уже по новым. <span className="font-display text-2xl italic text-background">Просто доверься…</span></p>
  </div></section>;
}
