document.getElementById('createAccount').addEventListener('click', () => {
    fetch('http://localhost:3000/wallet/create')
      .then(response => response.json())
      .then(data => {
        document.getElementById('result').textContent = `Address: ${data.address}, Private Key: ${data.privateKey}`;
      });
  });
  
  document.getElementById('getBalance').addEventListener('click', () => {
    const address = prompt('Enter the address:');
    fetch(`http://localhost:3000/wallet/balance/${address}`)
      .then(response => response.json())
      .then(data => {
        document.getElementById('result').textContent = `Balance: ${data}`;
      });
  });
  
  document.getElementById('sendTransaction').addEventListener('click', () => {
    const from = prompt('Enter the from address:');
    const to = prompt('Enter the to address:');
    const value = prompt('Enter the value in Ether:');
    const privateKey = prompt('Enter the private key:');
    
    fetch('http://localhost:3000/wallet/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ from, to, value, privateKey })
    })
      .then(response => response.json())
      .then(data => {
        document.getElementById('result').textContent = `Transaction: ${data}`;
      });
  });
  