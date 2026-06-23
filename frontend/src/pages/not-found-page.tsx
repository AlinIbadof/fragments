import { Link } from "@tanstack/react-router";

function NotFoundPage() {
  return (
    <main>
      <h1>Event not found</h1>
      <Link to="/">Home</Link>
    </main>
  );
}

export default NotFoundPage;
