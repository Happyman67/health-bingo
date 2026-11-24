import { addDays, formatISODate } from "@/lib/dates";
import { dailyActions } from "@/lib/draw";
import type { DayLog, Store } from "@/lib/storage";

/** Sample year for demo mode: every day before `today` is bingo, except Mondays. */
export function buildSampleDays(today: Date): Record<string, DayLog> {
  const todayIso = formatISODate(today);
  const days: Record<string, DayLog> = {};
  let cursor = new Date(today.getFullYear(), 0, 1);

  while (formatISODate(cursor) < todayIso) {
    const monday = (cursor.getDay() + 6) % 7 === 0;
    if (!monday) {
      const iso = formatISODate(cursor);
      days[iso] = { done: dailyActions(iso).map((action) => action.id) };
    }
    cursor = addDays(cursor, 1);
  }

  return days;
}

export function fillDemoYear(store: Store, today: Date): Store {
  return {
    ...store,
    demo: { ...store.demo, enabled: true },
    demoDays: buildSampleDays(today),
  };
}
