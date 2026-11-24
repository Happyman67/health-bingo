"use client";

import { useEffect, useRef } from "react";

type AppMenuProps = {
  open: boolean;
  confirmReset: boolean;
  demoEnabled: boolean;
  onClose: () => void;
  onToggleDemo: (enabled: boolean) => void;
  onAskReset: () => void;
  onCancelReset: () => void;
  onConfirmReset: () => void;
};

export function AppMenu({
  open,
  confirmReset,
  demoEnabled,
  onClose,
  onToggleDemo,
  onAskReset,
  onCancelReset,
  onConfirmReset,
}: AppMenuProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  const onCancelRef = useRef(onCancelReset);

  useEffect(() => {
    onCloseRef.current = onClose;
    onCancelRef.current = onCancelReset;
  }, [onClose, onCancelReset]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    (confirmReset ? cancelRef : closeRef).current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (confirmReset) onCancelRef.current();
      else onCloseRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, confirmReset]);

  if (!open) return null;

  return (
    <>
    <div className="menu-layer">
      <button type="button" className="menu-backdrop" aria-label="Stäng menyn" onClick={onClose} />
      <div
        className="menu-card"
        role="dialog"
        aria-modal={confirmReset ? undefined : true}
        aria-labelledby="menu-title"
        id="app-menu"
        data-testid="app-menu"
      >
        <div className="menu-head">
          <h2 id="menu-title">Meny</h2>
          <button type="button" className="text-button" ref={closeRef} onClick={onClose}>
            Stäng
          </button>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={demoEnabled}
          className="switch"
          data-testid="demo-toggle"
          onClick={() => onToggleDemo(!demoEnabled)}
        >
          <span className="switch-copy">
            <span className="switch-name">Demoläge</span>
            <span className="switch-help">Prova brickan med en låtsasdag. Riktiga dagar rörs inte.</span>
          </span>
          <span className={`switch-track${demoEnabled ? " on" : ""}`} aria-hidden="true">
            <span className="switch-knob" />
          </span>
        </button>

        <div className="reset-block">
          <button type="button" className="danger" data-testid="reset-button" onClick={onAskReset}>
            Börja om
          </button>
          <p className="hint">Tar bort alla sparade dagar på den här telefonen.</p>
        </div>
      </div>
    </div>

      {confirmReset ? (
        <div className="confirm-layer">
          <button type="button" className="menu-backdrop" aria-label="Avbryt" onClick={onCancelReset} />
          <div
            className="menu-card confirm-card"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="reset-title"
            aria-describedby="reset-text"
            data-testid="reset-dialog"
          >
            <h2 id="reset-title">Börja om?</h2>
            <p id="reset-text">
              Alla sparade dagar tas bort från den här telefonen, även demoläget. Det går inte att ångra.
            </p>
            <div className="confirm-actions">
              <button type="button" className="text-button" ref={cancelRef} onClick={onCancelReset}>
                Avbryt
              </button>
              <button type="button" className="danger" data-testid="confirm-reset" onClick={onConfirmReset}>
                Ja, börja om
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
