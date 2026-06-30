const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

const ROOM_CODE_REGEX = /^[A-Z0-9]{8}$/;

type EventAccessResponse = {
  roomCode: string;
  title: string;
  requiresPin: boolean;
};

type CurrentEventResponse = {
  roomCode: string;
  title: string;
};

const normalizeRoomCode = (roomCode: string): string => {
  return roomCode.trim().toUpperCase();
};

const isRoomCodeFormatValid = (roomCode: string): boolean => {
  return ROOM_CODE_REGEX.test(normalizeRoomCode(roomCode));
};

const readApiResponse = async <T>(response: Response): Promise<T> => {
  const payload = (await response.json().catch(() => null)) as {
    message?: string;
  } | null;

  if (!response.ok) {
    throw new Error(payload?.message ?? "Request failed.");
  }

  return payload as T;
};

const validateRoomAccess = async (
  roomCode: string,
): Promise<EventAccessResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/events/access`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ roomCode: normalizeRoomCode(roomCode) }),
  });

  return readApiResponse<EventAccessResponse>(response);
};

const submitRoomPin = async (
  roomCode: string,
  pin: string,
): Promise<EventAccessResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/events/access`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ roomCode: normalizeRoomCode(roomCode), pin }),
  });

  return readApiResponse<EventAccessResponse>(response);
};

const fetchCurrentEvent = async (): Promise<CurrentEventResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/events/current`, {
    method: "GET",
    credentials: "include",
  });

  return readApiResponse<CurrentEventResponse>(response);
};

export {
  fetchCurrentEvent,
  isRoomCodeFormatValid,
  normalizeRoomCode,
  submitRoomPin,
  validateRoomAccess,
};
