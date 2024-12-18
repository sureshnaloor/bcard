import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import clientPromise from "@/lib/mongodb";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      try {
        const client = await clientPromise;
        const db = client.db("businessCards");
        
        // Check if user already exists in userLimits
        const existingUser = await db.collection("userLimits").findOne({
          email: user.email
        });

        // If user doesn't exist, create default limits
        if (!existingUser) {
          await db.collection("userLimits").insertOne({
            email: user.email,
            cardLimit: 3, // Default card limit
            cardIds: [],
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
        
        return true;
      } catch (error) {
        console.error("Error setting user limits:", error);
        return false;
      }
    },
    async session({ session, token }) {
      return session;
    },
  },
}; 