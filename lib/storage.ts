import { ACTION_BY_ID, type CategoryId } from "@/lib/actions";
import { dailyActions, isValidSwap, replacementFor, type Swap } from "@/lib/draw";

export const STORAGE_KEY = "health-bingo:v1";

export type DayLog = {
  done: string[];
  swap?: Swap;
};

export type DemoState = {
  enabled: boolean;
  offset: number;
};

export type Store = {
  days: Record<string, DayLog>;
  demo: DemoState;
  demoDays: Record<string, DayLog>;
};

export const EMPTY_DEMO: DemoState = { enabled: false, offset: 0 };

export const EMPTY_STORE: Store = { days: {}, demo: EMPTY_DEMO, demoDays: {} };

const MAX_DEMO_OFFSET = 400;

function copyDay(day: DayLog | undefined): DayLog {
  return {
    done: [...(day?.done ?? [])],
    ...(day?.swap ? { swap: { ...day.swap } } : {}),
  };
}

function writeDay(store: Store, date: string, day: DayLog): Store {
  const days = { ...store.days };
  if (day.done.length === 0 && !day.swap) delete days[date];
  else days[date] = day;
  return { ...store, days };
}

function sanitizeDays(input: unknown): Record<string, DayLog> {
  if (!input || typeof input !== "object") return {};
  const days: Record<string, DayLog> = {};
  for (const [date, value] of Object.entries(input)) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !value || typeof value !== "object") continue;
    const doneRaw = (value as { done?: unknown }).done;
    const done = Array.isArray(doneRaw)
      ? [...new Set(doneRaw.filter((id): id is string => typeof id === "string" && ACTION_BY_ID.has(id)))]
      : [];

    let swap: Swap | undefined;
    const swapRaw = (value as { swap?: unknown }).swap;
    if (swapRaw && typeof swapRaw === "object") {
      const categoryId = (swapRaw as { categoryId?: unknown }).categoryId;
      const actionId = (swapRaw as { actionId?: unknown }).actionId;
      if (
        typeof categoryId === "string" &&
        typeof actionId === "string" &&
        isValidSwap(date, categoryId, actionId)
      ) {
        swap = { categoryId, actionId };
      }
    }

    const allowed = new Set(dailyActions(date, swap).map((item) => item.id));
    const filtered = done.filter((id) => allowed.has(id));
    if (filtered.length === 0 && !swap) continue;
    days[date] = swap ? { done: filtered, swap } : { done: filtered };
  }
  return days;
}

function sanitizeDemo(raw: unknown): DemoState {
  if (!raw || typeof raw !== "object") return EMPTY_DEMO;
  const enabled = (raw as { enabled?: unknown }).enabled === true;
  const offsetRaw = (raw as { offset?: unknown }).offset;
  const offset =
    typeof offsetRaw === "number" && Number.isFinite(offsetRaw)
      ? Math.max(-MAX_DEMO_OFFSET, Math.min(MAX_DEMO_OFFSET, Math.trunc(offsetRaw)))
      : 0;
  return { enabled, offset };
}

export function sanitizeStore(raw: unknown): Store {
  if (!raw || typeof raw !== "object") return EMPTY_STORE;
  return {
    days: sanitizeDays((raw as { days?: unknown }).days),
    demo: sanitizeDemo((raw as { demo?: unknown }).demo),
    demoDays: sanitizeDays((raw as { demoDays?: unknown }).demoDays),
  };
}

export function loadStore(): Store {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_STORE;
    return sanitizeStore(JSON.parse(raw) as unknown);
  } catch {
    return EMPTY_STORE;
  }
}

export function saveStore(store: Store): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    return true;
  } catch {
    return false;
  }
}

export function toggleDone(store: Store, date: string, actionId: string): Store | null {
  const day = store.days[date];
  const todays = dailyActions(date, day?.swap);
  if (!todays.some((item) => item.id === actionId)) return null;
  const next = copyDay(day);
  if (next.done.includes(actionId)) next.done = next.done.filter((id) => id !== actionId);
  else next.done = [...next.done, actionId];
  return writeDay(store, date, next);
}

export function clearAppStorage(): void {
  try {
    const keys: string[] = [];
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (key?.startsWith("health-bingo")) keys.push(key);
    }
    for (const key of keys) localStorage.removeItem(key);
  } catch {
    // Private mode can throw. The in-memory store is still cleared by the caller.
  }
}

export function setDemoEnabled(store: Store, enabled: boolean): Store {
  return { ...store, demo: { ...store.demo, enabled } };
}

export function shiftDemoOffset(store: Store, delta: number): Store {
  const offset = Math.max(-MAX_DEMO_OFFSET, Math.min(MAX_DEMO_OFFSET, store.demo.offset + delta));
  return { ...store, demo: { ...store.demo, enabled: true, offset } };
}

export function swapSuggestion(store: Store, date: string, categoryId: CategoryId): Store | null {
  const day = store.days[date];
  if (day?.swap) return null;
  const current = dailyActions(date).find((item) => item.categoryId === categoryId);
  if (!current || day?.done.includes(current.id)) return null;
  const replacement = replacementFor(date, categoryId);
  const next = copyDay(day);
  next.done = next.done.filter((id) => id !== current.id);
  next.swap = { categoryId, actionId: replacement.id };
  return writeDay(store, date, next);
}
