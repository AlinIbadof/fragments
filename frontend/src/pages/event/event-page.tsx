import { Link, useParams } from "@tanstack/react-router";

function EventPage() {
  const { eventCode } = useParams({ from: "/event/$eventCode" });

  return (
    <main>
      <h1>Event {eventCode}</h1>
      <p>event code {eventCode}</p>
      <Link to="/">Back to home</Link>
    </main>
  );
}

export default EventPage;
