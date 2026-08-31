import { createClient } from "@/lib/supabase/server";
import contentMap from "@/generated/content.json";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new Response("Unauthorised", { status: 401 });
  }

  const source = new URL(request.url).searchParams.get("source") || "";
  const content = (contentMap as Record<string, string>)[source];

  if (!content) {
    return new Response("File not found", { status: 404 });
  }

  const filename = source.split("/").pop() || "download.txt";
  const contentType = filename.endsWith(".csv") ? "text/csv; charset=utf-8" : "text/markdown; charset=utf-8";

  return new Response(content, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": 'attachment; filename="' + filename.replace(/"/g, "") + '"'
    }
  });
}
