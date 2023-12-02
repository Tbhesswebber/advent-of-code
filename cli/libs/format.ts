export function jsonify(value: unknown): string {
  const indent = 2;
  return JSON.stringify(value, null, indent);
}
