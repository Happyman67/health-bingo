import { CATEGORIES, CATEGORY_BY_ID, type Action } from "@/lib/actions";
import { formatNumber } from "@/lib/format";
import type { CSSProperties } from "react";

type BingoGridProps = {
  rows: Action[][];
  variant: "today" | "year";
  counts: Map<string, number>;
  doneIds?: ReadonlySet<string>;
  maxCount: number;
  onToggle?: (action: Action) => void;
};

function categoryStyle(action: Action): CSSProperties {
  const category = CATEGORY_BY_ID[action.categoryId];
  return {
    "--base": category.base,
    "--deep": category.deep,
    "--soft": category.soft,
    "--ink": category.ink,
    "--t": "0",
  } as CSSProperties;
}

export function BingoGrid({ rows, variant, counts, doneIds, maxCount, onToggle }: BingoGridProps) {
  const caption =
    variant === "today"
      ? "Bingobrickan. Översta raden är dagens fem."
      : "Årets bricka. Siffran är hur många gånger handlingen är gjord i år.";

  return (
    <div className={`grid ${variant === "year" ? "grid-year" : "grid-today"}`} role="group" aria-label={caption}>
      {CATEGORIES.map((category) => (
        <div
          key={category.id}
          className="col-name"
          style={
            {
              "--ink": category.ink,
              color: category.ink,
            } as CSSProperties
          }
          aria-label={category.fullName}
        >
          <span aria-hidden="true">{category.title}</span>
        </div>
      ))}
      {rows.map((row, rowIndex) =>
        row.map((action) => {
          const count = counts.get(action.id) ?? 0;
          const todayTile = variant === "today" && rowIndex === 0;
          const done = todayTile && (doneIds?.has(action.id) ?? false);
          const heat = maxCount === 0 ? 0 : count / maxCount;
          const style = {
            ...categoryStyle(action),
            "--t": heat.toFixed(3),
          } as CSSProperties;

          if (todayTile) {
            return (
              <button
                key={action.id}
                type="button"
                className={`tile today${done ? " done" : ""}`}
                style={style}
                aria-pressed={done}
                aria-label={`${action.text}${done ? ", klar" : ""}`}
                onClick={() => onToggle?.(action)}
              >
              <span className="tile-label" data-testid="tile-label">
                  {action.label}
                </span>
              <span className="tile-meta" aria-hidden="true">
                  {done ? "✓" : ""}
                </span>
              </button>
            );
          }

          return (
            <div key={action.id} className={`tile${count === 0 ? " is-zero" : ""}`} style={style}>
              <span className="tile-label" data-testid="tile-label" aria-hidden="true">
                {action.label}
              </span>
              <span className="tile-count" aria-hidden="true">
                {formatNumber(count)}
              </span>
              <span className="sr">
                {action.text}. {formatNumber(count)} gånger i år.
              </span>
            </div>
          );
        }),
      )}
    </div>
  );
}
