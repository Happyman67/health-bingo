import { BingoGrid } from "@/components/BingoGrid";
import { yearRows } from "@/lib/draw";
import { formatNumber } from "@/lib/format";
import { dotLabel, streakDaysLabel, YEAR_GOAL, type WeekDot } from "@/lib/stats";

type YearViewProps = {
  total: number;
  counts: Map<string, number>;
  sentence: string;
  streakDays: number;
  dots: WeekDot[];
};

export function YearView({ total, counts, sentence, streakDays, dots }: YearViewProps) {
  const percent = Math.min(100, (total / YEAR_GOAL) * 100);
  const maxCount = Math.max(0, ...counts.values());

  return (
    <div className="year">
      <section className="year-hero" aria-labelledby="year-heading">
        <h2 id="year-heading">I år</h2>
        <p className="hero-count">
          <strong data-testid="year-total">{formatNumber(total)}</strong>
          <span> av {formatNumber(YEAR_GOAL)}</span>
        </p>
        <div
          className="bar"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={YEAR_GOAL}
          aria-valuenow={Math.min(total, YEAR_GOAL)}
          aria-label="Hälsosamma handlingar i år"
        >
          <span style={{ width: `${percent}%` }} />
        </div>
      </section>

      <section className="panel" aria-labelledby="board-year">
        <h2 id="board-year">Årets bricka</h2>
        <BingoGrid rows={yearRows()} variant="year" counts={counts} maxCount={maxCount} />
        <p className="story">{sentence}</p>
      </section>

      <section className="panel" aria-labelledby="streak-heading">
        <h2 id="streak-heading">I rad</h2>
        <p className="streak-count" data-testid="streak-days">
          {streakDaysLabel(streakDays)}
        </p>
        <ol className="dots" aria-label="Veckans dagar">
          {dots.map((dot) => (
            <li key={dot.iso} data-status={dot.status}>
              <span className={`dot status-${dot.status}`} aria-hidden="true" />
              <span className="dot-letter" aria-hidden="true">
                {dot.letter}
              </span>
              <span className="sr">
                {dot.name}, {dotLabel(dot.status)}
              </span>
            </li>
          ))}
        </ol>
        <p className="note">En vilodag per vecka bryter inte kedjan.</p>
      </section>
    </div>
  );
}
