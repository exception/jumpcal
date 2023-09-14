import { callRoutes } from "./routes/call-routes";
import { userRoutes } from "./routes/user-routes";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
    users: userRoutes,
    calls: callRoutes
});

export type AppRouter = typeof appRouter;
