import '@/styles/globals.css'
import { PrivyProvider } from '@privy-io/react-auth'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <PrivyProvider
    appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
    onSuccess={() => console.log("Logged in with Privy")}
    config={{
      embeddedWallets: {
        createOnLogin: "users-without-wallets",
        noPromptOnSignature: true,
      },
      loginMethods: ["email", "google"],
    }}
    >
      <Component {...pageProps} />
    </PrivyProvider>
  )
}
