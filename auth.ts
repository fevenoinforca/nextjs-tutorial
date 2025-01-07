import NextAuth from "next-auth"
import Resend from "next-auth/providers/resend"
import PostgresAdapter from "@auth/pg-adapter"
import { Pool } from "@neondatabase/serverless"
 
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
  }
})
