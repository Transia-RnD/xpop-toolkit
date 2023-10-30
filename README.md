# XPOP Toolkit Repository

This repository contains the XPOP Toolkit, a library for using the XPOP features, and an XPOP playground to demo the b2m sdk.

## Structure

The repository is divided into two main parts:

1. `xpop-toolkit-main`: This is the main toolkit that provides the XPOP features. It contains the source code, tests, and build scripts for the toolkit.

2. `example`: This is a playground for demonstrating the use of the XPOP toolkit. It contains example scripts and configuration files.

## Installation

To install the dependencies for the toolkit and the example, run `npm install` in the respective directories.

## Usage

### XPOP Toolkit

The toolkit provides several npm scripts for building, testing, and linting the code:

- `npm run build`: Compiles the TypeScript code to JavaScript.
- `npm run test`: Runs the unit and integration tests.
- `npm run lint`: Lints the code using ESLint.

### XPOP Playground

The playground provides several npm scripts for running the examples:

- `npm run mini-network`: Runs the mini network example.
- `npm run testnet`: Runs the testnet example.

## Mini Network

The mini network is a local network for testing and development purposes. It consists of two separate Docker networks for the Burn Chain and the Mint Chain. Each chain has its own explorer running in a Docker container, accessible on the following ports:

- Burn Chain Explorer: http://localhost:3000
- Mint Chain Explorer: http://localhost:3001

The initial state of each chain is defined in a genesis file. If you need to modify the genesis file, you can do so by editing the `genesis.json` file for each chain.

## XPOP


```
docker run \
  --name xpop \
  --rm -i \
  -v $(pwd)/store:/usr/src/app/store \
  -p 4000:4000 \
    -e EVENT_SOCKET_PORT=4000 \
    -e URL_PREFIX=http://localhost:4000 \
    -e NETWORKID=1 \
    -e UNLURL=http://burn_vl/vl.json \
    -e UNLKEY=ED74D4036C6591A4BDF9C54CEFA39B996A5DCE5F86D11FDA1874481CE9D5A1CDC1 \
    -e NODES=ws://localhost:6008 \
    -e FIELDSREQUIRED=Fee,Account,OperationLimit \
    -e NOVALIDATIONLOG=true \
    -e NOELIGIBLEFULLTXLOG=true \
  wietsewind/xpop:latest
```

## License

This project is licensed under the ISC license. For more information, see the `LICENSE` file in the repository.

## Author

The XPOP Toolkit was created by Denis Angell. You can find more of his work on [GitHub](https://github.com/dangell7).