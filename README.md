# Mini AA Farcaster

Mini AA Farcaster is a Next.js application that demonstrates a proof of concept for decentralized applications (dApps) built on the Farcaster protocol with the power of account abstraction.

In this implementation two smart contracts are built to simulate the Farcaster Protocol - an implementation to register and create FID and FNAME's for new users. The implementations can be seen below: 

ID Registry:
https://mumbai.polygonscan.com/address/0x007ec325d80d64887281c453f641e6703ac6a3a9

Storage Registry: 
https://mumbai.polygonscan.com/address/0xf7ab9d9c856d35c17685e50029f60b93023fe21f


For demo purpses I launched on Polygon Mumbai as I had an abundant availability of Polygon Mumbai USDC to showcase the tipping feature in this demo. This can be launched on any of our supported networks including Optimism which is where the Farcaster Protcol lives. 

## Features
- Built with Next.js for a seamless developer and user experience.
- Demonstrates the potential of dApps on the Farcaster protocol using account abstraction.
- Shows how to use Session Keys for a tipping feature

Note:

There are some todo's for the tipping feature - demo is currently hardcoded to send USDC to 1 address. 

## Prerequisites
- Node.js v18

## Setup and Installation

1. **Clone the repository:**

2. **Set up your environment variables:**

   - Rename the `.env.example` file to `.env`.
   - Fill in the required environment variables in the `.env` file.

   ```bash
   mv .env.example .env
   ```

3. **Install dependencies:**

   ```bash
   yarn install
   ```

4. **Run the development server:**

   ```bash
   yarn dev
   ```

   The application should now be running on [http://localhost:3000](http://localhost:3000).

