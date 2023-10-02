import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react';
import { IBundler, Bundler } from '@biconomy/bundler'
import { BiconomySmartAccountV2, DEFAULT_ENTRYPOINT_ADDRESS } from "@biconomy/account"
import { ECDSAOwnershipValidationModule, DEFAULT_ECDSA_OWNERSHIP_MODULE } from "@biconomy/modules";
import { ethers  } from 'ethers'
import { ChainId } from "@biconomy/core-types"
import { IPaymaster, BiconomyPaymaster } from '@biconomy/paymaster'
import { ConnectedWallet, usePrivy, useWallets } from '@privy-io/react-auth';
import { useRouter } from "next/router";
import idAbi from "@/utils/idRegistryAbi.json"
import storageAbi from "@/utils/storageRegistryabi.json"
import { PaymasterMode, type IHybridPaymaster, type SponsorUserOperationDto } from "@biconomy/paymaster";
import Casts from '@/components/Casts';
// import CreateSession from '@/components/CreateSession';



export default function Timeline() {
  const [address, setAddress] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false);
  const [smartAccount, setSmartAccount] = useState<BiconomySmartAccountV2 | null>(null);
  const [fname, setFname] = useState<string>("")
  const [provider, setProvider] = useState<any>()
  const {ready, authenticated, logout, user} = usePrivy();
  const [isSessionActive, setIsSessionActive] = useState<boolean>(false);
  const router = useRouter();
  const {wallets} = useWallets();
  
  useEffect(() => {
    if (ready && !authenticated) router.push('/');
  }, [ready, authenticated, router]);

  const bundler: IBundler = new Bundler({
    //https://dashboard.biconomy.io/
    bundlerUrl: process.env.NEXT_PUBLIC_BICONOMY_BUNDLER_URL as string,    
    chainId: ChainId.POLYGON_MUMBAI,
    entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
  })
  
  const paymaster: IPaymaster = new BiconomyPaymaster({
    //https://dashboard.biconomy.io/
    paymasterUrl: process.env.NEXT_PUBLIC_BICONOMY_PAYMASTER_URL as string
  })

  const createBiconomyAccountFromEOA = async (wallet: ConnectedWallet) => {
    await wallet.switchChain(80001);
    const provider = await wallet.getEthersProvider();
    setProvider(provider)
    const signer = provider.getSigner();

    const validationModule = await ECDSAOwnershipValidationModule.create({
        signer: signer,
        moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE
    });

    const biconomySmartAccount = await BiconomySmartAccountV2.create({
        provider: provider,
        chainId: ChainId.POLYGON_MUMBAI,
        bundler: bundler,
        paymaster: paymaster,
        entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
        defaultValidationModule: validationModule,
        activeValidationModule: validationModule
    });

    setSmartAccount(biconomySmartAccount);
    const address = await biconomySmartAccount.getAccountAddress();
    setAddress(address);
}

const checkAndRegisterFname = async () => {
  if (!smartAccount) return
  setLoading(true)
  const provider = new ethers.providers.JsonRpcProvider(`https://polygon-mumbai.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`)
  const idContract = new ethers.Contract("0x007ec325d80d64887281c453F641e6703ac6A3a9", idAbi, provider);
  const storageContract = new ethers.Contract("0xF7aB9d9c856D35C17685E50029F60B93023Fe21F", storageAbi, provider);
  const userFid = await idContract.getFid(address)

  console.log({ userFid : userFid.toNumber() })
  if(userFid.toNumber() == 0) {
    console.log("doesn't exist execute transaction")
    if (!smartAccount) return
  //todo add form to allow other recovery address to be registered

  const recoveryAddress = "0x322Af0da66D00be980C7aa006377FCaaEee3BDFD"
  const idRegistrationtrx = await idContract.populateTransaction.register(recoveryAddress, user?.google?.name)
  const storagetrx = await storageContract.populateTransaction.register()

  const registrationTrxs = [
    {
      to: "0x007ec325d80d64887281c453F641e6703ac6A3a9",
      data: idRegistrationtrx.data
    },
    {
      to: "0xF7aB9d9c856D35C17685E50029F60B93023Fe21F",
      data:storagetrx.data
    }
  ]

  let partialUserOp = await smartAccount.buildUserOp(registrationTrxs)

  const biconomyPaymaster = smartAccount.paymaster as IHybridPaymaster<SponsorUserOperationDto>;
    const paymasterServiceData: SponsorUserOperationDto = {
      mode: PaymasterMode.SPONSORED,
      smartAccountInfo: {
        name: 'BICONOMY',
        version: '2.0.0'
      },
    };

    const paymasterAndDataResponse = await biconomyPaymaster.getPaymasterAndData(
      partialUserOp,
      paymasterServiceData
  );
    partialUserOp.paymasterAndData = paymasterAndDataResponse.paymasterAndData;


  try {
    const userOpResponse = await smartAccount.sendUserOp(partialUserOp)
    const { receipt } = await userOpResponse.wait(1);
    console.log({ receipt })
    console.log({ hash: receipt.transactionHash })
  } catch (err) {
    console.error(err)
  }
  }
  // todo: properly handle if no user 
  const username = await idContract.getFname(address)
  setFname(username)
  setLoading(false)
}



useEffect(() => {
  if (!ready || !authenticated) return;
  const embeddedWallet = wallets.find((wallet) => (wallet.walletClientType === 'privy'));
  if (embeddedWallet && !smartAccount) createBiconomyAccountFromEOA(embeddedWallet);
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [wallets]);

useEffect(() => {
  if(!smartAccount) return
  console.log("hello smart account exists")
  console.log({smartAccount})
  checkAndRegisterFname()
// eslint-disable-next-line react-hooks/exhaustive-deps
},[smartAccount])
console.log({ address })
  return (
    <>
      <Head>
        <title>Mini AA Farcaster</title>
        <meta name="description" content="Discover an AA powered Farcaster" />
      </Head>
      <main className={styles.main}>
        <h1>Mini AA Farcaster</h1>
        <h2>Connect and get a glimpse at Farcaster powered by Account Abstraction</h2>
        {loading && <p>Checking for Fname...</p>}
        {fname && <p>Welcome {fname}</p>}
        <button onClick={logout} className={styles.connect}>Logout</button>
        {fname && <Casts isSessionActive={isSessionActive} setIsSessionActive={setIsSessionActive}  provider={provider} address={address} smartAccount={smartAccount} />}
      </main>
    </>
  )
}
