import { Request, Response } from "express";
import bcrypt from "bcrypt";

import Event from "../models/event.ts";
import { generateEventCode } from "../utils/index.ts";

const MAX_ROOM_CODE_ATTEMPTS = 10;

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

const createEvent = async (
  req: Request,
  res: Response
): Promise<void> => {
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
      message:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });
  }
};

export { createEvent };