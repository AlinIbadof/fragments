import Event from "../models/event.ts";

const DEFAULT_SYNC_INTERVAL_MS = 60_000;

const markExpiredEventsInactive = async (): Promise<void> => {
  const now = new Date();

  const result = await Event.updateMany(
    {
      isActive: true,
      expiresAt: { $lte: now },
    },
    {
      $set: { isActive: false },
    },
  );

  if (result.modifiedCount > 0) {
    console.log(`Marked ${result.modifiedCount} expired events as inactive.`);
  }
};

const startEventExpirySync = (): NodeJS.Timeout => {
  const intervalMs =
    Number(process.env.EVENT_EXPIRY_SYNC_MS) || DEFAULT_SYNC_INTERVAL_MS;

  void markExpiredEventsInactive().catch((error) => {
    console.error(
      "Initial event expiry sync failed:",
      (error as Error).message,
    );
  });

  const timer = setInterval(() => {
    void markExpiredEventsInactive().catch((error) => {
      console.error("Event expiry sync failed:", (error as Error).message);
    });
  }, intervalMs);

  // Do not keep Node alive only for this timer.
  timer.unref();

  return timer;
};

export { markExpiredEventsInactive, startEventExpirySync };
