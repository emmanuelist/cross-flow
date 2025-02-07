// stellarService.js
const { Horizon, Asset, Keypair } = require('@stellar/stellar-sdk');
const config = require('../../config/chains');

class StellarService {
  constructor() {
    this.horizon = new Horizon.Server(config.stellar.horizonUrl);
    this.networkPassphrase = config.stellar.networkPassphrase;
  }

  async sendPayment(senderSecret, recipient, amount, asset = 'native') {
    const senderKeypair = Keypair.fromSecret(senderSecret);
    const account = await this.horizon.loadAccount(senderKeypair.publicKey());
    
    const txBuilder = new Horizon.TransactionBuilder(account, {
      fee: await this.getFee(),
      networkPassphrase: this.networkPassphrase
    });

    const paymentAsset = asset === 'native' 
      ? Asset.native() 
      : new Asset(asset.code, asset.issuer);

    const tx = txBuilder
      .addOperation(Horizon.Operation.payment({
        destination: recipient,
        asset: paymentAsset,
        amount: amount.toFixed(7)
      }))
      .setTimeout(30)
      .build();

    tx.sign(senderKeypair);
    return this.horizon.submitTransaction(tx);
  }

  async getFee() {
    const { fee_stats } = await this.horizon.feeStats();
    return fee_stats.max_fee.max;
  }
}