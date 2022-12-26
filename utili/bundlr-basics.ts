import Bundlr from '@bundlr-network/client';
import * as dotenv from 'dotenv';
dotenv.config({ path: __dirname + '/.env' });

const jwk: string = JSON.parse(process.env.PRIVATE_KEY);

const devnet = "https://devnet.bundlr.network/"

const bundlr = new Bundlr(devnet, "arweave", jwk);

console.log(bundlr);

export default bundlr; // Export the bundlr instance