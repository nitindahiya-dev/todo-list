// Page.tsx
"use client";
import React, { useMemo } from 'react';
import Todo from '@/components/Todo';
import './globals.css';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { WalletMultiButton, WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';

const Page = () => {
  const network = clusterApiUrl('devnet');

  const wallets = useMemo(() => [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
  ], []);

  return (
    <ConnectionProvider endpoint={network}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="absolute top-5 right-5">
            <WalletMultiButton />
          </div>
          <div className='flex flex-col min-h-screen gap-20 items-center justify-center'>
            <h1 className='text-5xl font-extrabold'>Todo List</h1>
            <Todo />
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default Page;
