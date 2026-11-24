"use client";

import { AppMenu } from "@/components/AppMenu";
import { BingoGrid } from "@/components/BingoGrid";
import { Celebration } from "@/components/Celebration";
import { DemoBar } from "@/components/DemoBar";
import { Mark } from "@/components/Mark";
import { TaskList } from "@/components/TaskList";
import { YearView } from "@/components/YearView";
import type { Action, CategoryId } from "@/lib/actions";
import { addDays, formatISODate, swedishDateLabel } from "@/lib/dates";
import { fillDemoYear } from "@/lib/demo";
import { boardRows, dailyActions } from "@/lib/draw";
import { formatNumber } from "@/lib/format";
import {
  clearAppStorage,
  EMPTY_STORE,
  loadStore,
  saveStore,
  setDemoEnabled,
  shiftDemoOffset,
  swapSuggestion,
  toggleDone,
  type Store,
} from "@/lib/storage";
import {
  completedIds,
  isBingo,
  streakSummary,
  YEAR_GOAL,
  yearCounts,
  yearSentence,
  yearTotal,
} from "@/lib/stats";
import { use, useEffect, useState } from "react";
import { browser } from "react-dom";

type View = "today" | "year";

export default function HealthBingo() {
  use(browser("Health Bingo sparar dagen lokalt på enheten."));

  const [realToday, setRealToday] = useState(() => new Date());
  const [store, setStore] = useState<Store>(() => loadStore());
  const [view, setView] = useState<View>("today");
  const [dismissedOn, setDismissedOn] = useState<string | null>(null);
  const [saveError, setSaveError] = useState(false);
  const [online, setOnline] = useState(() => navigator.onLine);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    const refresh = () => {
      setRealToday((current) => {
        const next = new Date();
        return formatISODate(current) === formatISODate(next) ? current : next;
      });
      setOnline(navigator.onLine);
    };
    const id = window.setInterval(refresh, 60_000);
    document.addEventListener("visibilitychange", refresh);
    window.addEventListener("online", refresh);
    window.addEventListener("offline", refresh);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", refresh);
      window.removeEventListener("online", refresh);
      window.removeEventListener("offline", refresh);
    };
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);

  const demoOn = store.demo.enabled;
  const today = demoOn ? addDays(realToday, store.demo.offset) : realToday;
  const activeStore: Store = demoOn ? { ...store, days: store.demoDays } : store;
  const todayIso = formatISODate(today);
  const day = activeStore.days[todayIso];
  const tasks = dailyActions(todayIso, day?.swap);
  const doneIds = new Set(completedIds(activeStore, todayIso));
  const bingo = isBingo(activeStore, todayIso);
  const counts = yearCounts(activeStore, today.getFullYear());
  const total = yearTotal(counts);
  const streak = streakSummary(activeStore, today);
  const showCelebration = bingo && dismissedOn !== todayIso;
  const maxCount = Math.max(0, ...counts.values());

  function commit(next: Store | null) {
    if (!next) return;
    setStore(next);
    setSaveError(!saveStore(next));
  }

  function commitActive(next: Store | null) {
    if (!next) return;
    if (demoOn) commit({ ...store, demoDays: next.days });
    else commit({ ...store, days: next.days });
  }

  function toggle(action: Action) {
    const next = toggleDone(activeStore, todayIso, action.id);
    if (!next) return;
    if (!isBingo(next, todayIso)) setDismissedOn(null);
    commitActive(next);
  }

  function swap(categoryId: CategoryId) {
    commitActive(swapSuggestion(activeStore, todayIso, categoryId));
  }

  function toggleDemo(enabled: boolean) {
    commit(setDemoEnabled(store, enabled));
    setDismissedOn(null);
  }

  function shiftDay(delta: number) {
    commit(shiftDemoOffset(store, delta));
    setDismissedOn(null);
    setView("today");
  }

  function completeToday() {
    let next = activeStore;
    for (const task of dailyActions(todayIso, next.days[todayIso]?.swap)) {
      if (next.days[todayIso]?.done.includes(task.id)) continue;
      next = toggleDone(next, todayIso, task.id) ?? next;
    }
    commitActive(next);
    setDismissedOn(null);
    setView("today");
  }

  function fillYear() {
    commit(fillDemoYear(store, today));
    setDismissedOn(null);
    setView("year");
    setMenuOpen(false);
  }

  function resetAll() {
    clearAppStorage();
    setStore(EMPTY_STORE);
    setDismissedOn(null);
    setView("today");
    setSaveError(false);
    setConfirmReset(false);
    setMenuOpen(false);
  }

  return (
    <main className="app">
      <header className="top">
        <div className="title-row">
          <Mark />
          <h1>Health Bingo</h1>
          <button
            type="button"
            className="menu-button"
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            aria-controls="app-menu"
            data-testid="menu-button"
            onClick={() => {
              setConfirmReset(false);
              setMenuOpen(true);
            }}
          >
            Meny
          </button>
        </div>
        <p className="date">
          {swedishDateLabel(today)}
          {demoOn ? <span className="pretend">Låtsasdag</span> : null}
        </p>
        {view === "today" ? (
          <p className="year-chip">
            <strong>{formatNumber(total)}</strong>
            <span> av {formatNumber(YEAR_GOAL)} i år</span>
          </p>
        ) : null}
        <div className="tabs" role="tablist" aria-label="Vy">
          <button
            type="button"
            role="tab"
            id="tab-today"
            aria-selected={view === "today"}
            aria-controls="panel"
            className="tab"
            onClick={() => setView("today")}
          >
            Idag
          </button>
          <button
            type="button"
            role="tab"
            id="tab-year"
            aria-selected={view === "year"}
            aria-controls="panel"
            className="tab"
            onClick={() => setView("year")}
          >
            Året
          </button>
        </div>
      </header>

      {!online ? (
        <p className="banner" role="status">
          Du är offline. Dagens bricka finns kvar på telefonen.
        </p>
      ) : null}
      {saveError ? (
        <p className="banner warn" role="status">
          Kunde inte spara på den här telefonen.
        </p>
      ) : null}
      {demoOn ? (
        <DemoBar
          onPrevious={() => shiftDay(-1)}
          onNext={() => shiftDay(1)}
          onComplete={completeToday}
          onFillYear={fillYear}
        />
      ) : null}

      <p className="sr" role="status">
        {bingo ? "BINGO. Du klarade dagens fem." : `${doneIds.size} av 5 klara idag.`}
      </p>
      <div
        className="panel-wrap"
        id="panel"
        role="tabpanel"
        aria-labelledby={view === "today" ? "tab-today" : "tab-year"}
      >
        {view === "year" ? (
          <YearView
            total={total}
            counts={counts}
            sentence={yearSentence(counts)}
            streakDays={streak.days}
            dots={streak.dots}
          />
        ) : showCelebration ? (
          <Celebration tasks={tasks} onShowBoard={() => setDismissedOn(todayIso)} />
        ) : (
          <>
            {bingo ? <p className="bingo-banner">BINGO – Du klarade dagens fem.</p> : null}
            <section className="panel" aria-labelledby="brickan">
              <h2 id="brickan" className="sr">
                Bingobrickan
              </h2>
              <BingoGrid
                rows={boardRows(todayIso, day?.swap)}
                variant="today"
                counts={counts}
                doneIds={doneIds}
                maxCount={maxCount}
                onToggle={toggle}
              />
              <p className="caption">Översta raden är dagens fem.</p>
            </section>
            <TaskList
              tasks={tasks}
              doneIds={doneIds}
              swappedCategory={day?.swap?.categoryId ?? null}
              onToggle={toggle}
              onSwap={swap}
            />
          </>
        )}
      </div>

      <p className="footnote">Sparas bara på den här telefonen. Ingen inloggning.</p>
      <AppMenu
        open={menuOpen}
        confirmReset={confirmReset}
        demoEnabled={demoOn}
        onClose={() => {
          setMenuOpen(false);
          setConfirmReset(false);
        }}
        onToggleDemo={toggleDemo}
        onAskReset={() => setConfirmReset(true)}
        onCancelReset={() => setConfirmReset(false)}
        onConfirmReset={resetAll}
      />
    </main>
  );
}
