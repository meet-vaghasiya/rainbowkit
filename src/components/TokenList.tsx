// components/TokenList.tsx

import { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { fetchBalance } from '@wagmi/core'


interface Token {
    id: string;
    symbol: string;
    name: string;
    logoURI: string
    chainId: number
    address: string,
    formatted?: string
}

interface TokenResponse {
    id: string;
    name: string;
    symbol: string;
    decimals: number;
    address: string;
    tokens: Token[]
}

export default function TokenList() {
    const [tokens, setTokens] = useState<Token[]>([]);

    const addresses = {
        MATIC: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
        LINK: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
        USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        AAVE: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
    }

    useEffect(() => {
        async function fetchTokens() {
            try {

                const response = await axios.get<TokenResponse>(`https://gateway.ipfs.io/ipns/tokens.uniswap.org`);
                const resTokens = response.data.tokens.filter((token, i) => i < 5 || Object.values(addresses).includes(token.address))  // took first 5 token and token mension in above object. because otherwise 429 error comes because of too many request.
                setTokens(() => resTokens);
            } catch (error) {
                console.error(error);

            }
        }
        fetchTokens();
    }, []);

    const updateTokens = useCallback(async () => {
        try {
            const updatedTokens = await Promise.all(tokens.map(async (token) => {
                const data = await fetchBalance({
                    address: token.address
                });
                return {
                    ...token,
                    formatted: Number(data.formatted || 0).toFixed(4)
                };
            }));
            updatedTokens.sort((a: Token, b: Token) => b.formatted - a.formatted);
            console.log(updateTokens, 'updated token')
            setTokens(() => updatedTokens);

        } catch (error) {
            console.error(error, 'error')
        }
    }, [tokens]);

    useEffect(() => {
        updateTokens();
    }, [updateTokens]);


    const sortedTokens = useMemo(() => {
        return [...tokens].sort((a, b) => b.formatted - a.formatted);
    }, [tokens]);


    return (
        <ul className="divide-y divide-gray-200">
            {sortedTokens.map(token => (
                <li key={token.address} className="flex py-4" id={token.address}>
                    <div className="flex-shrink-0">
                        <img src={token.logoURI} alt={token.symbol} className="h-8 w-8 rounded-full" />
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{token.symbol}</p>
                        <p className="text-sm text-gray-500">{token.name}</p>
                    </div>
                    <p className="text-sm text-gray-500 ml-auto">{(token.formatted)}</p>
                </li>
            ))}
        </ul>
    );
}
