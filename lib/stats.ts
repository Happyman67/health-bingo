import { ACTION_BY_ID, ALL_ACTIONS } from "@/lib/actions";
import { addDays, formatISODate, isoWeekKey, startOfIsoWeek, WEEKDAYS } from "@/lib/dates";
import { dailyActions } from "@/lib/draw";
import { formatNumber, joinPhrases } from "@/lib/format";
import type { Store } from "@/lib/storage";

export const YEAR_GOAL = 5 * 365;

export type DotStatus = "bingo" | "rest" | "miss" | "today" | "empty" | "future";

export type WeekDot = {
  iso: string;
  letter: string;
  name: string;
  status: DotStatus;
};

const actionOrder = new Map(ALL_ACTIONS.map((item, index) => [item.id, index]));

export function completedIds(store: Store, date: string): string[] {
  const day = store.days[date];
  if (!day) return [];
  const allowed = new Set(dailyActions(date, day.swap).map((item) => item.id));
  return day.done.filter((id) => allowed.has(id));
}

export function isBingo(store: Store, date: string): boolean {
  const day = store.days[date];
  const todays = dailyActions(date, day?.swap);
  const done = new Set(completedIds(store, date));
  return todays.every((item) => done.has(item.id));
}

export function yearCounts(store: Store, year: number): Map<string, number> {
  const counts = new Map<string, number>();
  const prefix = `${year}-`;
  for (const date of Object.keys(store.days)) {
    if (!date.startsWith(prefix)) continue;
    for (const id of completedIds(store, date)) {
      counts.set(id, (counts.get(id) ?? 0) + 1);
    }
  }
  return counts;
}

export function yearTotal(counts: Map<string, number>): number {
  let total = 0;
  for (const count of counts.values()) total += count;
  return total;
}

export function yearSentence(counts: Map<string, number>): string {
  const phrases = [...counts.entries()]
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1] || (actionOrder.get(a[0]) ?? 0) - (actionOrder.get(b[0]) ?? 0))
    .slice(0, 3)
    .map(([id, count]) => ACTION_BY_ID.get(id)?.phrase(count))
    .filter((phrase): phrase is string => Boolean(phrase));
  return joinPhrases(phrases);
}

export function streakDaysLabel(days: number): string {
  return days === 1 ? "1 dag" : `${formatNumber(days)} dagar`;
}

function hasAnyBingo(store: Store): boolean {
  return Object.keys(store.days).some((date) => isBingo(store, date));
}

/**
 * One missed day per ISO week (Monday–Sunday) does not break the streak.
 * Today stays open until all five are done, so an unfinished today is not a miss.
 * The length is the calendar span from the oldest connected bingo through the
 * latest bingo, including a forgiven rest day that sits inside that span.
 */
export function streakSummary(store: Store, today: Date): { days: number; dots: WeekDot[] } {
  const todayIso = formatISODate(today);
  const todayBingo = isBingo(store, todayIso);
  const anchor = todayBingo ? today : addDays(today, -1);
  const misses = new Map<string, number>();
  const included: { iso: string; bingo: boolean }[] = [];

  for (let index = 0; index < 420; index += 1) {
    const date = addDays(anchor, -index);
    const iso = formatISODate(date);
    const bingo = isBingo(store, iso);
    if (!bingo) {
      const week = isoWeekKey(date);
      const count = (misses.get(week) ?? 0) + 1;
      if (count > 1) break;
      misses.set(week, count);
    }
    included.push({ iso, bingo });
  }

  while (included.length > 0 && !included[included.length - 1].bingo) included.pop();
  const inStreak = new Set(included.map((item) => item.iso));

  const monday = startOfIsoWeek(today);
  const dots: WeekDot[] = WEEKDAYS.map((weekday, index) => {
    const date = addDays(monday, index);
    const iso = formatISODate(date);
    let status: DotStatus = "empty";
    if (iso > todayIso) status = "future";
    else if (iso === todayIso && !todayBingo) status = "today";
    else if (isBingo(store, iso)) status = "bingo";
    return { iso, letter: weekday.letter, name: weekday.name, status };
  });

  const pastOpen = dots.filter((dot) => dot.iso < todayIso && dot.status === "empty");
  const started = hasAnyBingo(store);
  for (const dot of pastOpen) {
    if (inStreak.has(dot.iso)) dot.status = "rest";
    else if (started && pastOpen.length >= 2) dot.status = "miss";
  }

  return { days: included.length, dots };
}

export function dotLabel(status: DotStatus): string {
  switch (status) {
    case "bingo":
      return "klar";
    case "rest":
      return "vilodag";
    case "miss":
      return "saknas";
    case "today":
      return "idag, inte klar än";
    case "future":
      return "kommer";
    default:
      return "ingen bingo";
  }
}
