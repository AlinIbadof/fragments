import { randomUUID } from "crypto";

import { Request, Response } from "express";
import bcrypt from "bcrypt";

import AccessSession from "../models/access-session.ts";
import Event from "../models/event.ts";
import { generateEventCode } from "../utils/index.ts";
import {
  ACCESS_SESSION_COOKIE_NAME,
  ACCESS_SESSION_MAX_AGE_MS,
  MAX_ROOM_CODE_ATTEMPTS,
  ROOM_CODE_REGEX,
  PIN_REGEX,
} from "../config/constants.ts";

const normalizeRoomCode = (roomCode: string): string => {
  return roomCode.trim().toUpperCase();
};

const findActiveEventByRoomCode = async (roomCode: string) => {
  return Event.findOne({
    roomCode,
    isActive: true,
    expiresAt: { $gt: new Date() },
  });
};

const setAccessSessionCookie = (res: Response, sessionToken: string): void => {
  res.cookie(ACCESS_SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: ACCESS_SESSION_MAX_AGE_MS,
  });
};

const isDuplicateKeyError = (error: unknown): boolean => {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: number }).code === 11000
  );
};

const getUniqueRoomCode = async (): Promise<string> => {
  for (let attempt = 0; attempt < MAX_ROOM_CODE_ATTEMPTS; attempt++) {
    const roomCode = generateEventCode();
    const existingEvent = await Event.exists({ roomCode });

    if (!existingEvent) {
      return roomCode;
    }
  }

  throw new Error("Unable to generate a unique room code. Try again.");
};

const createEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, pin } = req.body;

    const pinHash = await bcrypt.hash(pin, 10);

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    let event = null;

    for (let attempt = 0; attempt < MAX_ROOM_CODE_ATTEMPTS; attempt++) {
      const roomCode = await getUniqueRoomCode();

      try {
        event = await Event.create({
          title,
          roomCode,
          pinHash,
          expiresAt,
          isActive: true,
        });
        break;
      } catch (error) {
        if (!isDuplicateKeyError(error)) {
          throw error;
        }
      }
    }

    if (!event) {
      throw new Error("Could not create event with a unique room code.");
    }

    res.status(201).json({
      id: event._id,
      roomCode: event.roomCode,
      title: event.title,
      expiresAt: event.expiresAt,
    });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const accessEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const roomCode = normalizeRoomCode(req.body.roomCode as string);
    const pin = req.body.pin;

    if (!ROOM_CODE_REGEX.test(roomCode)) {
      res.status(400).json({
        message: "Room code must contain exactly 8 letters or digits.",
      });
      return;
    }

    const event = await findActiveEventByRoomCode(roomCode);

    if (!event) {
      res.status(404).json({
        message: "Room code not found.",
      });
      return;
    }

    if (typeof pin !== "string" || pin.length === 0) {
      res.status(200).json({
        roomCode: event.roomCode,
        title: event.title,
        requiresPin: true,
      });
      return;
    }

    if (!PIN_REGEX.test(pin)) {
      res.status(400).json({
        message: "PIN must contain 4 to 8 digits.",
      });
      return;
    }

    const isPinValid = await bcrypt.compare(pin, event.pinHash);

    if (!isPinValid) {
      res.status(401).json({
        message: "Invalid PIN.",
      });
      return;
    }

    const sessionToken = randomUUID();

    await AccessSession.create({
      roomCode: event.roomCode,
      sessionToken,
    });

    setAccessSessionCookie(res, sessionToken);

    res.status(200).json({
      roomCode: event.roomCode,
      title: event.title,
      requiresPin: false,
    });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const getCurrentEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const accessSession = res.locals.eventAccessSession as
      | { roomCode: string }
      | undefined;

    if (!accessSession) {
      res.status(500).json({
        message: "Access session is missing.",
      });
      return;
    }

    const event = await findActiveEventByRoomCode(accessSession.roomCode);

    if (!event) {
      res.status(404).json({
        message: "Event not found.",
      });
      return;
    }

    res.status(200).json({
      roomCode: event.roomCode,
      title: event.title,
    });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export { accessEvent, createEvent, getCurrentEvent };
