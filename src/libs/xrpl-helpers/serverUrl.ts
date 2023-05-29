// /* eslint-disable node/no-process-env -- needed to find standalone connection */
const BURN_HOST = process.env.BURN_HOST ?? '0.0.0.0'
const BURN_PORT = process.env.BURN_PORT ?? '6006'
const MINT_HOST = process.env.MINT_HOST ?? '0.0.0.0'
const MINT_PORT = process.env.MINT_PORT ?? '6016'
export const burnUrl = `ws://${BURN_HOST}:${BURN_PORT}`
export const mintUrl = `ws://${MINT_HOST}:${MINT_PORT}`
