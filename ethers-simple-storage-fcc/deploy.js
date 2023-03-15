// yarn command is also used to run scripts
// the compilation command to compile .sol file =>
// deployinf a contract is sending transaction

//importing ethers in project so that we can use wonderful tools that comes with it
// we have writen outside of main function so that it can load before calling main function
const ethers = require("ethers");
const fs = require("fs-extra");
// fs a package is used to read abi and binary compiled code means read from file not only these two
// yarn add fs-extra
require("dotenv").config(); // this will import .env file
async function main() {
  //complie them in our code(solidity contracts)
  //complie them seperately
  // RPC URL -> http://172.30.224.1:7545

  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  //this is the way that our script will connect to blockchain
  // this provider gives a connection to a blockchain
  //to excess environment variable we use "process.env"
  // console.log(process.env.PRIVATE_KEY); => 0xae7e35459b488b32a05077bf144a327a28037168869ce9f1ff7f52c3586ac356

  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  //-------------------------------------------------------------------
  // Better method to use wallet without private key in files
  // encryptedKey.json must be deployed again after changing private key
  // const encryptedJson = fs.readFileSync("./.encryptedKey.json", "utf8");
  // let wallet = new ethers.Wallet.fromEncryptedJsonSync(json , password) way to use and can be found in docs also
  // let wallet = new ethers.Wallet.fromEncryptedJsonSync(
  //   encryptedJson,
  //   process.env.PRIVATE_KEY_PASSWORD
  // );
  // we have to connect to our provider
  // wallet = await wallet.connect(provider);
  // at the time of deploying we have to write  PRIVATE_KEY_PASSWORD="actual password" in terminal
  // eg PRIVATE_KEY_PASSWORD=password
  //-------------------------------------------------------------------

  // 0xae7e35459b488b32a05077bf144a327a28037168869ce9f1ff7f52c3586ac356 is private key from Gananche
  // writing private key into code is a big no no

  //this two lines of code (wallet , provider) gives everything to interract with smart contract

  // In order to deploy contract we need abi and binary compiled code
  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf-8");
  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf8"
  );
  // in ethers contractFactory is an object used to deploy contracts
  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  // we pass the abi => so our code knows how to interract with contract
  //binary => main compiled code
  // wallet => so we can use to sign deploying this conctract
  console.log("Deploying, please wait...");
  // we can deploy this contract with ethers
  const contract = await contractFactory.deploy(); // STOP Here! , wait for "contract" to deploy!
  // deploy({gasLimit:...})   by putting {} => we can add override
  //const transactionReceipt =
  await contract.deployTransaction.wait(1);
  console.log(`contract address: ${contract.address}`);
  // 1 shows no of confirmations we actually want to wait
  // means we will wait 1 block confirmation to make sure this happen
  // console.log(contract);
  // you only get transactionReceipt when you wait for  a block confirmation
  // and transactionresponse or depolyTransaction is get when you deploy contract
  const currentFavouriteNumber = await contract.retrieve();
  console.log(
    `Current Favourrite Number : ${currentFavouriteNumber.toString()}`
    //we used toString() to convert 10^18 length of number into string so blockchain can read
    // also after certain length javascript has rounding errors
    // ethers is smart enough to know that "7" is a number not string
  );
  // lets update our contract by calling store function
  // here we have passed number as string so when we passed massive number like 536465131651694635132355531 js would not get confuse
  //
  const transactionResponse = await contract.store("7");
  const transactionReceipt = await transactionResponse.wait(1);
  const updatedFavouriteNumner = await contract.retrieve();
  console.log(`Updated Favourite Number : ${updatedFavouriteNumner}`);
  // console.log(transactionResponse);
  // console.log("-------------------------------");
  // console.log(transactionReceipt);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// Better Private Key Managment
// write in terminal
// 1. =>
//PRIVATE_KEY = 0xae7e35459b488b32a05077bf144a327a28037168869ce9f1ff7f52c3586ac356 RPC_URL = http://127.0.0.1:8545 node deploy.js
// is same as setting evironment variable but not in .env

//2. Encrypt Private key => encryptKey.js
