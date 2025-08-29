import { ApiError } from "./ApiError";
import { ApiResponse } from "./ApiResponse";
import { NextResponse } from "next/server";

export const asyncHandler = (fn) => async (req, ctx) => {
  try {
    return await fn(req, ctx);
  } catch (err) {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong";

    return NextResponse.json(
      new ApiError(statusCode, message, err.errors || []),
      { status: statusCode }
    );
  }
};
