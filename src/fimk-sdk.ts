/*
 * The MIT License (MIT)
 * Copyright (c) 2017 Heat Ledger Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * */
import * as converters from "./converters"
import * as crypto from "./crypto"
import * as utils from "./utils"
import * as _attachment from "./attachment"
import * as builder from "./builder"
import * as transaction from "./transaction"
import { FimkApi } from "./fimk-api"
import {
  AssetTransfer,
  ColoredCoinsAskOrderPlacement,
  ColoredCoinsBidOrderPlacement,
  ColoredCoinsAskOrderCancellation,
  ColoredCoinsBidOrderCancellation
} from "./attachment"
import { Fee } from "./fee"
// import { AtomicTransfer } from "./attachment"

export const attachment = _attachment
export const Builder = builder.Builder
export const TransactionImpl = builder.TransactionImpl
export const Transaction = transaction.Transaction

export interface ConfigArgs {
  isTestnet?: boolean
  baseURL?: string
  genesisKey?: Array<number>
}

export class Configuration {
  isTestnet = false
  baseURL: string
  websocketURL: string
  genesisKey: Array<number>
  constructor(args?: ConfigArgs) {
    if (args) {
      if (utils.isDefined(args.isTestnet)) this.isTestnet = !!args.isTestnet
      if (utils.isDefined(args.baseURL)) this.baseURL = <string>args.baseURL
      if (utils.isDefined(args.genesisKey)) this.genesisKey = <Array<number>>args.genesisKey
    }
    if (!utils.isDefined(this.baseURL)) this.baseURL = "https://wallet.fimk.fi:7886/nxt"
    if (!utils.isDefined(this.genesisKey)) {
      if (this.isTestnet) {
        this.genesisKey = [255, 255, 255, 255, 255, 255, 255, 127]
      }
    }
  }
}

export class FimkSDK {
  public api: FimkApi
  public utils = utils
  public crypto = crypto
  public converters = converters
  public config: Configuration

  constructor(config?: Configuration) {
    const config_ = config ? config : new Configuration()
    this.config = config_
    this.api = new FimkApi({ baseURL: this.config.baseURL })
  }

  public parseTransactionBytes(transactionBytesHex: string) {
    return TransactionImpl.parse(transactionBytesHex, this.config.isTestnet)
  }

  public parseTransactionJSON(json: { [key: string]: any }) {
    return TransactionImpl.parseJSON(json, this.config.isTestnet)
  }

  public passphraseEncrypt(plainText: string, passphrase: string) {
    return crypto.passphraseEncrypt(plainText, passphrase).encode()
  }

  public passphraseDecrypt(cipherText: string, passphrase: string) {
    let encrypted = crypto.PassphraseEncryptedMessage.decode(cipherText)
    return crypto.passphraseDecrypt(encrypted, passphrase)
  }

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
  public payment(recipientOrRecipientPublicKey: string, amount: string, timestamp: number) {
    return new Transaction(
      this,
      recipientOrRecipientPublicKey,
      new Builder()
        .attachment(attachment.ORDINARY_PAYMENT)
        .feeHQT(Fee.DEFAULT)
        .deadline(1440)
        .ecBlockHeight(0)
        .ecBlockId("0")
        .timestamp(timestamp)
        .amountHQT(utils.convertToQNT(amount))
    )
  }

  public arbitraryMessage(recipientOrRecipientPublicKey: string, message: string) {
    return new Transaction(
      this,
      recipientOrRecipientPublicKey,
      new Builder()
        .feeHQT(Fee.DEFAULT)
        .attachment(attachment.ARBITRARY_MESSAGE)
        .amountHQT("0")
    ).publicMessage(message)
  }

  public privateMessage(recipientPublicKey: string, message: string) {
    return new Transaction(
      this,
      recipientPublicKey,
      new Builder()
        .feeHQT(Fee.DEFAULT)
        .attachment(attachment.ARBITRARY_MESSAGE)
        .amountHQT("0")
    ).privateMessage(message)
  }

