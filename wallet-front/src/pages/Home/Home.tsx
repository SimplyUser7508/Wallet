import React from 'react';
import AccountCreation from './Components/AccauntData';
import Balance from './Components/Balance';
import Transaction from './Components/Transaction';
import TransactionHistory from './Components/TransactionHistory';


// const LOGOUT_URL = '/auth/logout';

const Home: React.FC = () => {
    // const navigate = useNavigate();

    //   const handleLogout = async () => {
    //     try {
    //       await api.post(LOGOUT_URL);

    //       localStorage.removeItem('accessToken');
    //     } catch (error) {
    //       console.error('Failed to log out', error);
    //     }
    //     navigate('/auth/login');
    //   };

    return (
        <div>
            <h1>Crypto Wallet</h1>
            <AccountCreation />
            <Balance />
            <Transaction />
            <TransactionHistory />
        </div>
    );
}

export default Home;
