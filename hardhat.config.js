const { utils } = require("ethers");
const fs = require("fs");
const chalk = require("chalk");




const { isAddress, getAddress, formatUnits, parseUnits } = utils;

/*
      📡 This is where you configure your deploy configuration for 🏗 scaffold-eth

      check out `packages/scripts/deploy.js` to customize your deployment

      out of the box it will auto deploy anything in the `contracts` folder and named *.sol
      plus it will use *.args for constructor args
*/

//
// Select the network you want to deploy to here:
//
const defaultNetwork = "mumbai";

function mnemonic() {
  try {
    return fs.readFileSync("./mnemonic.txt").toString().trim();
  } catch (e) {
    if (defaultNetwork !== "localhost") {
      console.log("☢️ WARNING: No mnemonic file created for a deploy account. Try `yarn run generate` and then `yarn run account`.")
    }
  }
  return "";
}

module.exports = {
  defaultNetwork,

  // don't forget to set your provider like:
  // REACT_APP_PROVIDER=https://dai.poa.network in packages/react-app/.env
  // (then your frontend will talk to your contracts on the live network!)
  // (you will need to restart the `yarn run start` dev server after editing the .env)

  networks: {
    localhost: {
      url: "http://localhost:7545",
      /*
        notice no mnemonic here? it will just use account 0 of the hardhat node to deploy
        (you can put in a mnemonic here to set the deployer locally)
      */
    },
    matic: {
      url: 'https://polygon-rpc.com/',
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    kovan: {
      url: 'https://kovan.infura.io/v3/779285194bd146b48538d269d1332f20',
      gasPrice: 1000000000,
      accounts: {
        mnemonic: mnemonic(),
      }
    },
    mumbai: {
      url: 'https://matic-mumbai.chainstacklabs.com/',
      gasPrice: 10000000000,
      accounts: {
        mnemonic: mnemonic(),
      }
    }
  },
  mocha: {
    timeout: 200000
  },
  solidity: {
    compilers: [
      {
        version: "0.6.10",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      {
        version: "0.6.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      {
        version: "0.6.0",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }
    ],

  },
  contractSizer: {
    alphaSort: true,
    runOnCompile: true,
    disambiguatePaths: false,
  },

  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: "PSW8C433Q667DVEX5BCRMGNAH9FSGFZ7Q8"
  },
  linkAddress: {
    matic: "0xb0897686c545045afc77cf20ec7a532e3120e0f1",
    maticTestnet: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB"
  },
  oracleAddress: {
    matic: "0xc8D925525CA8759812d0c299B90247917d4d4b7C",
    maticTestnet: "0xc8D925525CA8759812d0c299B90247917d4d4b7C"
  },
  ditoOracleAddress: {
    matic: "",
    maticTestnet: "0x3A0678DcfFe2465cDD289563570979eCA23bF3AF"
  },
  oracleNodeAddress: {
    matic: "",
    maticTestnet: "0x24485A6A978d32d04713f3dFdED0C8a29797812F"
  },
  bytesJobId: {
    matic: "f0da6c15faf54a3187ac63001f0dab1e",
    maticTestnet: "a7330d0b4b964c05abc66a26307047c0"
  },
  uintJobId: {
    matic: "ac9996ab9e1c4c968be4fce46b3711f9",
    maticTestnet: "bbf0badad29d49dc887504bacfbb905b"
  },
  ditoUintJobId: {
    matic: "",
    maticTestnet: "2736adbcf60d4575bec1f6e4e3aeb3b7"
  },
  vrfCoordinatorAddress: {
    matic: "0x3d2341ADb2D31f1c5530cDC622016af293177AE0",
    maticTestnet: "0x8C7382F9D8f56b33781fE506E897a4F1e2d17255"
  },
  keyHash: {
    matic: "0xf86195cf7690c55907b2b611ebb7343a6f649bff128701cc542f0569e2c549da",
    maticTestnet: "0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4"
  },
  skillWalletAddress: {
    matic: "0x14DEF8Be678589dd1445A46Fc5bE925d479694B9",
    maticTestnet: "0xB0aD4014Ee360A2c7c668F2883ed73ae6780c817"
  },
  communityRegistryAddress: {
    matic: "0xB4Dcc7cE6C7e8E5595fBC708b09123A86360e3e2",
    maticTestnet: "0xAED585cE5F23D34784De65534500d0a0CD119ef3"
  },
  communityAddress: {
    matic: "0x1cfe58e4319518400Dc83043C2Edd53ACEE9C07b",
    maticTestnet: "0x280971a2bd5D2506d11AC8ce2d3FCaB58A267AE4"
  }

};

const DEBUG = false;

function debug(text) {
  if (DEBUG) {
    console.log(text);
  }
}

task("wallet", "Create a wallet (pk) link", async (_, { ethers }) => {
  const randomWallet = ethers.Wallet.createRandom()
  const privateKey = randomWallet._signingKey().privateKey
  console.log("🔐 WALLET Generated as " + randomWallet.address + "")
  console.log("🔗 http://localhost:3000/pk#" + privateKey)
});


task("fundedwallet", "Create a wallet (pk) link and fund it with deployer?")
  .addOptionalParam("amount", "Amount of ETH to send to wallet after generating")
  .addOptionalParam("url", "URL to add pk to")
  .setAction(async (taskArgs, { network, ethers }) => {

    const randomWallet = ethers.Wallet.createRandom()
    const privateKey = randomWallet._signingKey().privateKey
    console.log("🔐 WALLET Generated as " + randomWallet.address + "")
    let url = taskArgs.url ? taskArgs.url : "http://localhost:3000"

    let localDeployerMnemonic
    try {
      localDeployerMnemonic = fs.readFileSync("./mnemonic.txt")
      localDeployerMnemonic = localDeployerMnemonic.toString().trim()
    } catch (e) {
      /* do nothing - this file isn't always there */
    }

    let amount = taskArgs.amount ? taskArgs.amount : "0.01"
    const tx = {
      to: randomWallet.address,
      value: ethers.utils.parseEther(amount)
    };

    //SEND USING LOCAL DEPLOYER MNEMONIC IF THERE IS ONE
    // IF NOT SEND USING LOCAL HARDHAT NODE:
    if (localDeployerMnemonic) {
      let deployerWallet = new ethers.Wallet.fromMnemonic(localDeployerMnemonic)
      deployerWallet = deployerWallet.connect(ethers.provider)
      console.log("💵 Sending " + amount + " ETH to " + randomWallet.address + " using deployer account");
      let sendresult = await deployerWallet.sendTransaction(tx)
      console.log("\n" + url + "/pk#" + privateKey + "\n")
      return
    } else {
      console.log("💵 Sending " + amount + " ETH to " + randomWallet.address + " using local node");
      console.log("\n" + url + "/pk#" + privateKey + "\n")
      return send(ethers.provider.getSigner(), tx);
    }

  });


task("generate", "Create a mnemonic for builder deploys", async (_, { ethers }) => {
  const bip39 = require("bip39")
  const hdkey = require('ethereumjs-wallet/hdkey');
  const mnemonic = bip39.generateMnemonic()
  if (DEBUG) console.log("mnemonic", mnemonic)
  const seed = await bip39.mnemonicToSeed(mnemonic)
  if (DEBUG) console.log("seed", seed)
  const hdwallet = hdkey.fromMasterSeed(seed);
  const wallet_hdpath = "m/44'/60'/0'/0/";
  const account_index = 0
  let fullPath = wallet_hdpath + account_index
  if (DEBUG) console.log("fullPath", fullPath)
  const wallet = hdwallet.derivePath(fullPath).getWallet();
  const privateKey = "0x" + wallet._privKey.toString('hex');
  if (DEBUG) console.log("privateKey", privateKey)
  var EthUtil = require('ethereumjs-util');
  const address = "0x" + EthUtil.privateToAddress(wallet._privKey).toString('hex')
  console.log("🔐 Account Generated as " + address + " and set as mnemonic in packages/hardhat")
  console.log("💬 Use 'yarn run account' to get more information about the deployment account.")

  fs.writeFileSync("./" + address + ".txt", mnemonic.toString())
  fs.writeFileSync("./mnemonic.txt", mnemonic.toString())
});

task("mineContractAddress", "Looks for a deployer account that will give leading zeros")
  .addParam("searchFor", "String to search for")
  .setAction(async (taskArgs, { network, ethers }) => {

    let contract_address = ""
    let address;

    const bip39 = require("bip39")
    const hdkey = require('ethereumjs-wallet/hdkey');

    let mnemonic = ""
    while (contract_address.indexOf(taskArgs.searchFor) != 0) {

      mnemonic = bip39.generateMnemonic()
      if (DEBUG) console.log("mnemonic", mnemonic)
      const seed = await bip39.mnemonicToSeed(mnemonic)
      if (DEBUG) console.log("seed", seed)
      const hdwallet = hdkey.fromMasterSeed(seed);
      const wallet_hdpath = "m/44'/60'/0'/0/";
      const account_index = 0
      let fullPath = wallet_hdpath + account_index
      if (DEBUG) console.log("fullPath", fullPath)
      const wallet = hdwallet.derivePath(fullPath).getWallet();
      const privateKey = "0x" + wallet._privKey.toString('hex');
      if (DEBUG) console.log("privateKey", privateKey)
      var EthUtil = require('ethereumjs-util');
      address = "0x" + EthUtil.privateToAddress(wallet._privKey).toString('hex')


      const rlp = require('rlp');
      const keccak = require('keccak');

      let nonce = 0x00; //The nonce must be a hex literal!
      let sender = address;

      let input_arr = [sender, nonce];
      let rlp_encoded = rlp.encode(input_arr);

      let contract_address_long = keccak('keccak256').update(rlp_encoded).digest('hex');

      contract_address = contract_address_long.substring(24); //Trim the first 24 characters.


    }

    console.log("⛏  Account Mined as " + address + " and set as mnemonic in packages/hardhat")
    console.log("📜 This will create the first contract: " + chalk.magenta("0x" + contract_address));
    console.log("💬 Use 'yarn run account' to get more information about the deployment account.")

    fs.writeFileSync("./" + address + "_produces" + contract_address + ".txt", mnemonic.toString())
    fs.writeFileSync("./mnemonic.txt", mnemonic.toString())
  });

task("account", "Get balance informations for the deployment account.", async (_, { ethers }) => {
  const hdkey = require('ethereumjs-wallet/hdkey');
  const bip39 = require("bip39")
  let mnemonic = fs.readFileSync("./mnemonic.txt").toString().trim()
  if (DEBUG) console.log("mnemonic", mnemonic)
  const seed = await bip39.mnemonicToSeed(mnemonic)
  if (DEBUG) console.log("seed", seed)
  const hdwallet = hdkey.fromMasterSeed(seed);
  const wallet_hdpath = "m/44'/60'/0'/0/";
  const account_index = 0
  let fullPath = wallet_hdpath + account_index
  if (DEBUG) console.log("fullPath", fullPath)
  const wallet = hdwallet.derivePath(fullPath).getWallet();
  const privateKey = "0x" + wallet._privKey.toString('hex');
  if (DEBUG) console.log("privateKey", privateKey)
  var EthUtil = require('ethereumjs-util');
  const address = "0x" + EthUtil.privateToAddress(wallet._privKey).toString('hex')

  var qrcode = require('qrcode-terminal');
  qrcode.generate(address);
  console.log("‍📬 Deployer Account is " + address)
  for (let n in config.networks) {
    //console.log(config.networks[n],n)
    try {

      let provider = new ethers.providers.JsonRpcProvider(config.networks[n].url)
      let balance = (await provider.getBalance(address))
      console.log(" -- " + n + " --  -- -- 📡 ")
      console.log("   balance: " + ethers.utils.formatEther(balance))
      console.log("   nonce: " + (await provider.getTransactionCount(address)))
    } catch (e) {
      if (DEBUG) {
        console.log(e)
      }
    }
  }

});


async function addr(ethers, addr) {
  if (isAddress(addr)) {
    return getAddress(addr);
  }
  const accounts = await ethers.provider.listAccounts();
  if (accounts[addr] !== undefined) {
    return accounts[addr];
  }
  throw `Could not normalize address: ${addr}`;
}

task("accounts", "Prints the list of accounts", async (_, { ethers }) => {
  const accounts = await ethers.provider.listAccounts();
  accounts.forEach((account) => console.log(account));
});

task("blockNumber", "Prints the block number", async (_, { ethers }) => {
  const blockNumber = await ethers.provider.getBlockNumber();
  console.log(blockNumber);
});

task("balance", "Prints an account's balance")
  .addPositionalParam("account", "The account's address")
  .setAction(async (taskArgs, { ethers }) => {
    const balance = await ethers.provider.getBalance(
      await addr(ethers, taskArgs.account)
    );
    console.log(formatUnits(balance, "ether"), "ETH");
  });

function send(signer, txparams) {
  return signer.sendTransaction(txparams, (error, transactionHash) => {
    if (error) {
      debug(`Error: ${error}`);
    }
    debug(`transactionHash: ${transactionHash}`);
    // checkForReceipt(2, params, transactionHash, resolve)
  });
}

task("send", "Send ETH")
  .addParam("from", "From address or account index")
  .addOptionalParam("to", "To address or account index")
  .addOptionalParam("amount", "Amount to send in ether")
  .addOptionalParam("data", "Data included in transaction")
  .addOptionalParam("gasPrice", "Price you are willing to pay in gwei")
  .addOptionalParam("gasLimit", "Limit of how much gas to spend")

  .setAction(async (taskArgs, { network, ethers }) => {
    const from = await addr(ethers, taskArgs.from);
    debug(`Normalized from address: ${from}`);
    const fromSigner = await ethers.provider.getSigner(from);

    let to;
    if (taskArgs.to) {
      to = await addr(ethers, taskArgs.to);
      debug(`Normalized to address: ${to}`);
    }

    const txRequest = {
      from: await fromSigner.getAddress(),
      to,
      value: parseUnits(
        taskArgs.amount ? taskArgs.amount : "0",
        "ether"
      ).toHexString(),
      nonce: await fromSigner.getTransactionCount(),
      gasPrice: parseUnits(
        taskArgs.gasPrice ? taskArgs.gasPrice : "1.001",
        "gwei"
      ).toHexString(),
      gasLimit: taskArgs.gasLimit ? taskArgs.gasLimit : 24000,
      chainId: network.config.chainId,
    };

    if (taskArgs.data !== undefined) {
      txRequest.data = taskArgs.data;
      debug(`Adding data to payload: ${txRequest.data}`);
    }
    debug(txRequest.gasPrice / 1000000000 + " gwei");
    debug(JSON.stringify(txRequest, null, 2));

    return send(fromSigner, txRequest);
  });
