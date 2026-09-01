export function maskEmail(email: string) {
  const normalised = String(email || "").trim();
  const [local, domain] = normalised.split("@");
  if (!local || !domain) return "";
  const visible = local.slice(0, 1);
  const masked = visible + "*".repeat(Math.max(3, Math.min(local.length - 1, 8)));
  return masked + "@" + domain;
}
