import { ACTION_BY_ID, type CategoryId } from "@/lib/actions";
import { dailyActions, isValidSwap, replacementFor, type Swap } from "@/lib/draw";

export const STORAGE_KEY = "health-bingo:v1";

export type DayLog = {
  done: string[];
  swap?: Swap;
};

export type Store = {
  days: Record<string, DayLog>;
};

export const EMPTY_STORE: Store = { days: {} };

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
  return { days };
}

export function sanitizeStore(raw: unknown): Store {
  if (!raw || typeof raw !== "object") return EMPTY_STORE;
  const input = (raw as { days?: unknown }).days;
  if (!input || typeof input !== "object") return EMPTY_STORE;

  const days: Store["days"] = {};
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
  return { days };
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
