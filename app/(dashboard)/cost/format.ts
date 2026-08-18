export function formatETBMillions(value: number): string {
  const millions = value / 1_000_000;
  const rounded = Math.round(millions * 10) / 10;
  return `ETB ${rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(1)}M`;
}

export function formatShortMillions(value: number): string {
  const millions = value / 1_000_000;
  const rounded = Math.round(millions * 10) / 10;
  return `${rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(1)}M`;
}
