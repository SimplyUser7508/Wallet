import React, { useState } from 'react';
import { FiCopy } from 'react-icons/fi';

import api from '../../Api/Api';
import '../index.css';

const PROFILE_URL = '/web3/profile';

interface Account {
    address: string;
}

const AccauntData: React.FC = () => {
    const [account, setAccount] = useState<Account | null>(null);

    const getAddress = async () => {
        try {
            const response = await api.get(PROFILE_URL);
            console.log(response)
            await setAccount(response.data);
        } catch (error) {
            console.error('Error creating account:', error);
        }
    };

    const copyToClipboard = () => {
        if (account) {
            navigator.clipboard.writeText(account.address);
            alert('Address copied to clipboard');
        }
    };

    return (
        <div>
            <button className='button-48' onClick={getAddress}>Get my wallet address</button>
            {account && (
                <div className='account-data'>
                    <p>
                        <strong>Address:  </strong>
                        <span className='address-text'>{account.address}</span>
                        <FiCopy className='copy-icon' onClick={copyToClipboard} />
                    </p>
                </div>
            )}
        </div>
    );
}

export default AccauntData;
