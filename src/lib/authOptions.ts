import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import crypto from "crypto";
import dbConnect from "@/lib/mongodb";
import Admin from "@/models/Admin";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        await dbConnect();

        const user = await Admin.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("User not found");
        }

        function verifyHash(input : any, storedHash : any) {
          const newHash = crypto.createHash("sha256").update(input).digest("hex");
          return newHash === storedHash;
        }
 

        // Optional: add password verification if stored hashed
         const isValid = verifyHash(credentials.password , user.password)
       if (!isValid) throw new Error("Invalid password");

       if(user.status === 'suspended'){
        throw new Error("Account is Restricted contact super admin");
       }
        // Return all necessary info
        return {
          id: user._id as any,
          email: user.email,
          role: user.role,
          username: user.username, // if you have
        //  two_factor_auth: user.two_factor_auth, // if you have
           permissions: user.permissions,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 20 * 60, // 10 minutes in seconds
  },
  jwt: {
    maxAge: 20 * 60, // 10 minutes in seconds
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user } : any) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.username = user.username;
        //token.two_factor_auth = user.two_factor_auth;
        token.permissions = user.permissions;
        token.status = user.status
      }
      return token;
    },
    async session({ session, token } : any) {
      if (token) {
        session.user = {
          id: token.id,
          email: token.email,
          role: token.role,
          username: token.username,
          two_factor_auth: token.two_factor_auth,
          permissions: token.permissions,
          status : token. status
        };
      }
      return session;
    },
  },
};
