import { callRoutes } from "./routes/call-routes";
import { integrationRoutes } from "./routes/integration-routes";
import { notificationRoutes } from "./routes/notification-routes";
import { userRoutes } from "./routes/user-routes";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
    users: userRoutes,
    calls: callRoutes,
    notifications: notificationRoutes,
    integrations: integrationRoutes
});

export type AppRouter = typeof appRouter;
