import { useEffect } from 'react';
import TokenList from './TokenList';

export default function Home() {

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 `}
    >

      <h1 className='text-3xl'>Task 2: </h1>
      <TokenList />
    </main>
  )
}
