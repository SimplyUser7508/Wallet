import React, { useState } from 'react';
import api from '../../Api/Api';

const TRANSACTION_URL = '/web3/send-transaction';

const Transaction: React.FC = () => {
    const [to, setTo] = useState('');
    const [value, setValue] = useState('');
    const [result, setResult] = useState<string | null>(null);

    const sendTransaction = async () => {
        try {
            const response = await api.post(TRANSACTION_URL, {
                to,
                value
            });
            setResult(response.data);
        } catch (error) {
            console.error('Error sending transaction:', error);
        }
    };

    return (
        <div>
            <input
                className='tarnsaction-input'
                type="text"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="To address"
            />
            <input
                className='tarnsaction-input'
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Amount in ETH"
            />
            <button className='button-48' onClick={sendTransaction}>Send Transaction</button>
            {result && <p>Transaction Result: {result}</p>}
        </div>
    );
}

export default Transaction;
