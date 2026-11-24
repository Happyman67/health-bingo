type DemoBarProps = {
  onPrevious: () => void;
  onNext: () => void;
  onComplete: () => void;
  onFillYear: () => void;
};

export function DemoBar({ onPrevious, onNext, onComplete, onFillYear }: DemoBarProps) {
  return (
    <section className="demo-bar" aria-label="Demoläge" data-testid="demo-banner">
      <p className="demo-flag">Demoläge</p>
      <p className="demo-copy">
        Låtsasdag. Riktiga dagar rörs inte och tas bort tillsammans med demoläget när du börjar om.
      </p>
      <div className="demo-actions">
        <button type="button" data-testid="demo-prev" onClick={onPrevious}>
          Föregående dag
        </button>
        <button type="button" data-testid="demo-next" onClick={onNext}>
          Nästa dag
        </button>
        <button type="button" data-testid="demo-complete" onClick={onComplete}>
          Klara dagens fem
        </button>
        <button type="button" data-testid="demo-fill" onClick={onFillYear}>
          Fyll året
        </button>
      </div>
    </section>
  );
}
