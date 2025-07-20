<<<<<<< HEAD
# VoteSystem DApp

A basic voting decentralized application (DApp) built with Solidity and React (using Ethers.js). This project lets users vote for pre-registered candidates and view the number of votes each one received.

## Features

* Smart contract written in Solidity
* React frontend using `ethers.js`
* Connects to a local Hardhat blockchain
* Shows real-time vote count for each candidate
* One vote per address (no double voting)

## Requirements

* Node.js
* Hardhat (for local blockchain)
* MetaMask (or browser wallet)
* React (via Vite, CRA or similar)
* Ethers.js

## How to Run

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start Hardhat node:**

   ```bash
   npx hardhat node
   ```

3. **Deploy the smart contract:**

   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```

4. **Start the React frontend:**

   ```bash
   npm run dev
   ```

5. **Open your browser at:**

   ```
   http://localhost:5173
   ```

## Smart Contract

The contract stores a list of candidates (as Ethereum addresses), keeps track of votes, and prevents double voting by using `hasVoted`.

```solidity
function vote(string memory _candidate) public {
        require(!hasVoted[msg.sender], "Ja votou!");
        require(candidateExists(_candidate), "Candidato invalido!");
        votes[_candidate]++;
        hasVoted[msg.sender] = true;
    }
```

## Frontend

The frontend uses `ethers.js` to:

* Load candidates and vote counts
* Send transactions to vote
* Show updated results in real-time

## Notes

* This project runs locally with Hardhat and is not deployed on any testnet or mainnet.
* Make sure to import the correct account in MetaMask to match the signer index used in the frontend (`signer = provider.getSigner(2)`).
=======
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
>>>>>>> 4b6b96d (first commit)
