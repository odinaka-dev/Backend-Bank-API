export const config = {
  port: Number(process.env.PORT) || 4000,
  host: "0.0.0.0",
  allowedOrigin: process.env.ALLOWED_ORIGIN || "*",
  jsonBodyLimit: "100kb",
} as const;

/** Simulated latencies (ms) used by the mock endpoints. */
export const latency = {
  slow: 2500,
  resolveAccount: 500,
  transfer: 700,
  transferTimeout: 8000,
} as const;

/** Business rules for simulated transfers (amounts in kobo). */
export const transferRules = {
  maxAmountMinor: 100_000_000,
  highValueThresholdMinor: 10_000_000,
  standardFeeMinor: 2500,
  highValueFeeMinor: 5000,
  narrationMaxLength: 120,
  defaultNarration: "Personal transfer",
} as const;
