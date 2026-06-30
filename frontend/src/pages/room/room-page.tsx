import "./room-page.css";

import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  normalizeRoomCode,
  submitRoomPin,
  validateRoomAccess,
} from "../../utils/event-utils.ts";

function RoomPage() {
  const navigate = useNavigate();
  const { roomCode } = useParams({ from: "/room/$roomCode" });
  const normalizedRoomCode = normalizeRoomCode(roomCode);

  const [roomTitle, setRoomTitle] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isCheckingRoom, setIsCheckingRoom] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isActive = true;

    const loadRoom = async (): Promise<void> => {
      setIsCheckingRoom(true);
      setError("");

      try {
        const response = await validateRoomAccess(normalizedRoomCode);

        if (!isActive) {
          return;
        }

        setRoomTitle(response.title);
      } catch (requestError) {
        if (!isActive) {
          return;
        }

        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to verify this room code.",
        );
      } finally {
        if (isActive) {
          setIsCheckingRoom(false);
        }
      }
    };

    void loadRoom();

    return () => {
      isActive = false;
    };
  }, [normalizedRoomCode]);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    setIsSubmitting(true);
    setError("");

    try {
      await submitRoomPin(normalizedRoomCode, pin);

      await navigate({
        to: "/event",
        replace: true,
      });
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to validate this PIN.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="room-page">
      <header className="title room-title">Room access</header>

      <section className="room-card">
        <p className="room-label">Room code</p>
        <h1>{normalizedRoomCode}</h1>

        {isCheckingRoom ? (
          <p className="room-status">Verifying room code...</p>
        ) : error ? (
          <>
            <p className="room-status room-status-error">{error}</p>
            <Link to="/" className="room-link">
              Go back
            </Link>
          </>
        ) : (
          <>
            <p className="room-status">
              Room verified{roomTitle ? ` for ${roomTitle}` : ""}. Enter the PIN
              to continue.
            </p>
            <form className="room-form" onSubmit={handleSubmit}>
              <input
                type="password"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={pin}
                onChange={(event) => setPin(event.target.value)}
                placeholder="Enter PIN"
                maxLength={8}
                disabled={isSubmitting}
                autoFocus
              />
              <button
                type="submit"
                className="room-button"
                disabled={isSubmitting || pin.length === 0}
              >
                {isSubmitting ? "Checking..." : "Unlock event"}
              </button>
            </form>
          </>
        )}
      </section>
    </main>
  );
}

export default RoomPage;
