///<reference path="../node_modules/@types/jest/index.d.ts"/>

/*
To run tests in the file  test/testnet.ts  must be actual values for Testnet
 */
import "./jasmine"
import { Builder } from "../src/builder"
import { Transaction } from "../src/transaction"
import { AssetTransfer } from "../src/attachment"
import { byteArrayToHexString } from "../src/converters"
import { convertToQNT, timestampToDate } from "../src/utils"
import { FimkSDK } from "../src/fimk-sdk"
import { RsAddress } from "../src/rs-address"

const fimksdk = new FimkSDK()

describe("Transfer Test", () => {
  it("can create a transfer", () => {
    const privateKey = "user1" // FIM-7PL3-2CC5-TKMV-6QDX2
    const publicKey = fimksdk.crypto.secretPhraseToPublicKey(privateKey)
    //const recipientRs = "FIM-PDCD-QVM5-5DRW-3N6HV"
    const recipientRs = "1204580086052963717"
    const addr = new RsAddress("FIM")
    addr.set(recipientRs)
    const recipient = addr.account_id()
    const quantity = "0.1"
    const fee = "0.1"
    const asset = "13664938383416975974"

    return fimksdk.api
      .get(`?requestType=getECBlock&timestamp=0`)
      .then((data: any) => {
        // console.log(data)
        const { timestamp, ecBlockHeight, ecBlockId } = data
        //const ecBlockHeight = 1, ecBlockId = "0"
        const params = {
          recipient: recipient,
          quantityQNT: convertToQNT(quantity),
          feeNQT: convertToQNT(fee),
          publicKey: publicKey,
          //secretPhrase: "user1",
          deadline: "1440",
          requestType: "transferAsset",
          asset: asset,
          ...data
        }

        // return fimksdk.api.post("",params).then((data:any) => {
        const transaction_ = new Transaction(
          fimksdk,
          params.recipient,
          new Builder()
            .recipientId(params.recipient)
            .attachment(new AssetTransfer().init(asset, params.quantityQNT))
            .amountHQT("0")
            .feeHQT(params.feeNQT)
            .deadline(1440)
            .timestamp(timestamp)
            .ecBlockHeight(ecBlockHeight)
            .ecBlockId(ecBlockId)
        ).publicMessage("Public message")
        return transaction_
          .sign(privateKey)
          .then(t => {
            const transaction = t.getTransaction()
            const bytes = transaction.getBytesAsHex()
            const unsignedTransactionBytes = byteArrayToHexString(transaction.getUnsignedBytes())
            const json = transaction.getJSONObject()

            // console.log(printBytes(hexStringToByteArray(data.unsignedTransactionBytes), hexStringToByteArray(unsignedTransactionBytes)));
            // expect(data.unsignedTransactionBytes).toEqual(unsignedTransactionBytes)

            return fimksdk.api
              .post("", { requestType: "broadcastTransaction", transactionBytes: bytes })
              .then((data: any) => {
                console.log({
                  data,
                  timestamp,
                  date: timestampToDate(timestamp).toString(),
                  json
                  //localbytes: bytes
                })
                expect(data).not.toBeNull
              })
              .catch(err =>
                console.log({
                  err,
                  timestamp,
                  date: timestampToDate(timestamp).toString(),
                  t2: transaction.getJSONObject()
                })
              )
          })
          .catch(err => console.log(err))
        // }).catch(err => console.log(err))
      })
      .catch(err => console.log(err))
  })
})

function printBytes(array1, array2) {
  const print1 = augmentBytes(array1).join(",")
  const print2 = augmentBytes(array2).join(",")
  return `${print1}\n${print2}`
}

function augmentBytes(array) {
  return array.map((byte, index) => `${pad(index, 3)}:${pad(byte, 3)}`)
}

function pad(n, width) {
  let z = "0"
  n = n + ""
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n
}
