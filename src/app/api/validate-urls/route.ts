import { NextResponse } from "next/server";

async function checkUrl(url: string): Promise<boolean> {
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

export async function POST(req: Request) {
  try {
    const { urls } = (await req.json()) as { urls: string[] };

    if (!Array.isArray(urls)) {
      return NextResponse.json({ error: "urls must be an array" }, { status: 400 });
    }

    const results = await Promise.all(
      urls.map(async (url) => ({
        url,
        valid: await checkUrl(url),
      }))
    );

    const validSet = new Set(
      results.filter((r) => r.valid).map((r) => r.url)
    );

    return NextResponse.json({ valid: Array.from(validSet) });
  } catch {
    return NextResponse.json({ error: "Validation failed" }, { status: 500 });
  }
}
