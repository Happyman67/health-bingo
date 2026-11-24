import { CATEGORIES } from "@/lib/actions";

export function Mark() {
  return (
    <span className="mark" aria-hidden="true">
      {CATEGORIES.map((category) => (
        <span key={category.id} style={{ background: category.base }} />
      ))}
    </span>
  );
}
