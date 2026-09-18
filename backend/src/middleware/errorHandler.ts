import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  console.error("[Error]", err);

  let status = err.status || err.statusCode;
  if (!status) {
    if (
      err.name === "MulterError" ||
      err.name === "ZodError" ||
      err.message?.includes("Unsupported file type")
    ) {
      status = 400;
    } else {
      status = 500;
    }
  }
  const message = err.message || "An unexpected error occurred";
  const code =
    err.code ||
    (status === 404
      ? "NOT_FOUND"
      : status === 400
        ? "BAD_REQUEST"
        : "SERVER_ERROR");

  res.status(status).json({
    success: false,
    data: null,
    error: {
      code,
      message,
    },
  });
}
