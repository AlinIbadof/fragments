import { NextFunction, Request, Response } from "express";

import AccessSession from "../models/access-session.ts";
import {
  ACCESS_SESSION_COOKIE_NAME,
  ACCESS_SESSION_MAX_AGE_MS,
} from "../config/constants.ts";

const clearAccessSessionCookie = (res: Response): void => {
  res.clearCookie(ACCESS_SESSION_COOKIE_NAME, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
};

const requireEventAccess = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const sessionToken = req.cookies[ACCESS_SESSION_COOKIE_NAME];

  if (typeof sessionToken !== "string" || sessionToken.length === 0) {
    res.status(401).json({
      message: "Event access session is required.",
    });
    return;
  }

  const accessSession = await AccessSession.findOne({ sessionToken });

  if (!accessSession) {
    clearAccessSessionCookie(res);
    res.status(401).json({
      message: "Event access session is invalid.",
    });
    return;
  }

  const sessionAge = Date.now() - accessSession.createdAt.getTime();

  if (sessionAge > ACCESS_SESSION_MAX_AGE_MS) {
    clearAccessSessionCookie(res);
    res.status(401).json({
      message: "Event access session has expired.",
    });
    return;
  }

  res.locals.eventAccessSession = accessSession;
  next();
};

export { requireEventAccess };
