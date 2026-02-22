import type { ActivityContent, Resource } from "@/types";

async function isUrlReachable(url: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
      redirect: "follow",
    });
    clearTimeout(timeout);
    return res.ok;
  } catch {
    return false;
  }
}

export async function validateResources(
  resources: Resource[]
): Promise<Resource[]> {
  const results = await Promise.allSettled(
    resources.map(async (resource) => {
      if (!resource.url) return resource;
      const reachable = await isUrlReachable(resource.url);
      if (reachable) return resource;
      // URL is broken — keep the resource but remove the bad link
      return { ...resource, url: undefined };
    })
  );

  return results.map((r, i) =>
    r.status === "fulfilled" ? r.value : resources[i]
  );
}

export async function validateActivityUrls(
  activities: { content: ActivityContent }[]
): Promise<void> {
  await Promise.all(
    activities.map(async (activity) => {
      if (activity.content.resources?.length) {
        activity.content.resources = await validateResources(
          activity.content.resources
        );
      }
    })
  );
}
