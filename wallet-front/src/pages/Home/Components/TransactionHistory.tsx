import React, { useState } from 'react';
import api from '../../Api/Api';
import { format } from 'date-fns';
import "../index.css";

const HISTORY_URL = '/web3/history';

const TransactionHistory: React.FC = () => {
    const [history, setHistory] = useState<string[] | null>(null);

    const getAddress = async () => {
        try {
            const response = await api.get(HISTORY_URL);
            console.log(response);
            const formattedHistory = response.data.history.map((date: string) => {
                const originalDate = new Date(date);
                originalDate.setHours(originalDate.getHours() + 3);
                return format(originalDate, 'yyyy-MM-dd HH:mm');
            });
            setHistory(formattedHistory);
        } catch (error) {
            console.error('Error getting history:', error);
        }
    };

    return (
        <div>
            <button className='button-48' onClick={getAddress}>My transaction history</button>
            {history && (
                <ul className='history-list'>
                    {history.map((date, index) => (
                        <li key={index}>{date}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default TransactionHistory; 
