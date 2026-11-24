import { duration, formatNumber, times } from "@/lib/format";

export type CategoryId = "kropp" | "sinne" | "rel" | "ute" | "gladje";

export type Action = {
  id: string;
  categoryId: CategoryId;
  label: string;
  text: string;
  phrase: (count: number) => string;
};

export type Category = {
  id: CategoryId;
  title: string;
  fullName: string;
  base: string;
  deep: string;
  soft: string;
  ink: string;
  actions: Action[];
};

function action(
  categoryId: CategoryId,
  id: string,
  label: string,
  text: string,
  phrase: (count: number) => string,
): Action {
  return { id, categoryId, label, text, phrase };
}

export const CATEGORIES: Category[] = [
  {
    id: "kropp",
    title: "Kropp",
    fullName: "Kropp",
    base: "#FF8B5E",
    deep: "#C24B22",
    soft: "#FFE4D6",
    ink: "#8A3416",
    actions: [
      action("kropp", "strack", "Sträck", "Stretcha i 5 minuter", (n) => `stretchat ${duration(n * 5)}`),
      action("kropp", "knaboj", "Knäböj", "Gör 10 knäböj", (n) => `gjort ${formatNumber(n * 10)} knäböj`),
      action("kropp", "trappa", "Trappa", "Ta trappan i stället för hissen", (n) => `tagit trappan ${times(n)}`),
      action("kropp", "vatten", "Vatten", "Drick ett glas vatten", (n) =>
        n === 1 ? "druckit 1 glas vatten" : `druckit ${n} glas vatten`,
      ),
      action("kropp", "lugnt", "Lugnt", "Ät en måltid i lugn och ro", (n) =>
        n === 1 ? "ätit 1 måltid i lugn och ro" : `ätit ${n} måltider i lugn och ro`,
      ),
    ],
  },
  {
    id: "sinne",
    title: "Sinne",
    fullName: "Sinne",
    base: "#B79BFF",
    deep: "#6D4CC4",
    soft: "#EDE4FF",
    ink: "#4A2E92",
    actions: [
      action("sinne", "andas", "Andas", "Djupandas i 1 minut", (n) => `andats djupt i ${duration(n)}`),
      action("sinne", "tack", "Tack", "Skriv ner en sak du är tacksam för", (n) =>
        n === 1 ? "skrivit ner 1 tacksamhet" : `skrivit ner ${n} tacksamheter`,
      ),
      action("sinne", "paus", "Paus", "Ta en skärmfri paus i 10 minuter", (n) =>
        n === 1 ? "tagit 1 skärmfri paus" : `tagit ${n} skärmfria pausar`,
      ),
      action("sinne", "stilla", "Stilla", "Sitt stilla i 2 minuter", (n) => `suttit stilla i ${duration(n * 2)}`),
      action("sinne", "skriv", "Skriv", "Skriv tre rader om hur du mår", (n) => `skrivit om hur du mår ${times(n)}`),
    ],
  },
  {
    id: "rel",
    title: "Rel.",
    fullName: "Relationer",
    base: "#FF9BC0",
    deep: "#D24E86",
    soft: "#FFE3EE",
    ink: "#8E2458",
    actions: [
      action("rel", "halsa", "Hälsa", "Skicka en hälsning till någon du tycker om", (n) =>
        n === 1 ? "skickat 1 hälsning" : `skickat ${n} hälsningar`,
      ),
      action("rel", "berom", "Beröm", "Ge någon en komplimang", (n) =>
        n === 1 ? "gett 1 komplimang" : `gett ${n} komplimanger`,
      ),
      action("rel", "ring", "Ring", "Ring upp någon du saknar", (n) =>
        n === 1 ? "ringt 1 samtal" : `ringt ${n} samtal`,
      ),
      action("rel", "lyssna", "Lyssna", "Lyssna färdigt på någon utan att avbryta", (n) => `lyssnat färdigt ${times(n)}`),
      action("rel", "kram", "Kram", "Ge eller be om en kram", (n) => (n === 1 ? "gett 1 kram" : `gett ${n} kramar`)),
    ],
  },
  {
    id: "ute",
    title: "Ute",
    fullName: "Ute",
    base: "#7ED498",
    deep: "#2E8B4E",
    soft: "#DEF6E5",
    ink: "#1B6334",
    actions: [
      action("ute", "ljus", "Ljus", "Gå ut i dagsljus i 10 minuter", (n) => `varit ute i dagsljus i ${duration(n * 10)}`),
      action("ute", "vaxt", "Växt", "Plantera eller vattna en växt", (n) => `vattnat en växt ${times(n)}`),
      action("ute", "runda", "Runda", "Gå en kort runda utomhus", (n) =>
        n === 1 ? "gått 1 runda utomhus" : `gått ${n} rundor utomhus`,
      ),
      action("ute", "himmel", "Himmel", "Titta upp på himlen en stund", (n) => `tittat på himlen ${times(n)}`),
      action("ute", "luft", "Luft", "Andas frisk luft ute eller vid ett fönster", (n) => `andats frisk luft ${times(n)}`),
    ],
  },
  {
    id: "gladje",
    title: "Glädje",
    fullName: "Glädje",
    base: "#FFC857",
    deep: "#8F6410",
    soft: "#FFF1CC",
    ink: "#7A5600",
    actions: [
      action("gladje", "musik", "Musik", "Lyssna på en favoritlåt", (n) =>
        n === 1 ? "lyssnat på 1 favoritlåt" : `lyssnat på ${n} favoritlåtar`,
      ),
      action("gladje", "skratt", "Skratt", "Hitta något att skratta åt", (n) => `skrattat ${times(n)}`),
      action("gladje", "dans", "Dans", "Dansa till en låt", (n) => `dansat ${times(n)}`),
      action("gladje", "lek", "Lek", "Gör något lekfullt i 5 minuter", (n) => `lekt ${times(n)}`),
      action("gladje", "njut", "Njut", "Unna dig något litet du tycker om", (n) =>
        n === 1 ? "unnat dig en liten guldstund" : `unnat dig ${n} små guldstunder`,
      ),
    ],
  },
];

export const ALL_ACTIONS: Action[] = CATEGORIES.flatMap((category) => category.actions);

export const ACTION_BY_ID: ReadonlyMap<string, Action> = new Map(
  ALL_ACTIONS.map((item) => [item.id, item]),
);

export const CATEGORY_BY_ID: Readonly<Record<CategoryId, Category>> = {
  kropp: CATEGORIES[0],
  sinne: CATEGORIES[1],
  rel: CATEGORIES[2],
  ute: CATEGORIES[3],
  gladje: CATEGORIES[4],
};

for (const item of ALL_ACTIONS) {
  if (item.label.length > 6 || /\s/.test(item.label) || item.label.includes("-")) {
    throw new Error(`Ogiltig bricketikett: ${item.label}`);
  }
}
