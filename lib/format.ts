import { BILLION, MILLION, ONE, THOUSAND, TRILLION } from "./constants";

export function jsonify(value: unknown): string {
  const indent = 2;
  return JSON.stringify(value, null, indent);
}

function formatToPrecision(value: number, precision = 2): number {
  return Number(
    `${Math.round(Number.parseFloat(`${value}e${precision}`))}e-${precision}`,
  );
}

export function formatToHumanNumber(value: number): string {
  let suffix = "";
  let quantity: number = value;
  if (value / TRILLION > ONE) {
    suffix = "T";
    quantity = formatToPrecision(value / TRILLION);
  } else if (value / BILLION > ONE) {
    suffix = "B";
    quantity = formatToPrecision(value / BILLION);
  } else if (value / MILLION > ONE) {
    suffix = "M";
    quantity = formatToPrecision(value / MILLION);
  } else if (value / THOUSAND > ONE) {
    suffix = "k";
    quantity = formatToPrecision(value / THOUSAND);
  }

  return `${quantity}${suffix}`;
}
