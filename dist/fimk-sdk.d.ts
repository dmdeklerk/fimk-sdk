import * as converters from "./converters";
import * as crypto from "./crypto";
import * as utils from "./utils";
import * as _attachment from "./attachment";
import * as builder from "./builder";
import * as transaction from "./transaction";
import { FimkApi } from "./fimk-api";
import { RsAddress as _RsAddress } from "./rs-address";
export declare const attachment: typeof _attachment;
export declare const Builder: typeof builder.Builder;
export declare const TransactionImpl: typeof builder.TransactionImpl;
export declare const Transaction: typeof transaction.Transaction;
export declare const RsAddress: typeof _RsAddress;
export interface ConfigArgs {
    isTestnet?: boolean;
    baseURL?: string;
    genesisKey?: Array<number>;
}
export declare class Configuration {
    isTestnet: boolean;
    baseURL: string;
    websocketURL: string;
    genesisKey: Array<number>;
    constructor(args?: ConfigArgs);
}
export declare class FimkSDK {
    api: FimkApi;
    utils: typeof utils;
    crypto: typeof crypto;
    converters: typeof converters;
    config: Configuration;
    constructor(config?: Configuration);
    parseTransactionBytes(transactionBytesHex: string): builder.TransactionImpl;
    parseTransactionJSON(json: {
        [key: string]: any;
    }): builder.TransactionImpl;
    passphraseEncrypt(plainText: string, passphrase: string): string;
    passphraseDecrypt(cipherText: string, passphrase: string): string;
    /**
     * Note that the recipient must be provided in numeric form and not FIM-xx form.
     * To get the numeric id from an RS address do:
     *
     *    const addr = new RsAddress('FIM')
     *    addr.set(accountIdNumericOrRsFormat)
     *    const numeric = addr.account_id()
     *
     * @param recipientOrRecipientPublicKey
     * @param amount
     * @param timestamp
     */
    payment(recipientOrRecipientPublicKey: string, amount: string, timestamp: number): transaction.Transaction;
    arbitraryMessage(recipientOrRecipientPublicKey: string, message: string): transaction.Transaction;
    privateMessage(recipientPublicKey: string, message: string): transaction.Transaction;
    privateMessageToSelf(message: string): transaction.Transaction;
    assetTransfer(recipientOrRecipientPublicKey: string, assetId: string, quantity: string): transaction.Transaction;
    placeAskOrder(currencyId: string, assetId: string, quantity: string, price: string, expiration: number): transaction.Transaction;
    placeBidOrder(currencyId: string, assetId: string, quantity: string, price: string, expiration: number): transaction.Transaction;
    cancelAskOrder(orderId: string): transaction.Transaction;
    cancelBidOrder(orderId: string): transaction.Transaction;
}
