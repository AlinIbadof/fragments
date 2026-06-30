import "./home-page.css";

import { Link, useNavigate } from "@tanstack/react-router";
import { Camera } from "react-bootstrap-icons";
import React, { useState } from "react";

function HomePage() {
  const navigate = useNavigate();
  const [eventCode, setEventCode] = useState("");

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
              <input
                type="text"
                value={eventCode}
                onChange={(e) => setEventCode(e.target.value)}
                placeholder="Enter event code"
              />
              <Link
                to="/event/$eventCode"
                params={{ eventCode: eventCode }}
                className="card-button"
              >
                Open event &rarr;
              </Link>
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
