import "./home-page.css";

import { useNavigate } from "@tanstack/react-router";
import { Camera } from "react-bootstrap-icons";
import React, { useState } from "react";
import { normalizeRoomCode } from "../../utils/event-utils.ts";

function HomePage() {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const normalizedRoomCode = normalizeRoomCode(roomCode);

    if (normalizedRoomCode.length === 0) {
      return;
    }

    void navigate({
      to: "/room/$roomCode",
      params: { roomCode: normalizedRoomCode },
    });
  };

  return (
    <div className="home-page">
      <header className="title">
        <Camera color="var(--brand-color)" />
        Fragments
      </header>{" "}
      <main className="home-layout">
        <div className="home-left">
          <div className="home-content">
            <div>
              <h1>
                Collect every moment.{" "}
                <span className="text-brand">Cherish Forever.</span>
              </h1>

              <p className="text-muted">
                Fragments makes it easy for guests to share photos from your
                event in one beautiful gallery.
              </p>
            </div>
            <div className="home-card">
              <h2 className="card-title">Join an Event</h2>
              <p className="card-description">
                Enter the room code in the input below or scan the QR code
                received from the organizer.
              </p>
              <form onSubmit={handleSubmit} className="home-form">
                <input
                  type="text"
                  value={roomCode}
                  onChange={(e) =>
                    setRoomCode(normalizeRoomCode(e.target.value))
                  }
                  placeholder="Enter room code"
                  autoComplete="off"
                  maxLength={8}
                />
                <button type="submit" className="card-button">
                  Continue &rarr;
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="home-right">
          <img
            src="/wedding-couple.jpg"
            alt="Event memories"
            className="home-photo"
          />
        </div>
      </main>
    </div>
  );
}

export default HomePage;
