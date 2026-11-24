import { Mark } from "@/components/Mark";

export function AppFallback() {
  return (
    <main className="app">
      <header className="top">
        <div className="title-row">
          <Mark />
          <h1>Health Bingo</h1>
        </div>
        <p className="loading">Laddar brickan…</p>
      </header>
    </main>
  );
}
