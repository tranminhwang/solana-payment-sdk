import { PublicKey } from "@solana/web3.js";
import BigNumber from "bignumber.js";
import { HTTPS_PROTOCOL, SOLANA_PROTOCOL } from "./constants";
import { TransactionRequestURL, TransferRequestURL } from "./interfaces";

export class ParseURLError extends Error {
    name = 'ParseURLError';
}


export function parseURL(url: string | URL): TransactionRequestURL | TransferRequestURL {
    if(typeof url === 'string') {
        if(url.length > 2048) throw new ParseURLError('length invalid');
        url = new URL(url);
    }

    if(url.protocol !== SOLANA_PROTOCOL) throw new ParseURLError('protocol invalid');
    if(!url.pathname) throw new ParseURLError('pathname missing');

    return  /[:%]/.test(url.pathname) ? parseTransactionRequestURL(url) : parseTransferRequestURL(url);
}

function parseTransactionRequestURL({ pathname, searchParams }: URL) : TransactionRequestURL {
    const link = new URL(decodeURIComponent(pathname));
    if(link.protocol !== HTTPS_PROTOCOL) throw new ParseURLError('link invalid');

    const label = searchParams.get('label') ?? undefined
    const message = searchParams.get('message') ?? undefined;

    return {
        link,
        label,
        message,
    }
}

function parseTransferRequestURL({ pathname, searchParams }: URL) : TransferRequestURL {
    let recipient: PublicKey;
    try {
        recipient = new PublicKey(pathname);
    } catch (error) {
        throw new ParseURLError('recipient invalid');
    }

    let amount: BigNumber | undefined;
    const amountParam = searchParams.get('amount');
    if(amountParam) {
        if (!/^\d+(\.\d+)?$/.test(amountParam)) throw new ParseURLError('amount invalid');

        amount = new BigNumber(amountParam);
        if(amount.isNaN()) throw new ParseURLError('amount is not a number');
        if(amount.isNegative()) throw new ParseURLError('amount is negative');
    }

    let splToken: PublicKey | undefined;
    const splTokenParam = searchParams.get('spl-token');
    if(splTokenParam) {
        try {
            splToken = new PublicKey(splTokenParam);
        }catch (error) {
            throw new ParseURLError('spl-token invalid');
        }
    }

    let reference: PublicKey[] | undefined;
    const referenceParams = searchParams.getAll('reference');
    if(referenceParams.length) {
        try {
            reference = referenceParams.map((reference) => new PublicKey(reference));
        } catch (error) {
            throw new ParseURLError('reference invalid');
        }
    }

    const label = searchParams.get('label') ?? undefined;
    const message = searchParams.get('message') ?? undefined;
    const memo = searchParams.get('memo') ?? undefined;

    return {
        recipient,
        amount,
        splToken,
        reference,
        label,
        message,
        memo,
    }
}
