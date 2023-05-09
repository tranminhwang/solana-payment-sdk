import { Keypair } from '@solana/web3.js';
import {parseURL, encodeURL, TransferRequestURL} from "../src";

(async () => {
    const originalReference = Keypair.generate().publicKey;
    const NATIVE_URL =
        'solana:mvines9iiHiQTysrwkJjGf2gb9Ex9jXJX8ns3qwf2kN' +
        '?amount=0.01' +
        '&spl-token=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' +
        '&reference='+
        encodeURIComponent(String(originalReference)) +
        '&label=Minh%20Wang' +
        '&message=Thanks%20for%20all%20the%20fish' +
        '&memo=OrderId5678';

    const originalURL = NATIVE_URL;
    const paresedURL = parseURL(originalURL) as TransferRequestURL;
    const encodedURL = encodeURL(paresedURL);

    console.log("originalURL", originalURL);
    console.log("paresedURL", paresedURL);
    console.log("encodedURL", encodedURL);
})();
