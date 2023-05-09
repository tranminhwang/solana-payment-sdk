import { Amount, Recipient, References, SPLToken, Label, Message, Memo } from "./types";
import { SOLANA_PROTOCOL } from "./constants";


export interface TransactionRequestURLFields {
    link: URL,
    label?: string,
    message?: string,
}

export interface TransferRequestURLFields {
    recipient: Recipient,
    amount?: Amount,
    splToken?: SPLToken,
    reference?: References,
    label?: Label,
    message?: Message,
    memo?: Memo,
}


/**
 * Encode a Solana Pay URL.
 *
 * @param fields Fields to encode in the URL.
 * */
export function encodeURL(fields: TransactionRequestURLFields | TransferRequestURLFields): URL {
    return 'link' in fields ? encodeTransactionRequestURL(fields) : encodeTransferRequestURL(fields);
}


function encodeTransactionRequestURL({ link, label, message }: TransactionRequestURLFields): URL {
    // Remove trailing slashes
    const pathname = link.search
        ? encodeURIComponent(String(link).replace(/\/\?/, '?'))
        : String(link).replace(/\/$/, '');
    const url = new URL(SOLANA_PROTOCOL + pathname);

    if(label) {
        url.searchParams.append('label', label);
    }
    if(message) {
        url.searchParams.append('message', message);
    }

    return url;
}

function encodeTransferRequestURL({recipient, amount, splToken, reference, label, message, memo}: TransferRequestURLFields): URL {
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
    if(label) {
        url.searchParams.append('label', label);
    }
    if(message) {
        url.searchParams.append('message', message);
    }
    if(memo) {
        url.searchParams.append('memo', memo);
    }

    return url;
}
