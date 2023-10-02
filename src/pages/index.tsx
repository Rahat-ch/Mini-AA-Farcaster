import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useEffect } from 'react';
import { IBundler, Bundler } from '@biconomy/bundler'
import { BiconomySmartAccountV2, DEFAULT_ENTRYPOINT_ADDRESS } from "@biconomy/account"
import { ECDSAOwnershipValidationModule, DEFAULT_ECDSA_OWNERSHIP_MODULE } from "@biconomy/modules";
import { ethers  } from 'ethers'
import { ChainId } from "@biconomy/core-types"
import { IPaymaster, BiconomyPaymaster } from '@biconomy/paymaster'
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/router";
// import CreateSession from '@/components/CreateSession';



export default function Home() {
  const { ready, authenticated, login } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (ready && authenticated) {
      if (ready && authenticated) router.push("/timeline");
    }
  }, [ready, authenticated, router]);
  return (
    <>
      <Head>
        <title>Mini AA Farcaster</title>
        <meta name="description" content="Discover an AA powered Farcaster" />
      </Head>
      <main className={styles.main}>
        <h1>Mini AA Farcaster</h1>
        <h2>Connect and get a glimpse at Farcaster powered by Account Abstraction</h2>
        <button onClick={login} className={styles.connect}>Connect to Web3</button>
      </main>
    </>
  )
}
