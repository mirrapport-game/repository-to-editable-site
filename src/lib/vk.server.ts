// VK community wall cross-posting to the community that owns the token. Requires VK_ACCESS_TOKEN (community or admin token with wall rights).
const V = "5.199";

async function vk(method: string, params: Record<string, string>) {
  const token = process.env["VK_ACCESS_TOKEN"];
  if (!token) throw new Error("VK_ACCESS_TOKEN is not configured");
  const body = new URLSearchParams({ ...params, access_token: token, v: V });
  const res = await fetch(`https://api.vk.com/method/${method}`, { method: "POST", body });
  const json = (await res.json()) as { response?: unknown; error?: { error_code: number; error_msg: string } };
  if (!res.ok || json.error) throw new Error(`VK ${method} failed [${res.status}]: ${json.error?.error_code} ${json.error?.error_msg}`);
  return json.response;
}

export async function vkPostToWall(text: string): Promise<number> {
  const g = (await vk("groups.getById", {})) as { groups?: { id: number }[] } | { id: number }[];
  const id = Array.isArray(g) ? g[0]?.id : g.groups?.[0]?.id;
  if (!id) throw new Error("VK group not found");
  const r = (await vk("wall.post", { owner_id: String(-id), from_group: "1", message: `${text}\n\nБольше на сайте: https://rapportgame.ru/blog` })) as { post_id: number };
  return r.post_id;
}
