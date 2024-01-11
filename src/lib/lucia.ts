import { pg } from "@lucia-auth/adapter-postgresql";
import { lucia } from "lucia"
import { qwik } from "lucia/middleware"
import { pool } from "~/lib/db";

export const auth = lucia({
  adapter: pg(pool, {
    user: 'auth_user',
    key: 'user_key',
    session: 'user_session',
  }),
  env: process.env.NODE_ENV === "production" ? "PROD" : "DEV",
  middleware: qwik(),
  getUserAttributes: (user) => ({
    userId: user.id,
    username: user.username,
    names: user.names,
    last_names: user.last_names
  })
});

export type Auth = typeof auth;