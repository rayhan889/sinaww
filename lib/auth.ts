import { getServerSession, type NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
// import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    })
    // CredentialsProvider({
    //   name: 'Credentials',
    //   credentials: {
    //     username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
    //     password: { label: 'Password', type: 'password' }
    //   },
    //   // TODO: config with
    //   async authorize(credentials, req) {
    //     const user = {
    //       id: '1',
    //       username: 'johnsmith',
    //       password: 'password'
    //     }

    //     if (
    //       credentials?.username !== user.username ||
    //       credentials?.password !== user.password
    //     ) {
    //       return null
    //     }

    //     return user
    //   }
    // })
  ],
  pages: {
    signIn: '/signin',
    newUser: '/signup'
  }
}

export const getAuthSession = () => getServerSession(authOptions)
