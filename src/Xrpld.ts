/*
Contains the operations that can are performed by the application.
*/
import { Client, Transaction, Wallet, validate } from '@transia/xrpl'
import {
  appTransaction,
  prepareTransactionV3,
} from './libs/xrpl-helpers/transaction'

export class Xrpld {
  // TX
  static async submitRippled(client: Client, tx: Transaction, wallet: Wallet) {
    // @ts-expect-error - leave this alone
    validate(tx)
    const txResponse = await appTransaction(client, tx, wallet, {
      hardFail: true,
      count: 1,
      delayMs: 1000,
    })
    return txResponse?.result
  }
  // TX V3
  static async submitXahaud(client: Client, tx: Transaction, wallet: Wallet) {
    await prepareTransactionV3(client, tx)
    // @ts-expect-error - leave this alone
    validate(tx)
    const txResponse = await appTransaction(client, tx, wallet, {
      hardFail: true,
      count: 1,
      delayMs: 1000,
    })
    return txResponse?.result
  }
}
