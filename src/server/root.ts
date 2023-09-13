import { userRoutes } from "./routes/user-routes";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
    users: userRoutes
});

export type AppRouter = typeof appRouter;
