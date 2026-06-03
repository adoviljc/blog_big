// lib/api-error.ts
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";


// ─── Classes d'erreur ──────────────────────────────────────────────────────

export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number,
    public readonly code: string,
    public readonly details?: Record<string, string[]>
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class ValidationError extends AppError {
  constructor(details: Record<string, string[]>) {
    super("Données invalides", 400, "VALIDATION_ERROR", details);
    this.name = "ValidationError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Non authentifié") {
    super(message, 401, "UNAUTHORIZED");
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Action non autorisée") {
    super(message, 403, "FORBIDDEN");
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends AppError {
  constructor(resource = "Ressource") {
    super(`${resource} introuvable`, 404, "NOT_FOUND");
    this.name = "NotFoundError";
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflit de données") {
    super(message, 409, "CONFLICT");
    this.name = "ConflictError";
  }
}

export class DatabaseConnectionError extends AppError {
  constructor() {
    super(
      "Impossible de se connecter à la base de données. Veuillez réessayer dans quelques instants.",
      503,
      "DATABASE_UNAVAILABLE"
    );
    this.name = "DatabaseConnectionError";
  }
}

// ─── Mapping des erreurs Prisma (erreurs de requête connues) ───────────────

const PRISMA_ERROR_MAP: Record<string, () => AppError> = {
  P2002: () => new ConflictError("Cette valeur existe déjà (doublon)"),
  P2003: () => new NotFoundError("Ressource liée"),
  P2025: () => new NotFoundError("Enregistrement"),
};

// ─── Détection d'une erreur de connexion Prisma ────────────────────────────

function isDatabaseConnectionError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;

  const name = (error as any).constructor?.name ?? "";

  // Erreurs Prisma client
  if (
    name === "PrismaClientInitializationError" ||
    name === "PrismaClientRustPanicError" ||
    name === "PrismaClientUnknownRequestError"
  ) return true;

  // Codes P1xxx — erreurs de connectivité Prisma
  const code = (error as any).code ?? "";
  if (typeof code === "string" && code.startsWith("P1")) return true;

  // Codes d'erreur MariaDB/MySQL liés à la connexion
  const errno = (error as any).errno;
  const CONNECTION_ERRORS = [
    1040, // Too many connections
    1042, // Can't get hostname
    1043, // Bad handshake
    1044, // Access denied to database
    1045, // Access denied (wrong password)
    2002, // Can't connect to server (socket)
    2003, // Can't connect to server (TCP)
    2006, // Server has gone away
    2013, // Lost connection during query
  ];
  if (typeof errno === "number" && CONNECTION_ERRORS.includes(errno)) return true;

  // Message d'erreur contenant des indicateurs de connexion
  const message = (error as any).message ?? "";
  if (
    typeof message === "string" &&
    (
      message.includes("Can't connect") ||
      message.includes("Connection refused") ||
      message.includes("ECONNREFUSED") ||
      message.includes("ETIMEDOUT") ||
      message.includes("Access denied")
    )
  ) return true;

  return false;
}

// ─── Handler centralisé ────────────────────────────────────────────────────

type RouteHandler = (
  req: NextRequest,
  context?: { params: Record<string, string> }
) => Promise<NextResponse>;

export function withErrorHandler(handler: RouteHandler): RouteHandler {
  return async (req, context) => {
    try {
      return await handler(req, context);
    } catch (error) {

      // ── 1. Erreur de connexion à la base de données ──────────────────
      if (isDatabaseConnectionError(error)) {
        console.error("[DB CONNECTION ERROR]", error);
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "DATABASE_UNAVAILABLE",
              message:
                "Impossible de se connecter à la base de données. Veuillez réessayer dans quelques instants.",
            },
          },
          {
            status: 503,
            headers: {
              // Indique au client de réessayer après 10 secondes
              "Retry-After": "10",
            },
          }
        );
      }

      // ── 2. Erreur Zod (.parse() lancé directement) ───────────────────
      if (error instanceof ZodError) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "VALIDATION_ERROR",
              message: "Données invalides",
              details: error.flatten().fieldErrors,
            },
          },
          { status: 400 }
        );
      }

      // ── 3. Erreur applicative (AppError et ses sous-classes) ─────────
      if (error instanceof AppError) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: error.code,
              message: error.message,
              ...(error.details && { details: error.details }),
            },
          },
          { status: error.statusCode }
        );
      }

      // ── 4. Erreur Prisma connue (P2xxx) ──────────────────────────────
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        typeof (error as any).code === "string"
      ) {
        const prismaCode = (error as any).code as string;
        const factory = PRISMA_ERROR_MAP[prismaCode];
        if (factory) {
          const appError = factory();
          return NextResponse.json(
            {
              success: false,
              error: {
                code: appError.code,
                message: appError.message,
              },
            },
            { status: appError.statusCode }
          );
        }
      }

      // ── 5. Erreur inconnue ────────────────────────────────────────────
      console.error("[API ERROR]", error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INTERNAL_SERVER_ERROR",
            message: "Erreur serveur",
          },
        },
        { status: 500 }
      );
    }
  };
}