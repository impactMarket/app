import { getPACTTradingMetrics } from '@impact-market/utils';
import { useEffect, useState } from 'react';
import config from 'config';

function usePactPriceUSD() {
    const [priceUSD, setPriceUSD] = useState<number | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        async function fetchPrice() {
            const response = await getPACTTradingMetrics(config.chainId);

            setPriceUSD(parseFloat(response.priceUSD));
            setIsReady(true);
        }

        fetchPrice();
    }, []);

    return { isReady, priceUSD };
}

export default usePactPriceUSD;
