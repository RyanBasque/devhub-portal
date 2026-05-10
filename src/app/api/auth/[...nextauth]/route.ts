import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { pool } from "@/utils/db";

export const authOptions: any = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
  ],
  pages: {
    signIn: "/",
    error: "/",
  },
  callbacks: {
    async signIn({ user, account, profile }: any) {
      if (account?.provider === "github" && user.email) {
        try {
          const checkResult = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [user.email]
          );

          if (checkResult.rows.length === 0) {
            await pool.query(
              `INSERT INTO users (email, name, avatar_url, github_username, provider)
               VALUES ($1, $2, $3, $4, $5)`,
              [
                user.email,
                user.name || profile?.name || "",
                user.image || profile?.avatar_url || "",
                profile?.login || "",
                "github",
              ]
            );
          } else {
            await pool.query(
              `UPDATE users 
               SET name = $1, avatar_url = $2, github_username = $3, updated_at = NOW()
               WHERE email = $4`,
              [
                user.name || profile?.name || checkResult.rows[0].name,
                user.image || profile?.avatar_url || checkResult.rows[0].avatar_url,
                profile?.login || checkResult.rows[0].github_username,
                user.email,
              ]
            );
          }
        } catch (error) {
          console.error("[NextAuth] Error saving user to PostgreSQL:", error);
        }
      }
      return true;
    },
    async jwt({ token, account, profile }: any) {
      if (account) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
      }
      if (profile) {
        token.github = profile.login || profile.html_url?.split("/").pop() || "";
      }
      return token;
    },
    async session({ session, token }: any) {
      session.accessToken = token.accessToken;
      session.github = token.github;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
