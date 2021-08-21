import { Wallet, SuphaChain } from "./block-chain";

const suphanice = new Wallet();
const _gsuy = new Wallet();
const jobsan = new Wallet();

suphanice.sendMoney(100, _gsuy.publicKey);
_gsuy.sendMoney(75, jobsan.publicKey);
jobsan.sendMoney(10, _gsuy.publicKey);

console.log(SuphaChain.instance);

// for (let i = 0; i < SuphaChain.instance.chain.length; i++) {
//   console.log(SuphaChain.instance.chain[i].transaction);
// }

