import { canAccessTier, modules, type Tier } from "@/lib/programme-data";
import { getActiveEnrolment, getCurrentAcademyContext } from "@/lib/academy";
import contentMap from "@/generated/content.json";

export const dynamic = "force-dynamic";

function safeDownloadFilename(source: string) {
  const filename = source.split("/").pop() || "download.txt";
  return filename.replace(/[\u0000-\u001f\u007f"\\]/g, "_");
}

export async function GET(request: Request) {
  const context = await getCurrentAcademyContext();
  if (!context) return new Response("Unauthorised", { status: 401 });

  const enrolment = await getActiveEnrolment(context.academyUser.id);
  if (!enrolment) return new Response("No active programme access", { status: 403 });

  const source = new URL(request.url).searchParams.get("source") || "";
  const content = (contentMap as Record<string, string>)[source];
  if (!content) return new Response("File not found", { status: 404 });

  const lesson = modules.flatMap((module) => module.lessons).find((item) => item.source === source);
  if (!lesson || !canAccessTier(enrolment.tier as Tier, lesson.minimumTier)) {
    return new Response("This file is not included in your programme access", { status: 403 });
  }

  const filename = safeDownloadFilename(source);
  const contentType = filename.endsWith(".csv") ? "text/csv; charset=utf-8" : "text/markdown; charset=utf-8";
  return new Response(content, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": "attachment; filename=\"" + filename + "\"",
      "Cache-Control": "private, no-store, max-age=0",
      "Pragma": "no-cache",
      "X-Content-Type-Options": "nosniff"
    }
  });
}
