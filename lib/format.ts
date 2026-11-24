export function formatNumber(value: number): string {
  return new Intl.NumberFormat("sv-SE").format(value);
}

export function duration(minutes: number): string {
  if (minutes < 60) {
    return minutes === 1 ? "1 minut" : `${formatNumber(minutes)} minuter`;
  }
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  const hourText = hours === 1 ? "1 timme" : `${formatNumber(hours)} timmar`;
  if (rest === 0) return hourText;
  const minuteText = rest === 1 ? "1 minut" : `${formatNumber(rest)} minuter`;
  return `${hourText} och ${minuteText}`;
}

export function times(count: number): string {
  return count === 1 ? "1 gång" : `${formatNumber(count)} gånger`;
}

export function joinPhrases(phrases: string[]): string {
  if (phrases.length === 0) return "I år har du inte bockat av något än.";
  if (phrases.length === 1) return `I år har du ${phrases[0]}.`;
  if (phrases.length === 2) {
    return `I år har du ${phrases[0]} och ${phrases[1]}.`;
  }
  return `I år har du ${phrases[0]}, ${phrases[1]} och ${phrases[2]}.`;
}
