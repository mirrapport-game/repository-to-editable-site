// Yandex Metrika. Set the counter number here to enable tracking site-wide.
export const YM_ID = "113599592";

declare global { interface Window { ym?: (...a: unknown[]) => void } }

export function ymGoal(goal: string, params?: Record<string, unknown>) {
  if (YM_ID && typeof window !== "undefined") window.ym?.(Number(YM_ID), "reachGoal", goal, params);
}

export function ymInitScript() {
  if (!YM_ID) return null;
  return `(function(){var d=0;function L(){if(d)return;d=1;(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,"script","https://mc.yandex.ru/metrika/tag.js?id=${YM_ID}","ym");ym(${YM_ID},"init",{ssr:true,webvisor:true,clickmap:true,ecommerce:"dataLayer",referrer:document.referrer,url:location.href,accurateTrackBounce:true,trackLinks:true});}["pointerdown","keydown","scroll","touchstart"].forEach(function(e){addEventListener(e,L,{once:true,passive:true})});addEventListener("load",function(){setTimeout(L,4000)});})();`;
}

export function ymHit(url: string) {
  if (YM_ID && typeof window !== "undefined") window.ym?.(Number(YM_ID), "hit", url, { referer: document.referrer });
}
