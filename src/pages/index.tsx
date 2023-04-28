import ABI from '../utils/abis/greeting-mumbai-polygon.json'
import { ConnectButton, useAddRecentTransaction } from "@rainbow-me/rainbowkit"
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite } from "wagmi"
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { fetchBalance, fetchToken } from '@wagmi/core'

import TokenContainer from '../components/TokenContainer'

function Home() {
    const [message, setMessage] = useState<string>('')
    const [greet, setGreet] = useState<string>('')
    const { isConnected } = useAccount()
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);


    const { data, isLoading, error } = useContractRead({
        address: '0xAC3D8D042B718B77dbB6394eD772885b085726c4',
        abi: ABI,
        functionName: 'greet',
        onSettled(data, error) {
            if (data) {
                setMessage(data)
            }
        },
        args: [],

    })

    const { config } = usePrepareContractWrite({
        address: '0xAC3D8D042B718B77dbB6394eD772885b085726c4',
        abi: ABI,
        functionName: 'setGreeting',
        args: [greet],
    })
    const { write } = useContractWrite({
        ...config, onSuccess(data) {
            setMessage(greet)
            setGreet('')
        },
    })
    const handleWrite = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        write?.()
    }

    const handleGreetChange = (e: ChangeEvent<HTMLInputElement>) => {
        setGreet(e.target.value)
    }


    return (
        <>
            <div className="min-h-screen p-24">
                <h2 className='text-3xl text-center'>Task 3:</h2>
                <ConnectButton></ConnectButton>


                {isClient && !isConnected && <h2 className='text-2xl text-red-500'>Kindly connect wallet to write contract</h2>}


                <div className="grid grid-cols-2 mx-auto mt-10">
                    <div className="col-span-1">
                        <form action="" onSubmit={handleWrite} className='bg-grey'>
                            <input type="text"
                                className='appearance-none border rounded  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-5' placeholder='Greet messsage' onChange={handleGreetChange} value={greet} />
                            <button className='bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline' type="submit">Click me</button>

                        </form>
                    </div>
                    <div className="col-span-1 mx-auto">
                        contract message: <span className='text-blue-700'> {message}</span>
                    </div>
                </div>
                {error && (
                    <div className=''>An error occurred preparing the transaction: {error.message}</div>
                )}

                {isClient && isConnected && <TokenContainer />}

            </div>
        </>
    )
}

export default Home 
