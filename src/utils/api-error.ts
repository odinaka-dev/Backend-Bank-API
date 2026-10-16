import type { ErrorBody } from "../types";

/** An error that maps directly to a JSON error response. */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }

  toJSON(): ErrorBody {
    return { message: this.message, code: this.code };
  }
}
