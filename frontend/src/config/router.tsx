import {
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
  notFound,
} from "@tanstack/react-router";
import EventPage from "../pages/event/event-page.tsx";
import HomePage from "../pages/home/home-page.tsx";
import RoomPage from "../pages/room/room-page.tsx";
import NotFoundPage from "../pages/not-found-page";
import {
  fetchCurrentEvent,
  isRoomCodeFormatValid,
} from "../utils/event-utils.ts";

function RootLayout() {
  return <Outlet />;
}

const rootRoute = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFoundPage,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

// room route is used as a middleware route where we enter the pin, then redirect to event page.
const roomRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/room/$roomCode",
  beforeLoad: async ({ params }) => {
    if (!isRoomCodeFormatValid(params.roomCode)) {
      throw notFound();
    }
  },
  component: RoomPage,
});

const eventRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/event",
  beforeLoad: async () => {
    try {
      await fetchCurrentEvent();
    } catch {
      throw notFound();
    }
  },
  component: EventPage,
});

const routeTree = rootRoute.addChildren([homeRoute, roomRoute, eventRoute]);

export const router = createRouter({ routeTree });
