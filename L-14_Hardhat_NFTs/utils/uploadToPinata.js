const pinataSDK = require("@pinata/sdk")
const path = require("path")
const fs = require("fs")
require("dotenv").config()

const pinataApiKey = process.env.PINATA_API_KEY || ""
const pinataApiSecret = process.env.PINATA_API_SECRET || ""
const pinata = new pinataSDK(pinataApiKey, pinataApiSecret)

async function storeImages(imagesFilePath) {
    const fullImagesPath = path.resolve(imagesFilePath)

    // Filter the files in case the are a file that in not a .png
    const files = fs.readdirSync(fullImagesPath).filter((file) => file.includes(".png"))
    // console.log(files);
    let responses = []
    console.log("Uploading to IPFS")

    for (const fileIndex in files) {
        console.log(`Working on ${fileIndex}`)
        const readableStreamForFile = fs.createReadStream(`${fullImagesPath}/${files[fileIndex]}`)
        const options = {
            pinataMetadata: {
                name: files[fileIndex],
            },
        }
        try {
            await pinata
                .pinFileToIPFS(readableStreamForFile, options)
                .then((result) => {
                    responses.push(result)
                })
                .catch((err) => {
                    console.log(err)
                })
        } catch (error) {
            console.log(error)
        }
    }
    return { responses, files }
}

async function storeTokenUriMetadata(metadata) {
    const options = {
        pinataMetadata: {
            name: metadata.name,
        },
    }
    try {
        const response = await pinata.pinJSONToIPFS(metadata, options)
        return response
    } catch (error) {
        console.log(error)
    }
    return null
}

module.exports = { storeImages, storeTokenUriMetadata }

// async function storeImages(imagesFilePath) {
//     // if we give ./images/randomNft then below code will resolve it
//     const fullImagePath = path.resolve(imagesFilePath)
//     const files = fs.readdirSync(fullImagePath)
//     // console.log(files)
//     let responses = []
//     console.log("Uploding to Pinata!!!")
//     for (fileIndex in files) {
//         console.log(`Working on ${fileIndex}`)
//         // we are streaming data for each file
//         const readableStreamForFile = fs.createReadStream(`${fullImagePath}/${files[fileIndex]}`)
//         // const response = await
//         try {
//             const response = await pinata.pinFileToIPFS(readableStreamForFile)
//             responses.push(response)
//         } catch (error) {
//             console.log(error)
//         }
//         return { responses, files }
//     }
// }
