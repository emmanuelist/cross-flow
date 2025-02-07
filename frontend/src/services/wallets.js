// frontend/src/services/wallets.js
export const connectMetaMask = async () => {
	if (!window.ethereum) throw new Error('MetaMask not installed');
	
	const accounts = await window.ethereum.request({ 
	  method: 'eth_requestAccounts' 
	});
	
	return {
	  address: accounts[0],
	  chainId: window.ethereum.chainId,
	  provider: window.ethereum
	};
  };
  
  export const connectFreighter = async () => {
	if (!window.freighter) throw new Error('Freighter not installed');
	
	const publicKey = await window.freighter.getPublicKey();
	return {
	  address: publicKey,
	  network: await window.freighter.getNetwork(),
	  signTransaction: (tx) => window.freighter.signTransaction(tx)
	};
  };