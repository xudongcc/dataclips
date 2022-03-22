import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import jwt, { JwtPayload } from "jsonwebtoken";

export default NextAuth({
  pages: {
    signIn: "/login",
  },
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  jwt: {
    secret: process.env.JWT_SECRET || "secret",
    async encode({ secret, token }) {
      return jwt.sign(token, secret);
    },
    async decode({ secret, token }) {
      return jwt.verify(token, secret) as JwtPayload;
    },
  },
  cookies: {
    sessionToken: {
      name: `session_token`,
      options: {
        path: "/",
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      },
    },
    callbackUrl: {
      name: `callback_url`,
      options: {
        path: "/",
        httpOnly: false,
        secure: false,
        sameSite: "lax",
      },
    },
    csrfToken: {
      name: `csrf_token`,
      options: {
        path: "/",
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      },
    },
  },
  callbacks: {
    signIn: async ({ user, account }) => {
      switch (account.provider) {
        case "github":
          const response = await fetch("https://api.github.com/user/emails", {
            headers: {
              Authorization: `token ${account.access_token}`,
            },
          });

          const emails = await response.json();

          user.email = emails?.find(
            (item: any) => item.primary && item.verified
          )?.email;

          if (!user.email) {
            return false;
          }

          break;
        default:
      }

      return true;
    },
  },
});
