import { NextFunction, Request, Response } from "express";
import { ROOM_CODE_REGEX, PIN_REGEX } from "../config/constants.ts";

const validateEventAccess = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const roomCodeValue = req.body.roomCode;
  const pinValue = req.body.pin;

  if (typeof roomCodeValue !== "string") {
    res.status(400).json({
      message: "Room code is required.",
    });
    return;
  }

  const roomCode = roomCodeValue.trim().toUpperCase();

  if (!ROOM_CODE_REGEX.test(roomCode)) {
    res.status(400).json({
      message: "Room code must contain exactly 8 letters or digits.",
    });
    return;
  }

  if (typeof pinValue !== "undefined" && typeof pinValue !== "string") {
    res.status(400).json({
      message: "PIN must be a string.",
    });
    return;
  }

  if (
    typeof pinValue === "string" &&
    pinValue.length > 0 &&
    !PIN_REGEX.test(pinValue)
  ) {
    res.status(400).json({
      message: "PIN must contain 4 to 8 digits.",
    });
    return;
  }

  req.body.roomCode = roomCode;
  next();
};

export { validateEventAccess };
