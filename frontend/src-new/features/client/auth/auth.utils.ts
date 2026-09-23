// features/client/auth/auth.utils.ts
import { isAxiosError } from "axios";

export const AUTH_ERROR_MESSAGES = {
  ALREADY_VERIFIED: "user already exists and verified",
  NOT_VERIFIED: "user not verified",
} as const;

const getErrorMessage = (error: unknown) =>
  isAxiosError(error)
    ? String(error.response?.data?.message ?? "").toLowerCase()
    : "";

export const isAlreadyRegisteredError = (error: unknown) =>
  getErrorMessage(error).includes(AUTH_ERROR_MESSAGES.ALREADY_VERIFIED);

export const isUnverifiedUserError = (error: unknown) =>
  getErrorMessage(error).includes(AUTH_ERROR_MESSAGES.NOT_VERIFIED);