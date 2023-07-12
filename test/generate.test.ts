import { decode, encode } from '@transia/xrpl'
import { saveJsonToFile } from './utils'

const decodeManifest = (str: string): string =>
  Buffer.from(str, 'base64').toString('hex').toUpperCase()
const decodeBlob = (str: string): string =>
  Buffer.from(str, 'base64').toString('utf-8')
const encodeManifest = (str: string): string =>
  Buffer.from(str, 'hex').toString('base64')
const encodeBlob = (str: string): string =>
  Buffer.from(str, 'utf-8').toString('base64')

describe('Validation: decode / encoded', () => {
  let testContext: TestCase[]
  beforeAll(async () => {
    testContext = []
  })
  afterAll(async () => {
    saveJsonToFile('generated.json', testContext)
  })

  // MANIFEST TESTS

  it('manifest encode - decode', async () => {
    const expectedManifest = {
      Sequence: 1,
      PublicKey:
        'ED74D4036C6591A4BDF9C54CEFA39B996A5DCE5F86D11FDA1874481CE9D5A1CDC1',
      SigningPubKey:
        'ED337DF9BEB6719A939E0685614E6D6C6A581C2F2862E2371B7BF08FD396D99F60',
      Signature:
        '275237D8E73384921AB7D6D538DF7F23732529540E7F553B0034571EEEE9C3A3E25E5681217EE39BFD8F160370E2BBD5F3B8E0F853F8A47E07FD4993A5386701',
      MasterSignature:
        'C38E0F2E31FE1D4B449F05F8E652119A8D31E5A20D14CBD9B01A44F50B5E4830572B06332DD9D25B87B56ECDB5A3E2082C922220A53FFB5531C74151A506CC0C',
    }
    // @ts-expect-error - leave this alone
    const xrplEncoded = encode(expectedManifest)
    const base64Encoded = encodeManifest(xrplEncoded)
    const base64Decoded = decodeManifest(base64Encoded)
    const resultManifest = decode(base64Decoded)
    expect(xrplEncoded).toBe(base64Decoded)
    expect(expectedManifest).toEqual(resultManifest)
  })
  it('Import: manifest master key did not match top level master key in unl section of xpop', async () => {
    // PublicKey - Should be ED7 is ED8
    const manifest = {
      Sequence: 1,
      PublicKey:
        'ED84D4036C6591A4BDF9C54CEFA39B996A5DCE5F86D11FDA1874481CE9D5A1CDC1',
      SigningPubKey:
        'ED337DF9BEB6719A939E0685614E6D6C6A581C2F2862E2371B7BF08FD396D99F60',
      Signature:
        '275237D8E73384921AB7D6D538DF7F23732529540E7F553B0034571EEEE9C3A3E25E5681217EE39BFD8F160370E2BBD5F3B8E0F853F8A47E07FD4993A5386701',
      MasterSignature:
        'C38E0F2E31FE1D4B449F05F8E652119A8D31E5A20D14CBD9B01A44F50B5E4830572B06332DD9D25B87B56ECDB5A3E2082C922220A53FFB5531C74151A506CC0C',
    }
    // @ts-expect-error - leave this alone
    const xrplEncoded = encode(manifest)
    const base64Encoded = encodeManifest(xrplEncoded)
    testContext.push({
      testName:
        'Import: manifest master key did not match top level master key in unl section of xpop',
      testValue: base64Encoded,
    })
  })
  it('Import: manifest signature invalid', async () => {
    // Signature - Should be 275 is 375
    const manifest = {
      Sequence: 1,
      PublicKey:
        'ED74D4036C6591A4BDF9C54CEFA39B996A5DCE5F86D11FDA1874481CE9D5A1CDC1',
      SigningPubKey:
        'ED337DF9BEB6719A939E0685614E6D6C6A581C2F2862E2371B7BF08FD396D99F60',
      Signature:
        '375237D8E73384921AB7D6D538DF7F23732529540E7F553B0034571EEEE9C3A3E25E5681217EE39BFD8F160370E2BBD5F3B8E0F853F8A47E07FD4993A5386701',
      MasterSignature:
        'C37E0F2E31FE1D4B449F05F8E652119A8D31E5A20D14CBD9B01A44F50B5E4830572B06332DD9D25B87B56ECDB5A3E2082C922220A53FFB5531C74151A506CC0C',
    }
    // @ts-expect-error - leave this alone
    const xrplEncoded = encode(manifest)
    const base64Encoded = encodeManifest(xrplEncoded)
    testContext.push({
      testName: 'Import: manifest signature invalid',
      testValue: base64Encoded,
    })
  })

  // UNL BLOB TESTS

  it('encode - decode blob)', async () => {
    const expectedJson = {
      sequence: 2,
      expiration: 741398400,
      validators: [
        {
          validation_public_key:
            'ED38BD445AFD62159620CC196C2668A26B6FBB36B099EB55B38A58C11C1204DE5C',
          manifest:
            'JAAAAAJxIe04vURa/WIVliDMGWwmaKJrb7s2sJnrVbOKWMEcEgTeXHMhAoGMNcsgUUNwKo+h7zhaXKF+HGw6XhEjoDKralkYnMjKdkcwRQIhAJ7cN4J6NdVfpnvEI/ZeuWCTvnpaJirKNFcC3zMOjgwjAiAbKI0fbXgS1RLloNhxdHhVq9ozEWVE9cIwXDN3AxqyY3ASQCt0+u/iNSDD6bXvUTtdmt4Nrtlbx4VzumTpfjRYp4lMoI/h43pUTjp7VFoXbnKWjVhqNaGm577K6J697XZ7TQE=',
        },
        {
          validation_public_key:
            'EDBEE30FAE92EEE88E1C4980D09ECFDE99A116D078EC21857DB1B47B426418E428',
          manifest:
            'JAAAAAJxIe2+4w+uku7ojhxJgNCez96ZoRbQeOwhhX2xtHtCZBjkKHMhA9SmHDxOiCMTZl5nRxrp2yjWZ5gjx2DroUFrU4nrEqU7dkcwRQIhALdEFejY+pUngli7sTvib0BmDHP7N6ikVEBI6H7IwU1zAiBdsyoSqPcC2NMqgAnHXHGdkAIwBQD1AUg9X8ZJLyfcwHASQCt1bKVzOMxRQmR3wNK4dKdofIGrxE9SjuLR6Pa8B5n08SYJ8K62ge+9a6BtZalEm/HOdcz0NAFOcycrF/CtSA4=',
        },
      ],
    }
    const expectedBlob =
      'eyJzZXF1ZW5jZSI6MiwiZXhwaXJhdGlvbiI6NzQxMzk4NDAwLCJ2YWxpZGF0b3JzIjpbeyJ2YWxpZGF0aW9uX3B1YmxpY19rZXkiOiJFRDM4QkQ0NDVBRkQ2MjE1OTYyMENDMTk2QzI2NjhBMjZCNkZCQjM2QjA5OUVCNTVCMzhBNThDMTFDMTIwNERFNUMiLCJtYW5pZmVzdCI6IkpBQUFBQUp4SWUwNHZVUmEvV0lWbGlETUdXd21hS0pyYjdzMnNKbnJWYk9LV01FY0VnVGVYSE1oQW9HTU5jc2dVVU53S28raDd6aGFYS0YrSEd3NlhoRWpvREtyYWxrWW5Naktka2N3UlFJaEFKN2NONEo2TmRWZnBudkVJL1pldVdDVHZucGFKaXJLTkZjQzN6TU9qZ3dqQWlBYktJMGZiWGdTMVJMbG9OaHhkSGhWcTlvekVXVkU5Y0l3WEROM0F4cXlZM0FTUUN0MCt1L2lOU0RENmJYdlVUdGRtdDROcnRsYng0Vnp1bVRwZmpSWXA0bE1vSS9oNDNwVVRqcDdWRm9YYm5LV2pWaHFOYUdtNTc3SzZKNjk3WFo3VFFFPSJ9LHsidmFsaWRhdGlvbl9wdWJsaWNfa2V5IjoiRURCRUUzMEZBRTkyRUVFODhFMUM0OTgwRDA5RUNGREU5OUExMTZEMDc4RUMyMTg1N0RCMUI0N0I0MjY0MThFNDI4IiwibWFuaWZlc3QiOiJKQUFBQUFKeEllMis0dyt1a3U3b2poeEpnTkNlejk2Wm9SYlFlT3doaFgyeHRIdENaQmprS0hNaEE5U21IRHhPaUNNVFpsNW5SeHJwMnlqV1o1Z2p4MkRyb1VGclU0bnJFcVU3ZGtjd1JRSWhBTGRFRmVqWStwVW5nbGk3c1R2aWIwQm1ESFA3TjZpa1ZFQkk2SDdJd1UxekFpQmRzeW9TcVBjQzJOTXFnQW5IWEhHZGtBSXdCUUQxQVVnOVg4WkpMeWZjd0hBU1FDdDFiS1Z6T014UlFtUjN3Tks0ZEtkb2ZJR3J4RTlTanVMUjZQYThCNW4wOFNZSjhLNjJnZSs5YTZCdFphbEVtL0hPZGN6ME5BRk9jeWNyRi9DdFNBND0ifV19'
    const blobStr = JSON.stringify(expectedJson)
    const encodedBlob = encodeBlob(blobStr)
    expect(encodedBlob).toBe(expectedBlob)

    const decodedBlob = decodeBlob(expectedBlob)
    const blobJson = JSON.parse(decodedBlob)
    expect(blobJson).toEqual(expectedJson)
  })
  it('Import: unl blob contained invalid validator entry, skipping', async () => {
    const expectedJson = {
      sequence: 2,
      expiration: 741398400,
      validators: {},
    }
    const blobStr = JSON.stringify(expectedJson)
    const encodedBlob = encodeBlob(blobStr)
    testContext.push({
      testName: 'Import: unl blob contained invalid validator entry, skipping',
      testValue: encodedBlob,
    })
  })
  it('Import: unl blob contained an invalid validator key (validation_public_key missing), skipping', async () => {
    const expectedJson = {
      sequence: 2,
      expiration: 741398400,
      validators: [
        {
          manifest:
            'JAAAAAJxIe04vURa/WIVliDMGWwmaKJrb7s2sJnrVbOKWMEcEgTeXHMhAoGMNcsgUUNwKo+h7zhaXKF+HGw6XhEjoDKralkYnMjKdkcwRQIhAJ7cN4J6NdVfpnvEI/ZeuWCTvnpaJirKNFcC3zMOjgwjAiAbKI0fbXgS1RLloNhxdHhVq9ozEWVE9cIwXDN3AxqyY3ASQCt0+u/iNSDD6bXvUTtdmt4Nrtlbx4VzumTpfjRYp4lMoI/h43pUTjp7VFoXbnKWjVhqNaGm577K6J697XZ7TQE=',
        },
        {
          manifest:
            'JAAAAAJxIe2+4w+uku7ojhxJgNCez96ZoRbQeOwhhX2xtHtCZBjkKHMhA9SmHDxOiCMTZl5nRxrp2yjWZ5gjx2DroUFrU4nrEqU7dkcwRQIhALdEFejY+pUngli7sTvib0BmDHP7N6ikVEBI6H7IwU1zAiBdsyoSqPcC2NMqgAnHXHGdkAIwBQD1AUg9X8ZJLyfcwHASQCt1bKVzOMxRQmR3wNK4dKdofIGrxE9SjuLR6Pa8B5n08SYJ8K62ge+9a6BtZalEm/HOdcz0NAFOcycrF/CtSA4=',
        },
      ],
    }
    const blobStr = JSON.stringify(expectedJson)
    const encodedBlob = encodeBlob(blobStr)
    testContext.push({
      testName:
        'Import: unl blob contained an invalid validator key (), skipping',
      testValue: encodedBlob,
    })
  })
  it('Import: unl blob contained invalid validator entry (validation_public_key type), skipping', async () => {
    const expectedJson = {
      sequence: 2,
      expiration: 741398400,
      validators: [
        {
          validation_public_key: 1,
          manifest:
            'JAAAAAJxIe04vURa/WIVliDMGWwmaKJrb7s2sJnrVbOKWMEcEgTeXHMhAoGMNcsgUUNwKo+h7zhaXKF+HGw6XhEjoDKralkYnMjKdkcwRQIhAJ7cN4J6NdVfpnvEI/ZeuWCTvnpaJirKNFcC3zMOjgwjAiAbKI0fbXgS1RLloNhxdHhVq9ozEWVE9cIwXDN3AxqyY3ASQCt0+u/iNSDD6bXvUTtdmt4Nrtlbx4VzumTpfjRYp4lMoI/h43pUTjp7VFoXbnKWjVhqNaGm577K6J697XZ7TQE=',
        },
        {
          validation_public_key: 1,
          manifest:
            'JAAAAAJxIe2+4w+uku7ojhxJgNCez96ZoRbQeOwhhX2xtHtCZBjkKHMhA9SmHDxOiCMTZl5nRxrp2yjWZ5gjx2DroUFrU4nrEqU7dkcwRQIhALdEFejY+pUngli7sTvib0BmDHP7N6ikVEBI6H7IwU1zAiBdsyoSqPcC2NMqgAnHXHGdkAIwBQD1AUg9X8ZJLyfcwHASQCt1bKVzOMxRQmR3wNK4dKdofIGrxE9SjuLR6Pa8B5n08SYJ8K62ge+9a6BtZalEm/HOdcz0NAFOcycrF/CtSA4=',
        },
      ],
    }
    const blobStr = JSON.stringify(expectedJson)
    const encodedBlob = encodeBlob(blobStr)
    testContext.push({
      testName:
        'Import: unl blob contained an invalid validator key (validation_public_key type), skipping',
      testValue: encodedBlob,
    })
  })
  it('Import: unl blob contained invalid validator entry (manifest missing), skipping', async () => {
    const expectedJson = {
      sequence: 2,
      expiration: 741398400,
      validators: [
        {
          validation_public_key:
            'ED38BD445AFD62159620CC196C2668A26B6FBB36B099EB55B38A58C11C1204DE5C',
        },
        {
          validation_public_key:
            'EDBEE30FAE92EEE88E1C4980D09ECFDE99A116D078EC21857DB1B47B426418E428',
        },
      ],
    }
    const blobStr = JSON.stringify(expectedJson)
    const encodedBlob = encodeBlob(blobStr)
    testContext.push({
      testName:
        'Import: unl blob contained invalid validator entry (manifest missing), skipping',
      testValue: encodedBlob,
    })
  })
  it('Import: unl blob contained invalid validator entry (manifest type), skipping', async () => {
    const expectedJson = {
      sequence: 2,
      expiration: 741398400,
      validators: [
        {
          validation_public_key:
            'ED38BD445AFD62159620CC196C2668A26B6FBB36B099EB55B38A58C11C1204DE5C',
          manifest: 1,
        },
        {
          validation_public_key:
            'EDBEE30FAE92EEE88E1C4980D09ECFDE99A116D078EC21857DB1B47B426418E428',
          manifest: 1,
        },
      ],
    }
    const blobStr = JSON.stringify(expectedJson)
    const encodedBlob = encodeBlob(blobStr)
    testContext.push({
      testName:
        'Import: unl blob contained invalid validator entry (manifest type), skipping',
      testValue: encodedBlob,
    })
  })
  it('Import: unl blob json (after base64 decoding) lacked required field (sequence) and/or types', async () => {
    const expectedJson = {
      expiration: 741398400,
      validators: [
        {
          validation_public_key:
            'ED38BD445AFD62159620CC196C2668A26B6FBB36B099EB55B38A58C11C1204DE5C',
          manifest: 1,
        },
        {
          validation_public_key:
            'EDBEE30FAE92EEE88E1C4980D09ECFDE99A116D078EC21857DB1B47B426418E428',
          manifest: 1,
        },
      ],
    }
    const blobStr = JSON.stringify(expectedJson)
    const encodedBlob = encodeBlob(blobStr)
    testContext.push({
      testName:
        'Import: unl blob json (after base64 decoding) lacked required field (sequence) and/or types',
      testValue: encodedBlob,
    })
  })
  it('Import: unl blob json (after base64 decoding) lacked required field (sequence) and/or types', async () => {
    const expectedJson = {
      sequence: '2',
      expiration: 741398400,
      validators: [
        {
          validation_public_key:
            'ED38BD445AFD62159620CC196C2668A26B6FBB36B099EB55B38A58C11C1204DE5C',
          manifest: 1,
        },
        {
          validation_public_key:
            'EDBEE30FAE92EEE88E1C4980D09ECFDE99A116D078EC21857DB1B47B426418E428',
          manifest: 1,
        },
      ],
    }
    const blobStr = JSON.stringify(expectedJson)
    const encodedBlob = encodeBlob(blobStr)
    testContext.push({
      testName:
        'Import: unl blob json (after base64 decoding) lacked required field (sequence) and/or types',
      testValue: encodedBlob,
    })
  })
  it('Import: unl blob json (after base64 decoding) lacked required field (expiration) and/or types', async () => {
    const expectedJson = {
      sequence: 2,
      validators: [
        {
          validation_public_key:
            'ED38BD445AFD62159620CC196C2668A26B6FBB36B099EB55B38A58C11C1204DE5C',
          manifest: 1,
        },
        {
          validation_public_key:
            'EDBEE30FAE92EEE88E1C4980D09ECFDE99A116D078EC21857DB1B47B426418E428',
          manifest: 1,
        },
      ],
    }
    const blobStr = JSON.stringify(expectedJson)
    const encodedBlob = encodeBlob(blobStr)
    testContext.push({
      testName:
        'Import: unl blob json (after base64 decoding) lacked required field (expiration) and/or types',
      testValue: encodedBlob,
    })
  })
  it('Import: unl blob json (after base64 decoding) lacked required field (expiration) and/or types', async () => {
    const expectedJson = {
      sequence: 2,
      expiration: '741398400',
      validators: [
        {
          validation_public_key:
            'ED38BD445AFD62159620CC196C2668A26B6FBB36B099EB55B38A58C11C1204DE5C',
          manifest: 1,
        },
        {
          validation_public_key:
            'EDBEE30FAE92EEE88E1C4980D09ECFDE99A116D078EC21857DB1B47B426418E428',
          manifest: 1,
        },
      ],
    }
    const blobStr = JSON.stringify(expectedJson)
    const encodedBlob = encodeBlob(blobStr)
    testContext.push({
      testName:
        'Import: unl blob json (after base64 decoding) lacked required field (expiration) and/or types',
      testValue: encodedBlob,
    })
  })

  // TRANSACTION TESTS

  it('decode blob tx', async () => {
    const decoded = decode(
      '12000322000000002400000002201B00000069201D0000535968400000003B9ACA0073210388935426E0D08083314842EDFBB2D517BD47699F9A4527318A8E10468C97C0527446304402200E40CA821A7BFE347448FFA6540F67C7FFBF0287756D324DFBADCEDE2B23782C02207BE1B1294F1A1D5AC21990740B78F9C0693431237D6E07FE84228082986E50FF8114AE123A8556F3CF91154711376AFB0F894F832B3D'
    )
    console.log(JSON.stringify(decoded, null, 4))
  })
  it('Import: attempted to import xpop containing an emitted or pseudo txn.', async () => {
    const txJson = {
      TransactionType: 'AccountSet',
      Flags: 0,
      Sequence: 2,
      LastLedgerSequence: 105,
      OperationLimit: 21337,
      Fee: '1000000000',
      SigningPubKey:
        '0388935426E0D08083314842EDFBB2D517BD47699F9A4527318A8E10468C97C052',
      TxnSignature:
        '304402200E40CA821A7BFE347448FFA6540F67C7FFBF0287756D324DFBADCEDE2B23782C02207BE1B1294F1A1D5AC21990740B78F9C0693431237D6E07FE84228082986E50FF',
      Account: 'rG1QQv2nh2gr7RCZ1P8YYcBUKCCN633jCn',
      EmitDetails: {
        EmitBurden: '1',
        EmitCallback: 'rG1QQv2nh2gr7RCZ1P8YYcBUKCCN633jCn',
        EmitGeneration: 1,
        EmitHookHash:
          '745F398EEE9E6B294BBE6A5681A31A6107243D19384E277B5A7B1F23B8C83DE7',
        EmitNonce:
          '207064D81954F6A7225A8BAADF5A3042016BFB87355D1D0AFEDBAA8FB22F9835',
        EmitParentTxnID:
          '2200676F4B9B45C5ADE9DE3C8CD01200CB12DFF8C792220DB088FE615BE5C290',
      },
    }
    // @ts-expect-error - leave this alone
    const encoded = encode(txJson)
    testContext.push({
      testName:
        'Import: attempted to import xpop containing an emitted or pseudo txn.',
      testValue: encoded,
    })
  })
  it('Import: attempted to import xpop containing a txn with a sfNetworkID field.', async () => {
    const txJson = {
      TransactionType: 'AccountSet',
      Flags: 0,
      Sequence: 2,
      LastLedgerSequence: 105,
      NetworkID: 21337,
      OperationLimit: 21337,
      Fee: '1000000000',
      SigningPubKey:
        '0388935426E0D08083314842EDFBB2D517BD47699F9A4527318A8E10468C97C052',
      TxnSignature:
        '304402200E40CA821A7BFE347448FFA6540F67C7FFBF0287756D324DFBADCEDE2B23782C02207BE1B1294F1A1D5AC21990740B78F9C0693431237D6E07FE84228082986E50FF',
      Account: 'rG1QQv2nh2gr7RCZ1P8YYcBUKCCN633jCn',
    }
    // @ts-expect-error - leave this alone
    const encoded = encode(txJson)
    testContext.push({
      testName:
        'Import: attempted to import xpop containing a txn with a sfNetworkID field.',
      testValue: encoded,
    })
  })
  it('Import: OperationLimit missing from inner xpop txn. outer txid:', async () => {
    const txJson = {
      TransactionType: 'AccountSet',
      Flags: 0,
      Sequence: 2,
      LastLedgerSequence: 108,
      Fee: '1000000000',
      SigningPubKey:
        'EDA8D46E11FD5D2082A4E6FF3039EB6259FBC2334983D015FC62ECAD0AE4A96C74',
      TxnSignature:
        '549A370E68DBB1947419D4CCDF90CAE0BCA9121593ECC21B3C79EF0F232EB4375F95F1EBCED78B94D09838B5E769D43F041019ADEF3EC206AD3C5177C519560F',
      Account: 'rG1QQv2nh2gr7RCZ1P8YYcBUKCCN633jCn',
    }
    // @ts-expect-error - leave this alone
    const encoded = encode(txJson)
    testContext.push({
      testName:
        'Import: OperationLimit missing from inner xpop txn. outer txid:',
      testValue: encoded,
    })
  })
  it('Import: Wrong network ID for OperationLimit in inner txn. outer txid:', async () => {
    const txJson = {
      TransactionType: 'AccountSet',
      Flags: 0,
      Sequence: 2,
      LastLedgerSequence: 108,
      OperationLimit: 21338,
      Fee: '1000000000',
      SigningPubKey:
        'EDA8D46E11FD5D2082A4E6FF3039EB6259FBC2334983D015FC62ECAD0AE4A96C74',
      TxnSignature:
        '549A370E68DBB1947419D4CCDF90CAE0BCA9121593ECC21B3C79EF0F232EB4375F95F1EBCED78B94D09838B5E769D43F041019ADEF3EC206AD3C5177C519560F',
      Account: 'rG1QQv2nh2gr7RCZ1P8YYcBUKCCN633jCn',
    }
    // @ts-expect-error - leave this alone
    const encoded = encode(txJson)
    testContext.push({
      testName:
        'Import: Wrong network ID for OperationLimit in inner txn. outer txid:',
      testValue: encoded,
    })
  })
  it('Import: inner txn must be an AccountSet, SetRegularKey or SignerListSet transaction.', async () => {
    const txJson = {
      TransactionType: 'Invoke',
      Flags: 0,
      Sequence: 2,
      LastLedgerSequence: 108,
      OperationLimit: 21337,
      Fee: '1000000000',
      SigningPubKey:
        'EDA8D46E11FD5D2082A4E6FF3039EB6259FBC2334983D015FC62ECAD0AE4A96C74',
      TxnSignature:
        '549A370E68DBB1947419D4CCDF90CAE0BCA9121593ECC21B3C79EF0F232EB4375F95F1EBCED78B94D09838B5E769D43F041019ADEF3EC206AD3C5177C519560F',
      Account: 'rG1QQv2nh2gr7RCZ1P8YYcBUKCCN633jCn',
    }
    // @ts-expect-error - leave this alone
    const encoded = encode(txJson)
    testContext.push({
      testName:
        'Import: inner txn must be an AccountSet, SetRegularKey or SignerListSet transaction.',
      testValue: encoded,
    })
  })
  // it('Import: outer and inner txns were (multi) signed with different keys.', async () => {
  //   const txJson = {
  //     TransactionType: 'AccountSet',
  //     Flags: 0,
  //     Sequence: 2,
  //     LastLedgerSequence: 108,
  //     OperationLimit: 21337,
  //     Fee: '1000000000',
  //     SigningPubKey:
  //       'EDA8D46E11FD5D2082A4E6FF3039EB6259FBC2334983D015FC62ECAD0AE4A96C74',
  //     TxnSignature:
  //       '549A370E68DBB1947419D4CCDF90CAE0BCA9121593ECC21B3C79EF0F232EB4375F95F1EBCED78B94D09838B5E769D43F041019ADEF3EC206AD3C5177C519560F',
  //     Account: 'rG1QQv2nh2gr7RCZ1P8YYcBUKCCN633jCn',
  //   }
  //   // @ts-expect-error - leave this alone
  //   const encoded = encode(txJson)
  //   testContext.push({
  //     testName:
  //       'Import: inner txn must be an AccountSet, SetRegularKey or SignerListSet transaction.',
  //     testValue: encoded,
  //   })
  // })
  it('Import: outer and inner txns were signed with different keys.', async () => {
    // SigningPubKey - GOOD: EDA...
    // SigningPubKey - BAD: EBA...
    const txJson = {
      TransactionType: 'AccountSet',
      Flags: 0,
      Sequence: 2,
      LastLedgerSequence: 108,
      OperationLimit: 21337,
      Fee: '1000000000',
      SigningPubKey:
        'EBA8D46E11FD5D2082A4E6FF3039EB6259FBC2334983D015FC62ECAD0AE4A96C74',
      TxnSignature:
        '549A370E68DBB1947419D4CCDF90CAE0BCA9121593ECC21B3C79EF0F232EB4375F95F1EBCED78B94D09838B5E769D43F041019ADEF3EC206AD3C5177C519560F',
      Account: 'rG1QQv2nh2gr7RCZ1P8YYcBUKCCN633jCn',
    }
    // @ts-expect-error - leave this alone
    const encoded = encode(txJson)
    testContext.push({
      testName: 'Import: outer and inner txns were signed with different keys.',
      testValue: encoded,
    })
  })
  it('Import: xpop inner txn did not contain a sequence number or fee: sequence', async () => {
    const txJson = {
      TransactionType: 'Invoke',
      Flags: 0,
      Sequence: 2,
      LastLedgerSequence: 108,
      OperationLimit: 21337,
      Fee: '1000000000',
      SigningPubKey:
        'EDA8D46E11FD5D2082A4E6FF3039EB6259FBC2334983D015FC62ECAD0AE4A96C74',
      TxnSignature:
        '549A370E68DBB1947419D4CCDF90CAE0BCA9121593ECC21B3C79EF0F232EB4375F95F1EBCED78B94D09838B5E769D43F041019ADEF3EC206AD3C5177C519560F',
      Account: 'rG1QQv2nh2gr7RCZ1P8YYcBUKCCN633jCn',
    }
    // @ts-expect-error - leave this alone
    const encoded = encode(txJson)
    testContext.push({
      testName:
        'Import: xpop inner txn did not contain a sequence number or fee: sequence',
      testValue: encoded,
    })
  })
  it('Import: xpop inner txn did not contain a sequence number or fee: fee', async () => {
    const txJson = {
      TransactionType: 'Invoke',
      Flags: 0,
      Sequence: 2,
      LastLedgerSequence: 108,
      OperationLimit: 21337,
      SigningPubKey:
        'EDA8D46E11FD5D2082A4E6FF3039EB6259FBC2334983D015FC62ECAD0AE4A96C74',
      TxnSignature:
        '549A370E68DBB1947419D4CCDF90CAE0BCA9121593ECC21B3C79EF0F232EB4375F95F1EBCED78B94D09838B5E769D43F041019ADEF3EC206AD3C5177C519560F',
      Account: 'rG1QQv2nh2gr7RCZ1P8YYcBUKCCN633jCn',
    }
    // @ts-expect-error - leave this alone
    const encoded = encode(txJson)
    testContext.push({
      testName:
        'Import: xpop inner txn did not contain a sequence number or fee: fee',
      testValue: encoded,
    })
  })

  // META TESTS

  it('meta encode / decode', async () => {
    const metaEndoded =
      '201C00000006F8E5110061250000005655463E39A6AFDDA77DBF3591BF3C2A4BE9BB8D9113BF6D0797EB403C3D0D894FEF5692FA6A9FC8EA6018D5D16532D7795C91BFB0831355BDFDA177E86C8BF997985FE624000000026240000000773593F4E1E7220000000024000000032D0000000162400000003B9AC9F48114AE123A8556F3CF91154711376AFB0F894F832B3DE1E1F1031000'
    const metaStrJson = {
      TransactionIndex: 6,
      AffectedNodes: [
        {
          ModifiedNode: {
            LedgerEntryType: 'AccountRoot',
            PreviousTxnLgrSeq: 86,
            PreviousTxnID:
              '463E39A6AFDDA77DBF3591BF3C2A4BE9BB8D9113BF6D0797EB403C3D0D894FEF',
            LedgerIndex:
              '92FA6A9FC8EA6018D5D16532D7795C91BFB0831355BDFDA177E86C8BF997985F',
            PreviousFields: {
              Sequence: 2,
              Balance: '1999999988',
            },
            FinalFields: {
              Flags: 0,
              Sequence: 3,
              OwnerCount: 1,
              Balance: '999999988',
              Account: 'rG1QQv2nh2gr7RCZ1P8YYcBUKCCN633jCn',
            },
          },
        },
      ],
      TransactionResult: 'tesSUCCESS',
    }
    // // @ts-expect-error - leave this alone
    // const encoded = encode(metaStrJson)
    console.log(JSON.stringify(decode(metaEndoded), null, 4))
    console.log(metaStrJson)

    // JSON.stringify(decode(metaEndoded), null, 4)
    // expect(encoded).toBe(metaEndoded)
  })
  it('Import: inner txn did not have a tesSUCCESS or tec result', async () => {
    const metaStrJson = {
      TransactionIndex: 6,
      AffectedNodes: [
        {
          ModifiedNode: {
            LedgerEntryType: 'AccountRoot',
            PreviousTxnLgrSeq: 86,
            PreviousTxnID:
              '463E39A6AFDDA77DBF3591BF3C2A4BE9BB8D9113BF6D0797EB403C3D0D894FEF',
            LedgerIndex:
              '92FA6A9FC8EA6018D5D16532D7795C91BFB0831355BDFDA177E86C8BF997985F',
            PreviousFields: {
              Sequence: 2,
              Balance: '1999999988',
            },
            FinalFields: {
              Flags: 0,
              Sequence: 3,
              OwnerCount: 1,
              Balance: '999999988',
              Account: 'rG1QQv2nh2gr7RCZ1P8YYcBUKCCN633jCn',
            },
          },
        },
      ],
    }
    // @ts-expect-error - leave this alone
    const encoded = encode(metaStrJson)
    testContext.push({
      testName: 'Import: inner txn did not have a tesSUCCESS or tec result',
      testValue: encoded,
    })
  })
  it('Import: inner txn lacked transaction result', async () => {
    const metaStrJson = {
      TransactionIndex: 6,
      AffectedNodes: [
        {
          ModifiedNode: {
            LedgerEntryType: 'AccountRoot',
            PreviousTxnLgrSeq: 86,
            PreviousTxnID:
              '463E39A6AFDDA77DBF3591BF3C2A4BE9BB8D9113BF6D0797EB403C3D0D894FEF',
            LedgerIndex:
              '92FA6A9FC8EA6018D5D16532D7795C91BFB0831355BDFDA177E86C8BF997985F',
            PreviousFields: {
              Sequence: 2,
              Balance: '1999999988',
            },
            FinalFields: {
              Flags: 0,
              Sequence: 3,
              OwnerCount: 1,
              Balance: '999999988',
              Account: 'rG1QQv2nh2gr7RCZ1P8YYcBUKCCN633jCn',
            },
          },
        },
      ],
      TransactionResult: 'tefBAD_AUTH',
    }
    // @ts-expect-error - leave this alone
    const encoded = encode(metaStrJson)
    testContext.push({
      testName: 'Import: inner txn lacked transaction result',
      testValue: encoded,
    })
  })

  // INNER VALIDATION TESTS

  it('Import: decode inner validation', async () => {
    const decoded = decode(
      '22800000012600000056292C0D012051B0829745427488A59B6525231634DC327F91589EB03F469ABF1C3CA32070625A501790AD68E9045001FDEED03F0AC8277F11F6E46E0ABD2DC38B1F8240D56B22E4F2732103D4A61C3C4E882313665E67471AE9DB28D6679823C760EBA1416B5389EB12A53B76463044022072427336342AE80B7AAE407CEA611B0DA680426B3C5894E52EE2D23641D09A7302203B131B68D3C5B6C5482312CC7D90D2CE131A9C46458967F2F98688B726C16719'
    )
    console.log(JSON.stringify(decoded, null, 4))
  })
  it('Import: validation message was not for computed ledger hash', async () => {
    // LedgerHash - GOOD: B0829745427488A59B6525231634DC327F91589EB03F469ABF1C3CA32070625A
    // LedgerHash - BAD: A0829745427488A59B6525231634DC327F91589EB03F469ABF1C3CA32070625A
    const iValidationStrJson = {
      Flags: 2147483649,
      LedgerSequence: 86,
      SigningTime: 739049760,
      LedgerHash:
        'A0829745427488A59B6525231634DC327F91589EB03F469ABF1C3CA32070625A',
      ConsensusHash:
        '90AD68E9045001FDEED03F0AC8277F11F6E46E0ABD2DC38B1F8240D56B22E4F2',
      SigningPubKey:
        '03D4A61C3C4E882313665E67471AE9DB28D6679823C760EBA1416B5389EB12A53B',
      Signature:
        '3044022072427336342AE80B7AAE407CEA611B0DA680426B3C5894E52EE2D23641D09A7302203B131B68D3C5B6C5482312CC7D90D2CE131A9C46458967F2F98688B726C16719',
    }
    // @ts-expect-error - leave this alone
    const encoded = encode(iValidationStrJson)
    testContext.push({
      testName: 'Import: validation message was not for computed ledger hash',
      testValue: encoded,
    })
  })
  it('Import: validation inside xpop was not signed with a signing key we recognise', async () => {
    // SigningPubKey - GOOD: 03D...
    // SigningPubKey - BAD: 03E...
    const iValidationStrJson = {
      Flags: 2147483649,
      LedgerSequence: 86,
      SigningTime: 739049760,
      LedgerHash:
        'B0829745427488A59B6525231634DC327F91589EB03F469ABF1C3CA32070625A',
      ConsensusHash:
        '90BD68E9045001FDEED03F0AC8277F11F6E46E0ABD2DC38B1F8240D56B22E4F2',
      SigningPubKey:
        '03E4A61C3C4E882313665E67471AE9DB28D6679823C760EBA1416B5389EB12A53B',
      Signature:
        '3054022072427336342AE80B7AAE407CEA611B0DA680426B3C5894E52EE2D23641D09A7302203B131B68D3C5B6C5482312CC7D90D2CE131A9C46458967F2F98688B726C16719',
    }
    // @ts-expect-error - leave this alone
    const encoded = encode(iValidationStrJson)
    testContext.push({
      testName:
        'Import: validation inside xpop was not signed with a signing key we recognise',
      testValue: encoded,
    })
  })
  it('Import: validation inside xpop was not correctly signed', async () => {
    // Signature - GOOD: 304...
    // Signature - BAD: 305...
    const iValidationStrJson = {
      Flags: 2147483649,
      LedgerSequence: 86,
      SigningTime: 739049760,
      LedgerHash:
        'B0829745427488A59B6525231634DC327F91589EB03F469ABF1C3CA32070625A',
      ConsensusHash:
        '90BD68E9045001FDEED03F0AC8277F11F6E46E0ABD2DC38B1F8240D56B22E4F2',
      SigningPubKey:
        '03D4A61C3C4E882313665E67471AE9DB28D6679823C760EBA1416B5389EB12A53B',
      Signature:
        '3054022072427336342AE80B7AAE407CEA611B0DA680426B3C5894E52EE2D23641D09A7302203B131B68D3C5B6C5482312CC7D90D2CE131A9C46458967F2F98688B726C16719',
    }
    // @ts-expect-error - leave this alone
    const encoded = encode(iValidationStrJson)
    testContext.push({
      testName: 'Import: validation inside xpop was not correctly signed',
      testValue: encoded,
    })
  })
})
