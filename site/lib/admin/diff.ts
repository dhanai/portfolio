export function stableJson(value: unknown): string {
  return JSON.stringify(value);
}

export function isSameJson(a: unknown, b: unknown): boolean {
  return stableJson(a) === stableJson(b);
}
