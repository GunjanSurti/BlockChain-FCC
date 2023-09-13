
# Steps

- copy [yarn.lock and package.json](https://github.com/PatrickAlphaC/nextjs-smartcontract-lottery-fcc/blob/main/package.json)
- yarn create next-app nextjslottery
- yarn add --dev prettier
- yarn add moralis react-moralis, should have react and react-dom
- [yarn add magic-sdk](https://www.npmjs.com/package/magic-sdk)
- yarn add web3uikit (Header.js), not devDependency as it is going to be part of our website

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Notes

- enableWeb3 works with metamask only from useMoralis(), it will make connection with metamask like doing ethereum and eth_requestAccount etc...
- at 17:07 the useEffect run twice because of strict mode and see github repo
