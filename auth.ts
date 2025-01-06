// auth.ts for magic-link authentication

import NextAuth from "next-auth"
import Resend from "next-auth/providers/resend"
import PostgresAdapter from "@auth/pg-adapter"
import { db } from '@vercel/postgres'
 
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Resend({
        apiKey: process.env.AUTH_RESEND_KEY,
        from: "no-reply@inforca.mc"
      }),
  ],
  adapter: PostgresAdapter(db),
})