  public privateMessageToSelf(message: string) {
    return new Transaction(
      this,
      null, // if null and provide private message then to send encrypted message to self
      new Builder()
        .feeHQT(Fee.DEFAULT)
        .attachment(attachment.ARBITRARY_MESSAGE)
        .amountHQT("0")
    ).privateMessageToSelf(message)
  }

  // public assetIssuance(
  //   descriptionUrl: string,
  //   descriptionHash: number[],
  //   quantity: string,
  //   decimals: number,
  //   dillutable: boolean,
  //   feeHQT?: string
  // ) {
  //   let builder = new Builder()
  //     .isTestnet(this.config.isTestnet)
  //     .genesisKey(this.config.genesisKey)
  //     .attachment(
  //       new AssetIssuance().init(descriptionUrl, descriptionHash, quantity, decimals, dillutable)
  //     )
  //     .amountHQT("0")
  //     .feeHQT(feeHQT ? feeHQT : Fee.ASSET_ISSUANCE_FEE)
  //   return new Transaction(this, "0", builder)
  // }

  public assetTransfer(recipientOrRecipientPublicKey: string, assetId: string, quantity: string) {
    let builder = new Builder()
      .feeHQT(Fee.DEFAULT)
      .attachment(new AssetTransfer().init(assetId, quantity))
      .amountHQT("0")
    return new Transaction(this, recipientOrRecipientPublicKey, builder)
  }

  // public atomicMultiTransfer(
  //   recipientOrRecipientPublicKey: string,
  //   transfers: AtomicTransfer[],
  //   feeHQT?: string
  // ) {
  //   let builder = new Builder()
  //     .isTestnet(this.config.isTestnet)
  //     .genesisKey(this.config.genesisKey)
  //     .attachment(new AtomicMultiTransfer().init(transfers))
  //     .amountHQT("0")
  //     .feeHQT(feeHQT ? feeHQT : Fee.ATOMIC_MULTI_TRANSFER_FEE)
  //   return new Transaction(this, recipientOrRecipientPublicKey, builder)
  // }

  public placeAskOrder(
    currencyId: string,
    assetId: string,
    quantity: string,
    price: string,
    expiration: number
  ) {
    let builder = new Builder()
      .attachment(
        new ColoredCoinsAskOrderPlacement().init(currencyId, assetId, quantity, price, expiration)
      )
      .amountHQT("0")
      .feeHQT(Fee.DEFAULT)
    return new Transaction(this, "0", builder)
  }

  public placeBidOrder(
    currencyId: string,
    assetId: string,
    quantity: string,
    price: string,
    expiration: number
  ) {
    let builder = new Builder()
      .isTestnet(this.config.isTestnet)
      .genesisKey(this.config.genesisKey)
      .attachment(
        new ColoredCoinsBidOrderPlacement().init(currencyId, assetId, quantity, price, expiration)
      )
      .amountHQT("0")
      .feeHQT(Fee.DEFAULT)
    return new Transaction(this, "0", builder)
  }

  public cancelAskOrder(orderId: string) {
    let builder = new Builder()
      .isTestnet(this.config.isTestnet)
      .genesisKey(this.config.genesisKey)
      .attachment(new ColoredCoinsAskOrderCancellation().init(orderId))
      .amountHQT("0")
      .feeHQT(Fee.DEFAULT)
    return new Transaction(this, "0", builder)
  }

  public cancelBidOrder(orderId: string) {
    let builder = new Builder()
      .isTestnet(this.config.isTestnet)
      .genesisKey(this.config.genesisKey)
      .attachment(new ColoredCoinsBidOrderCancellation().init(orderId))
      .amountHQT("0")
      .feeHQT(Fee.DEFAULT)
    return new Transaction(this, "0", builder)
  }
}
