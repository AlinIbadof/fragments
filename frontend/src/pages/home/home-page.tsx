import "./home-page.css";

import { Link } from "@tanstack/react-router";
import { Camera } from "react-bootstrap-icons";

function HomePage() {
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
              <span>Have an event code?</span>
              <Link to="/event/$eventCode" params={{ eventCode: "ABCD1234" }}>
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
