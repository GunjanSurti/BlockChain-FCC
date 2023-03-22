// we copied ethers library form docs so we can "import", only for this lesson
// in future lesson will do yarn add ethers ....
import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const balanceBtn = document.getElementById("balanceBtn")
const connectButton = document.getElementById("connectBtn")
const fundButton = document.getElementById("fundBtn")
const withdrawBtn = document.getElementById("withdrawBtn")
connectButton.onclick = connect
// connectButton.onclick = connect() => this will automatically call connect function without clicking
fundButton.onclick = fund
balanceBtn.onclick = getBalance
withdrawBtn.onclick = withdraw
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
async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))
        // console.log(balance.toString()) //653600000000000000000
        // console.log(balance) // _hex :"0x236e85a9142b500000"
    }
}
async function fund() {
    const ethAmount = document.getElementById("ethAmount").value
    console.log(`Funding with ${ethAmount}...`)
    if (typeof window.ethereum !== "undefined") {
        //to send a transaction we always need
        // 1. provider / connection to blockchain
        // 2. signer / wallet / someone with some gas
        // 3. contract that we are going to interract with (ABI, Address )
        // JsonRPCProvider => alchemy link etc
        // Web3Provider => for metamask
        // Web3Provider is a object which wraps around stuff like metamask
        // it takes http endpoint and automatically sticks us with ethers for us
        // ethers.providers.Web3Provider() => looks for metamask provider and goes
        // ahh i found the http-endpoint(window.ethereum) and that will be our provider

        const provider = new ethers.providers.Web3Provider(window.ethereum)

        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)

        try {
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })
            console.log("funded " + ethAmount)
            // wait for transaction to finish
            await listenForTransactionMined(transactionResponse, provider)
            /**
             * funded 56
             *  Done!
             * Mining 0x25f8ba5ada49075ba750457cca25b2293d4407861b5e72cd0a57e0eaa6b477c9...
             * here the order is not correct "Done!" should be last
             * this is called event loop
             * provider.once takes time to our machine executes remaining code, our front end
             * checks for provider.once has completed or not and then it comes again to execute
             * the code
             * thst's why we are using Promises
             * so we want to adjust the code to finish listening to our "listner"(provider.once())
             * the concept of async/await does not work
             */
            console.log("Done!")
        } catch (error) {
            console.log("Rejected!!")
        }
    }
}
// only owner will be able to withdraw (first acc in hardhat node)
async function withdraw() {
    if (typeof window.ethereum !== "undefined") {
        console.log("Withdrawing...");
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.withDraw()
            await listenForTransactionMined(transactionResponse,provider)
        } catch (error) {
            console.log(error)
        }
    }
}    

function listenForTransactionMined(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}...`)
    // reason for promise is bcz  we need to create listner for blockchain
    // provider.once(eventName,listner)
    // provider.once  transactionResponse.hash happens and execute the function
    // the promies is gonna be done(reslove) when the listner finishes listening

    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(
                `Completed with ${transactionReceipt.confirmations} Block confirmations`
            )
            resolve() // transactionResponse.hash fires we are going to reslove this promise
            // inside of provider.once so transactionResponse.hash is found it resolves
            // means once the transactionResponse.hash found the we are going to call this function
            // (transactionRectiprt) =>{...}
            // Promise only returns when reject or reslove is called
            // and we are telling it to reslove once provider.once completes
        })
    })
}

// window.onload = connect()

// in node.js => require
// in frontend => import  , require wont work , better way to do
// anonymus function notation "() => {}"
