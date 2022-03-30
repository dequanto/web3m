<p align='center'>
    <h1> 0xweb </h1>
</p>

<p align='center'>
    <img src='assets/background.jpg'/>
</p>

----

[![Build Status](https://travis-ci.com/tenbits/0xweb.svg?branch=master)](https://travis-ci.com/tenbits/0xweb)
[![NPM version](https://badge.fury.io/js/0xweb.svg)](http://badge.fury.io/js/0xweb)


## Contract Package Manager

Generate TypeScript classes for contracts fetched from Etherscan and Co.

> We use [📦 dequanto library](https://github.com/tenbits/dequanto) for the wrapped classes

Here the example of generated classes: [tenbits/0xweb-sample 🔗](https://github.com/tenbits/0xweb-sample)


### Install

```bash
$ npm i 0xweb -g

# Boostrap dequanto library in cwd
$ 0xweb init

# Download sources/ABI and generate TS classes
$ 0xweb install 0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419 --name chainlink/oracle-eth
```

#### API Usage

> Use autogenerated TypeScript classes for much safer and faster backend implementation

```ts
import { ChainlinkOracleEth } from './0xweb/eth/chainlink/oracle-eth/oracle-eth';
import { Config } from '@dequanto/Config';
import { $bigint } from '@dequanto/utils/$bigint';

async function example () {
    await Config.fetch();

    let oracle = new ChainlinkOracleEth();
    let decimals = await oracle.decimals();
    let price = await oracle.latestAnswer();

    console.log(`ETH Price ${$bigint.toEther(price, decimals)}`);
    process.exit(0);
}
example();
```

### CLI Usage

> **READ** and **WRITE** to installed contracts directly from the command line

```bash
$ 0xweb contract chainlink/oracle-eth latestAnswer
```


## Config

> ❗❣️❗ We include our default KEYs for etherscan/co and infura. They are rate-limited. Please, create and insert your keys. Thank you!

```bash
$ 0xweb config --edit
```


## Various Blockchain tools

> Get the commands overview

```bash
$ 0xweb --help
$ 0xweb install --help
```

### `block`

1. Get current block info

```bash
$ web3 block get latest
```

### `token`

1. Get Token Price

```bash
$ 0xweb token price WETH
```

### `accounts`

**🔐 Ledger** feature allows to store accounts in encrypted local storage. We use local machine KEY and provided PIN in arguments to create cryptographically strong secrets 🔑 for encryption.

When calling contracts `WRITE` methods, you should first add an account to the wallet, and then use PIN to unlock the storage

```bash
$ 0xweb account add --name foo --key the_private_key --pin foobar
$ 0xweb token transfer USDC --from foo --to 0x123456 --amount 20 --pin foobar
```

🏁

----
©️ MIT License.
