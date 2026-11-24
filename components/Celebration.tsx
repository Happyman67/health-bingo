import type { Action } from "@/lib/actions";

const LETTERS = [
  { char: "B", color: "#C24B22" },
  { char: "I", color: "#6D4CC4" },
  { char: "N", color: "#D24E86" },
  { char: "G", color: "#2E8B4E" },
  { char: "O", color: "#8F6410" },
];

type CelebrationProps = {
  tasks: Action[];
  onShowBoard: () => void;
};

export function Celebration({ tasks, onShowBoard }: CelebrationProps) {
  return (
    <section className="celebration" aria-labelledby="bingo-title" data-testid="bingo">
      <div className="confetti" aria-hidden="true">
        {LETTERS.concat(LETTERS, LETTERS).map((letter, index) => (
          <span key={`${letter.char}-${index}`} style={{ background: letter.color }} />
        ))}
      </div>
      <p className="letters" aria-hidden="true">
        {LETTERS.map((letter) => (
          <span key={letter.char} style={{ color: letter.color }}>
            {letter.char}
          </span>
        ))}
      </p>
      <h2 id="bingo-title">BINGO – Du klarade dagens fem.</h2>
      <ul className="cele-list">
        {tasks.map((task) => (
          <li key={task.id}>{task.text}</li>
        ))}
      </ul>
      <button type="button" className="primary" onClick={onShowBoard}>
        Visa brickan
      </button>
    </section>
  );
}
