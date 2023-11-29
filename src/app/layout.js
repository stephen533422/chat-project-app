'use client'
import { ChatContextProvider } from '@/context/ChatContext';
import './globals.css';
import { AuthContextProvider } from '@/context/AuthContext';
import { FriendContextProvider } from '@/context/FriendContext';
import { UsersContextProvider } from '@/context/UsersContext';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>InstantChat</title>
        <meta name='description' content='Practice to create next app' />
      </head>
      <body>
        <AuthContextProvider>
          <UsersContextProvider>
          <FriendContextProvider>
          <ChatContextProvider>
            {children}
          </ChatContextProvider>
          </FriendContextProvider>
          </UsersContextProvider>
        </AuthContextProvider>
      </body>
    </html>
  )
}
