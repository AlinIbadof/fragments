import { Request, Response, NextFunction } from "express";

const PIN_REGEX = /^\d{4,8}$/;

const validateCreateEvent = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { title, pin } = req.body;

  if (typeof title !== "string" || title.trim().length < 3) {
    res.status(400).json({
      message: "Title is required and must be at least 3 characters.",
    });
    return;
  }

  if (typeof pin !== "string" || !PIN_REGEX.test(pin)) {
    res.status(400).json({
      message: "Pin must be a string containing 4 to 8 digits.",
    });
    return;
  }

  req.body.title = title.trim();

  next();
};

export { validateCreateEvent };
