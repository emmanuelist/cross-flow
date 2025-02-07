// backend/services/transactionMonitor.js
const { ethers } = require('ethers');
const { Horizon } = require('@stellar/stellar-sdk');
const Transaction = require('../models/Transaction');
const config = require('../../config/chains');

class TransactionMonitor {
	constructor() {
		this.ethProvider = new ethers.providers.JsonRpcProvider(config.ethereum.rpcUrl);
		this.stellarServer = new Horizon.Server(config.stellar.horizonUrl);
	}

	async start() {
		this.monitorEthTransactions();
		this.monitorStellarTransactions();
	}

	async monitorEthTransactions() {
		this.ethProvider.on('block', async (blockNumber) => {
			const block = await this.ethProvider.getBlockWithTransactions(blockNumber);
			block.transactions.forEach(tx => this.processEthTransaction(tx));
		});
	}

	async monitorStellarTransactions() {
		const cursor = 'now';
		this.stellarServer.transactions()
			.cursor(cursor)
			.stream({
				onmessage: tx => this.processStellarTransaction(tx)
			});
	}

	async processEthTransaction(tx) {
		// Update transaction status in DB
		// Trigger cross-chain actions if needed
	}

	async processStellarTransaction(tx) {
		// Update transaction status in DB
		// Trigger cross-chain actions if needed
	}
}