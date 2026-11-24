import { CATEGORY_BY_ID, type Action, type CategoryId } from "@/lib/actions";
import type { CSSProperties } from "react";

type TaskListProps = {
  tasks: Action[];
  doneIds: ReadonlySet<string>;
  swappedCategory: CategoryId | null;
  onToggle: (action: Action) => void;
  onSwap: (categoryId: CategoryId) => void;
};

export function TaskList({ tasks, doneIds, swappedCategory, onToggle, onSwap }: TaskListProps) {
  const doneCount = tasks.filter((task) => doneIds.has(task.id)).length;

  return (
    <section className="tasks" aria-labelledby="dagens-fem">
      <div className="section-head">
        <h2 id="dagens-fem">Dagens fem</h2>
        <p className="count-pill">
          {doneCount}/5
        </p>
      </div>
      <ul className="task-list">
        {tasks.map((task) => {
          const category = CATEGORY_BY_ID[task.categoryId];
          const done = doneIds.has(task.id);
          const swapped = swappedCategory === task.categoryId;
          const canSwap = !swappedCategory && !done;
          return (
            <li key={task.id}>
              <button
                type="button"
                className="task-main"
                style={{ "--deep": category.deep, "--soft": category.soft } as CSSProperties}
                role="checkbox"
                aria-checked={done}
                aria-label={`${category.fullName}: ${task.text}${done ? ", klar" : ""}`}
                onClick={() => onToggle(task)}
              >
                <span className="check" aria-hidden="true">
                  {done ? "✓" : ""}
                </span>
                <span className="task-copy">
                  <span className="task-text" data-testid="task-text">
                    {task.text}
                  </span>
                  <span className="task-cat" style={{ color: category.ink }}>
                    {category.fullName}
                  </span>
                </span>
              </button>
              <button
                type="button"
                className="swap"
                data-testid="swap"
                disabled={!canSwap}
                aria-label={canSwap ? `Byt ut ${task.text}` : swapped ? "Dagens byte är använt" : `Byt ut ${task.text}`}
                onClick={() => onSwap(task.categoryId)}
              >
                {swapped ? "Bytt" : "Byt"}
              </button>
            </li>
          );
        })}
      </ul>
      <p className="hint">
        {swappedCategory ? "Dagens byte är använt." : "Du kan byta en sak om dagen."}
      </p>
    </section>
  );
}
