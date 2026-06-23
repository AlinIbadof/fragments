import {
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
  notFound,
} from "@tanstack/react-router";
import EventPage from "../pages/event/event-page.tsx";
import HomePage from "../pages/home/home-page.tsx";
import NotFoundPage from "../pages/not-found-page";
import { eventExistsByCode } from "../utils/event-utils.ts";

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

const eventRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/event/$eventCode",
  beforeLoad: async ({ params }) => {
    const isValidEventCode = /^[A-Z0-9]{8}$/.test(
      params.eventCode.toUpperCase(),
    );

    if (!isValidEventCode) {
      throw notFound();
    }

    const eventExists = await eventExistsByCode(params.eventCode);

    if (!eventExists) {
      throw notFound();
    }
  },
  component: EventPage,
});

const routeTree = rootRoute.addChildren([homeRoute, eventRoute]);

export const router = createRouter({ routeTree });