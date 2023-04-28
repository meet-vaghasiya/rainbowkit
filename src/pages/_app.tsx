import '@/styles/globals.css'
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app'
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { mainnet, polygonMumbai, polygon, arbitrum, optimism } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';


const { chains, provider } = configureChains(
  [polygonMumbai],
  [
    jsonRpcProvider({ rpc: () => ({ http: "https://polygon-testnet-rpc.allthatnode.com:8545" }) }),
  ]
);



const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})


export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} showRecentTransactions={true}>
        <Component {...pageProps} />

      </RainbowKitProvider>
    </WagmiConfig>

  )
}
