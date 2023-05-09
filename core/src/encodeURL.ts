import { SOLANA_PROTOCOL } from "./constants";
import { TransferRequestURL, TransactionRequestURL } from "./interfaces";

type TransactionRequestURLFields = TransactionRequestURL;
type TransferRequestURLFields = TransferRequestURL;

/**
 * Encode a Solana Pay URL.
 *
 * @param fields Fields to encode in the URL.
 * */
export function encodeURL(fields: TransactionRequestURLFields | TransferRequestURLFields): URL {
    return 'link' in fields ? encodeTransactionRequestURL(fields) : encodeTransferRequestURL(fields);
}


function encodeTransactionRequestURL({ link, ...rest }: TransactionRequestURLFields): URL {
    // Remove trailing slashes
    const pathname = link.search
        ? encodeURIComponent(String(link).replace(/\/\?/, '?'))
        : String(link).replace(/\/$/, '');
    const url = new URL(SOLANA_PROTOCOL + pathname);

    for(const [key, value] of Object.entries(rest)) {
        if(key && value) {
            url.searchParams.append(key, value);
        }
    }

    return url;
}

function encodeTransferRequestURL({ recipient, amount, splToken, reference, ...rest }: TransferRequestURLFields): URL {
    const pathname = recipient.toBase58();
    const url = new URL(SOLANA_PROTOCOL + pathname);

    if(amount) {
        url.searchParams.append('amount', amount.toFixed(Number(amount.decimalPlaces())));
    }
    if(splToken) {
        url.searchParams.append('spl-token', splToken.toBase58());
    }
    if(reference) {
        if(!Array.isArray(reference)) {
            reference = [reference];
        }
        for(const pubkey of reference) {
            url.searchParams.append('reference', pubkey.toBase58());
        }
    }

    for(const [key, value] of Object.entries(rest)) {
        if(key && value) {
            url.searchParams.append(key, value);
        }
    }

    return url;
}
