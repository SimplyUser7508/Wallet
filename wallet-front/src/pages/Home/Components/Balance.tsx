import React, { useState } from 'react';
import api from '../../Api/Api';

const GET_BALANCE_URL = '/web3/get-balance';

const Balance: React.FC = () => {
    const [balance, setBalance] = useState<string | null>(null);

    const getBalance = async () => {
        try {
            const response = await api.post(GET_BALANCE_URL);
            setBalance(response.data);
        } catch (error) {
            console.error('Error fetching balance:', error);
        }
    };

    return (
        <div className='balance'>
            <button className='button-48' onClick={getBalance}>Get Balance</button>
            {balance !== null && <p><strong>Balance: </strong><strong>{balance} ETH</strong></p>}
        </div>
    );
}

export default Balance;
