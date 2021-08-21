import * as crypto from "crypto";

class Transaction {
  constructor(
    public amount: number,
    public sender: string, // public key
    public receiver: string // public key
  ) {}

  // Convert object to string
  toString() {
    return JSON.stringify(this);
  }
}

class Block {
  public pool = Math.round(Math.random() * 1.1e9);

  constructor(
    public prevHash: string,
    public transaction: Transaction,
    public timestamp = new Date()
  ) {}

  get hash() {
    const block = JSON.stringify(this);
    const hash = crypto.createHash("SHA256");
    hash.update(block).end();
    return hash.digest("hex");
  }
}

// blockchain
export class SuphaChain {
  public static instance = new SuphaChain();

  chain: Block[];

  constructor() {
    this.chain = [new Block("", new Transaction(69, "genesis", "suphanice"))];
  }

  get lastBlock() {
    return this.chain[this.chain.length - 1];
  }

  // PoW system
  mine(pool: number) {
    let solution = 1;
    console.log("⛏️  mining supha coin...");

    while (true) {
      const hash = crypto.createHash("MD5");
      hash.update((pool + solution).toString()).end();

      const attempt = hash.digest("hex");

      if (attempt.substr(0, 4) === "0000") {
        console.log(`Solved: ${solution}`);
        return solution;
      }

      solution++;
    }
  }

  addBlock(transaction: Transaction, senderPubKey: string, signature: Buffer) {
    const verify = crypto.createVerify("SHA256");
    verify.update(transaction.toString());

    const isValid = verify.verify(senderPubKey, signature);

    if (isValid) {
      const newBlock = new Block(this.lastBlock.hash, transaction);
      this.mine(newBlock.pool);
      this.chain.push(newBlock);
    }
  }
}

export class Wallet {
  public publicKey: string;
  public privateKey: string;
//   public supha_coin: number;

  constructor() {
    const keypair = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: { type: "spki", format: "pem" },
      privateKeyEncoding: { type: "pkcs8", format: "pem" },
    });

    this.publicKey = keypair.publicKey;
    this.privateKey = keypair.privateKey;
    // this.supha_coin = 0
  }

  sendMoney(amount: number, receiverPubKey: string) {
    const transaction = new Transaction(amount, this.publicKey, receiverPubKey)

    const sign = crypto.createSign('SHA256')
    sign.update(transaction.toString()).end()

    const signature = sign.sign(this.privateKey)
    SuphaChain.instance.addBlock(transaction, this.publicKey, signature)
  }
}
