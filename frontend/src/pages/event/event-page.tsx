import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { fetchCurrentEvent } from "../../utils/event-utils.ts";

function EventPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const loadEvent = async (): Promise<void> => {
      try {
        const currentEvent = await fetchCurrentEvent();

        if (!isActive) {
          return;
        }

        setTitle(currentEvent.title);
      } catch {
        if (isActive) {
          void navigate({
            to: "/",
            replace: true,
          });
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void loadEvent();

    return () => {
      isActive = false;
    };
  }, [navigate]);

  if (isLoading) {
    return (
      <main>
        <h1>Loading event...</h1>
      </main>
    );
  }

  return (
    <main>
      <h1>{title}</h1>
      <p>Event access is active.</p>
      <Link to="/">Back to home</Link>
    </main>
  );
}

export default EventPage;
