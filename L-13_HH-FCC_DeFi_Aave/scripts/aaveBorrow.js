async function main() {}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })

// protocol of aave treats everything as ERC20 token but everything is not ERC20 token like sepolia
// but it is much easier to send and interract if it is ERC20
