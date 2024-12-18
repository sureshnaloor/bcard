import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error('Missing environment variables for Google authentication');
}

// Define custom types
interface ExtendedSession extends Session {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
    isAdmin?: boolean;
  }
}

interface ExtendedToken extends JWT {
  role?: string;
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  pages: {
    signIn: '/auth/signin',  // Path to our custom sign-in page
    error: '/auth/signin', // Error code passed in query string as ?error=
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token }): Promise<ExtendedToken> {
      return {
        ...token,
        role: token.role || 'user'
      };
    },
    async session({ session, token }: { session: ExtendedSession; token: ExtendedToken }): Promise<ExtendedSession> {
      if (session.user) {
        session.user.id = token.sub || '';
        session.user.role = token.role || 'user';
        session.user.isAdmin = session.user.email === process.env.ADMIN_EMAIL;
      }
      return session;
    },
    async signIn({ user }) {
      try {
        const client = await clientPromise;
        const db = client.db("businessCards");
        
        // Check if user exists in our limits collection
        const existingUser = await db.collection("userLimits").findOne({ 
          email: user.email 
        });

        if (!existingUser) {
          // Create new user with default limits
          await db.collection("userLimits").insertOne({
            email: user.email,
            cardLimit: 1, // Default limit
            cardIds: [],
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }

        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST }; 