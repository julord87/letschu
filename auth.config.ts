import type { NextAuthConfig } from 'next-auth';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
 
export const authConfig = {
  providers: [

    Credentials({
        async authorize(credentials) {
          const parsedCredentials = z
            .object({ email: z.string().email(), password: z.string().min(6) })
            .safeParse(credentials);

            if( parsedCredentials.success === false ) return null;

            const { email, password } = parsedCredentials.data;

            console.log({ email, password })

            // Buscar el correo


            // Comparar las contraseñas

            
            // Si todo sale bien, retornar el usuario


            return null
        },
      }),

  ], // Add your providers here
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/new-account',
  }
} satisfies NextAuthConfig;


export const { signIn, signOut, auth } = NextAuth(authConfig);