import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";

export function* range(start: number, end: number) {
  const dir = Math.sign(end - start);
  for (let i = start; i < end; i += dir) yield i;
}

const alphabet62 =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
export const toBase62 = (data: number | string) => {
  const base = alphabet62.length;
  let encoded = "";

  data = Number(
    `0x${data
      .toString()
      .split("")
      .map((c) => c.charCodeAt(0).toString(16))
      .join("")}`
  );

  while (Math.floor(data) > 0) {
    const r = ~~(data % base);
    data /= base;
    encoded = alphabet62[r] + encoded;
  }

  return encoded;
};

export function verifyFBQError(
  error: unknown
): error is FetchBaseQueryError & {
  error?: string;
  data: { message: string };
} {
  return (
    typeof error == "object" &&
    error != null &&
    "status" in error &&
    ("error" in error || "data" in error)
  );
}

export function verifyError(error: unknown): error is Error {
  return typeof error == "object" && error != null && "message" in error;
}
