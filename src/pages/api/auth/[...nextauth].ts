import NextAuth from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from 'lib-server/prisma';
import Credentials from 'next-auth/providers/credentials';
import { verify } from 'argon2';
import type { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  useSecureCookies: process.env.NODE_ENV && process.env.NODE_ENV === 'production',
  callbacks: {
    // redirect(params) {
    //   console.log('REDIRECT', params);
    //   return null as any;
    // },
    async session({ session, token, user }) {
      if (token) {
        (session as any).id = token.id;
      }

      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }

      // console.log({ token });

      return token;
    },
  },

  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'jsmith@gmail.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials, request) => {
        if (!credentials) return null;

        //        console.log('AUTHENTICATING ', credentials, request);

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });
        // console.log('USER', user);

        if (!user) return null;

        const isValidPassword = await verify(user.password, credentials.password);

        console.log({
          isValidPassword,
          userPassword: user.password,
          credentialsPassword: credentials.password,
        });

        if (!isValidPassword) return null;

        // console.log('valid!');

        return {
          id: user.id,
          email: user.email,
        } as any;
      },
    }),
  ],
  // secret: process.env.SECRET,
  session: {
    strategy: 'jwt',
  },
  jwt: {
    maxAge: 30 * 24 * 30 * 60, // 30 days
  },
  pages: {
    signIn: '/auth',
    newUser: '/register',
  },
  debug: process.env.NODE_ENV === 'development',
};

export default NextAuth(authOptions);
