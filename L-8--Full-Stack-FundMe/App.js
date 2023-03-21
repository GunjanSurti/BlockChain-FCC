// we copied ethers library form docs so we can "import", only for this lesson
// in future lesson will do yarn add ethers ....
import { ethers } from "./ethers-5.6.esm.min.js"

const connectButton = document.getElementById("connectBtn")
const fundButton = document.getElementById("fundBtn")
connectButton.onclick = connect
// connectButton.onclick = connect() => this will automatically call connect function without clicking
fundButton.onclick = fund
// async function connsct() {} , this dont needs to be initialized before call
// const connect = async () => {}  , this needs to initialized before called
async function connect() {
    if (typeof window.ethereum !== "undefined") {
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" })
        } catch (error) {
            console.log(error)
        }
        const accounts = await ethereum.request({ method: "eth_accounts" })
        connectButton.innerText = `Connected `
        document.getElementById("accountName").innerText =
            "Account : " + accounts[0]
    } else {
        connectButton.innerText = "Please get Metamask"
    }
}
async function fund(ethAmount) {
    console.log(`Funding with ${ethAmount}...`)
    if (typeof window.ethereum !== "undefined") {
        //to send a transaction we always need
        // 1. provider / connection to blockchain
        // 2. signer / wallet / someone with some gas
        // 3. contract that we are going to interract with (ABI, Address )
    }
}
// window.onload = connect();

// in node.js => require
/// in frontend => import  , require wont work , better way to do
