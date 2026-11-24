export function formatISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseISODate(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function addDays(date: Date, amount: number): Date {
  const next = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  next.setDate(next.getDate() + amount);
  return next;
}

export function startOfIsoWeek(date: Date): Date {
  const next = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const mondayIndex = (next.getDay() + 6) % 7;
  next.setDate(next.getDate() - mondayIndex);
  return next;
}

/** Monday-based ISO week, stable across Swedish daylight-saving shifts. */
export function isoWeekKey(date: Date): string {
  const utc = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = utc.getUTCDay() || 7;
  utc.setUTCDate(utc.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(utc.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((utc.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${utc.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

export function swedishDateLabel(date: Date): string {
  const formatted = new Intl.DateTimeFormat("sv-SE", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
  return formatted.charAt(0).toLocaleUpperCase("sv-SE") + formatted.slice(1);
}

export const WEEKDAYS = [
  { letter: "M", name: "måndag" },
  { letter: "T", name: "tisdag" },
  { letter: "O", name: "onsdag" },
  { letter: "T", name: "torsdag" },
  { letter: "F", name: "fredag" },
  { letter: "L", name: "lördag" },
  { letter: "S", name: "söndag" },
] as const;
