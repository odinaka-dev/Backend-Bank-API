import type { Request } from "express";

export const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

export const moneyIsValid = (value: unknown): value is number =>
  Number.isSafeInteger(value) && (value as number) > 0;

export const isTenDigitAccountNumber = (value: unknown): boolean =>
  /^\d{10}$/.test(String(value ?? ""));

export const maskAccountNumber = (accountNumber: string) =>
  `******${accountNumber.slice(-4)}`;

export const nowIso = () => new Date().toISOString();

/** Reads the `X-Mock-Scenario` header used to trigger simulated behaviours. */
export const getScenario = (req: Request): string | undefined =>
  req.get("X-Mock-Scenario");

/** Normalises an Express query value to a single string. */
export const queryString = (value: unknown): string =>
  typeof value === "string" ? value : "";

export const parseDate = (value: unknown): Date | undefined => {
  const raw = queryString(value);
  if (!raw) return undefined;
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

export const includesValue = <T extends string>(
  values: readonly T[],
  value: unknown,
): value is T => values.includes(value as T);
