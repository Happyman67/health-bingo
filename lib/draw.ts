import { ACTION_BY_ID, CATEGORIES, type Action, type CategoryId } from "@/lib/actions";

export type Swap = {
  categoryId: CategoryId;
  actionId: string;
};

export function hashString(input: string): number {
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function pickIndex(date: string, categoryId: CategoryId, length: number): number {
  return hashString(`${date}:${categoryId}`) % length;
}

export function naturalAction(date: string, categoryId: CategoryId): Action {
  const category = CATEGORIES.find((item) => item.id === categoryId);
  if (!category) throw new Error(`Okänd kategori: ${categoryId}`);
  return category.actions[pickIndex(date, categoryId, category.actions.length)];
}

export function replacementFor(date: string, categoryId: CategoryId): Action {
  const category = CATEGORIES.find((item) => item.id === categoryId);
  if (!category) throw new Error(`Okänd kategori: ${categoryId}`);
  const index = pickIndex(date, categoryId, category.actions.length);
  return category.actions[(index + 1) % category.actions.length];
}

export function isValidSwap(date: string, categoryId: string, actionId: string): categoryId is CategoryId {
  const category = CATEGORIES.find((item) => item.id === categoryId);
  if (!category) return false;
  const action = category.actions.find((item) => item.id === actionId);
  if (!action) return false;
  return action.id !== naturalAction(date, category.id).id;
}

export function dailyActions(date: string, swap?: Swap): Action[] {
  return CATEGORIES.map((category) => {
    if (swap?.categoryId === category.id) {
      const swapped = ACTION_BY_ID.get(swap.actionId);
      if (swapped && swapped.categoryId === category.id) return swapped;
    }
    return naturalAction(date, category.id);
  });
}

export function boardRows(date: string, swap?: Swap): Action[][] {
  const todays = new Map(dailyActions(date, swap).map((item) => [item.categoryId, item]));
  const columns = CATEGORIES.map((category) => {
    const today = todays.get(category.id);
    if (!today) return category.actions;
    const rest = category.actions.filter((item) => item.id !== today.id);
    return [today, ...rest];
  });
  return [0, 1, 2, 3, 4].map((row) => columns.map((column) => column[row]));
}

export function yearRows(): Action[][] {
  return [0, 1, 2, 3, 4].map((row) => CATEGORIES.map((category) => category.actions[row]));
}
