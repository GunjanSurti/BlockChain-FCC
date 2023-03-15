// This will encrypt our private key and can open only when password is entered
const ethers = require("ethers");
const fs = require("fs-extra");
require("dotenv").config();

async function main() {
  // what we are gonna do is we are going to set this script up to encriptKey.js one time and then we can remove our private key from anywhere in our workspace so that its no longer in plain text anywhere

  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
  const encryptedJsonKey = await wallet.encrypt(
    process.env.PRIVATE_KEY_PASSWORD,
    process.env.PRIVATE_KEY
  );
  console.log(encryptedJsonKey);
  // we created encryptedKey.json in root and passed encryptedJsonKey in that file
  // after we deployed once we can delete out private key and password from .env file
  //
  fs.writeFileSync("./.encryptedKey.json", encryptedJsonKey);

  // encrypt() is going to return encrypted Json Key that we can store locally and only dectypt with password
  // encrypt(paivate key password,private key)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
