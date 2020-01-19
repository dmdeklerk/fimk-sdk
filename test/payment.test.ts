///<reference path="../node_modules/@types/jest/index.d.ts"/>

/*
To run tests in the file  test/testnet.ts  must be actual values for Testnet
 */
import "./jasmine"
import { Builder } from "../src/builder"
import { Transaction } from "../src/transaction"
import { convertToQNT, timestampToDate } from "../src/utils"
import { FimkSDK, attachment } from "../src/fimk-sdk"
import { RsAddress } from "../src/rs-address"

const fimksdk = new FimkSDK()

describe("Payment Test", () => {
  it("can do RS addresses", () => {
    const privateKey = "user1"
    const publicKey = fimksdk.crypto.secretPhraseToPublicKey(privateKey)
    const accountId = fimksdk.crypto.getAccountIdFromPublicKey(publicKey)
    const accountIdRs = "FIM-7PL3-2CC5-TKMV-6QDX2"
    const addr = new RsAddress("FIM")
    addr.set(accountIdRs)
    expect(accountId).toEqual(addr.account_id())
    return fimksdk.api.get(`?requestType=getAccountId&publicKey=${publicKey}`).then((data: any) => {
      expect(data.accountRS).toEqual(accountIdRs)
      expect(data.account).toEqual(accountId)
      expect(data.publicKey).toEqual(publicKey)
    })
  })

  it("can create a payment", () => {
    const privateKey = "user1" // FIM-7PL3-2CC5-TKMV-6QDX2
    const publicKey = fimksdk.crypto.secretPhraseToPublicKey(privateKey)
    //const recipientRs = "FIM-PDCD-QVM5-5DRW-3N6HV"
    const recipientRs = "1204580086052963717"
    const addr = new RsAddress("FIM")
    addr.set(recipientRs)
    const recipient = addr.account_id()
    const amount = "0.1"
    const fee = "0.1"

    return fimksdk.api
      .get(`?requestType=getECBlock&timestamp=0`)
      .then((data: any) => {
        // console.log(data)
        const { timestamp } = data
        const ecBlockHeight = 1,
          ecBlockId = "0"
        const params = {
          recipient: recipient,
          amountNQT: convertToQNT(amount),
          feeNQT: convertToQNT(fee),
          publicKey: publicKey,
          deadline: "1440",
          requestType: "sendMoney",
          ...data
        }

        const transaction_ = new Transaction(
          fimksdk,
          params.recipient,
          new Builder()
            .recipientId(params.recipient)
            .attachment(attachment.ORDINARY_PAYMENT)
            .amountHQT(params.amountNQT)
            .feeHQT(params.feeNQT)
            .deadline(1440)
            .timestamp(timestamp)
            .ecBlockHeight(ecBlockHeight)
            .ecBlockId(ecBlockId)
        ).publicMessage("With public message")
        return transaction_
          .sign(privateKey)
          .then(t => {
            const transaction = t.getTransaction()
            const bytes = transaction.getBytesAsHex()
            return fimksdk.api
              .post("", { requestType: "broadcastTransaction", transactionBytes: bytes })
              .then((data: any) => {
                console.log({
                  data,
                  timestamp,
                  date: timestampToDate(timestamp).toString()
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
      })
      .catch(err => console.log(err))
  })
})
