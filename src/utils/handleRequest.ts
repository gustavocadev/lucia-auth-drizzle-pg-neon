import type {
  RequestEventAction,
  RequestEventLoader,
} from "@builder.io/qwik-city";
import type { Session } from "lucia";
import { lucia } from "~/lib/lucia";

export const handleRequest = (
  event: RequestEventLoader | RequestEventAction,
) => {
  const sessionId = event.cookie.get(lucia.sessionCookieName);

  const validateUser = async () => {
    const sessionIdValue = sessionId?.value;

    if (!sessionIdValue) {
      return { user: null, session: null };
    }

    const { session, user } = await lucia.validateSession(sessionIdValue);

    if (session && session.fresh) {
      const sessionCookie = lucia.createSessionCookie(session.id);
      event.cookie.set(sessionCookie.name, sessionCookie.value, {
        path: ".",
        ...sessionCookie.attributes,
      });
    }
    if (!session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      event.cookie.set(sessionCookie.name, sessionCookie.value, {
        path: ".",
        ...sessionCookie.attributes,
      });
    }

    return {
      user,
      session,
    };
  };

  const setSession = (session: Session) => {
    const sessionCookie = lucia.createSessionCookie(session.id);
    event.cookie.set(sessionCookie.name, sessionCookie.value, {
      path: ".",
      ...sessionCookie.attributes,
    });
  };

  const logout = async (event: RequestEventAction) => {
    const sessionCookie = lucia.createBlankSessionCookie();

    event.cookie.set(sessionCookie.name, sessionCookie.value, {
      path: ".",
      ...sessionCookie.attributes,
    });
  };

  return {
    validateUser,
    setSession,
    logout,
  };
};
