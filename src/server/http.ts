import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

/** Thrown by services when an entity is missing. Mapped to HTTP 404. */
export class NotFoundError extends Error {
  constructor(message = "לא נמצא") {
    super(message);
    this.name = "NotFoundError";
  }
}

/** Thrown when an action conflicts with current state. Mapped to HTTP 409. */
export class ConflictError extends Error {
  constructor(message = "פעולה לא אפשרית") {
    super(message);
    this.name = "ConflictError";
  }
}

function json(status: number, message: string, details?: unknown) {
  return Response.json({ ok: false, error: { message, details } }, { status });
}

/**
 * Wraps a route handler body. The callback returns the `data` payload;
 * every known error type is mapped to a consistent JSON error response.
 */
export async function handle(
  fn: () => Promise<unknown>,
  successStatus = 200,
): Promise<Response> {
  try {
    const data = await fn();
    return Response.json({ ok: true, data }, { status: successStatus });
  } catch (e) {
    if (e instanceof ZodError) {
      return json(400, "ולידציה נכשלה", e.issues);
    }
    if (e instanceof NotFoundError) {
      return json(404, e.message);
    }
    if (e instanceof ConflictError) {
      return json(409, e.message);
    }
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") return json(404, "המשאב לא נמצא");
      if (e.code === "P2003") return json(409, "הפרת קשר בין טבלאות");
      if (e.code === "P2002") return json(409, "ערך כפול");
    }
    console.error(e);
    return json(500, "שגיאת שרת פנימית");
  }
}
