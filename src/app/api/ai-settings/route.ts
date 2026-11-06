import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET() {
  const settings = store.getAISettings();
  // Mask API keys for safe transmission
  const safeSettings = {
    ...settings,
    providers: Object.fromEntries(
      Object.entries(settings.providers).map(([k, v]) => [
        k,
        {
          ...v,
          apiKey: v.apiKey ? `${v.apiKey.slice(0, 4)}••••••••${v.apiKey.slice(-4)}` : "",
          hasKey: !!v.apiKey && v.apiKey.length > 5,
        },
      ])
    ),
  };
  return NextResponse.json({ success: true, settings: safeSettings });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const updated = store.updateAISettings(body);
    return NextResponse.json({ success: true, settings: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
