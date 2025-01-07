import NextAuth from "next-auth"
import Resend from "next-auth/providers/resend"
import PostgresAdapter from "@auth/pg-adapter"
import { Pool } from "@neondatabase/serverless"
import next from "next"
 
export const { handlers, auth, signIn, signOut } = NextAuth(() => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })

  return {
    providers: [
      Resend({
          apiKey: process.env.AUTH_RESEND_KEY,
          from: "no-reply@mail-resend-inforca.ddns-ip.net"
        }),
    ],
    adapter: PostgresAdapter(pool),
    pages: {
      signIn: '/sign-in',
    },
    callbacks: {
      authorized({ auth, request: { nextUrl } }) {
        const isLoggedIn = !!auth?.user;
        const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
        if (isOnDashboard) {
          if (isLoggedIn) return true;
          return false; // Redirect unauthenticated users to sign page
        } else if (isLoggedIn) {
          if (nextUrl.pathname.startsWith('/sign-in')) {
            const callbackUrl = nextUrl.search?.split('callbackUrl=')[1]
            if (callbackUrl.includes('dashboard')) {
                return Response.redirect(new URL("/dashboard", nextUrl)) // Redirect to dashboard if callbackUrl includes dashboard (resend email)
            }
            return true;
          }
          return true;
        }
        return true;
      },
    },
  }
})
