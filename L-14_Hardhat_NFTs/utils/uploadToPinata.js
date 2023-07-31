const pinata = require("@pinata/sdk")
const path = require("path")
const fs = require("fs")

async function storeImages(imagesFilePath) {
    // if we give ./images/randomNft then below code will resolve it
    const fullImagePath = path.resolve(imagesFilePath)
    const files = fs.readdirSync(fullImagePath)
    console.log(files)
}


module.exports = { storeImages }
