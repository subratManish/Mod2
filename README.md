# RahulKumarWallet Smart Contract

This Solidity smart contract, named `RahulKumarWallet`, is a simple Ethereum-based wallet that allows the owner to deposit, withdraw, and purchase NFTs. The contract is written in Solidity version 0.8.9.

## Features

1. **Initialization**: The contract is initialized with an initial balance and a secret key.

2. **Deposit**: The owner can deposit tokens into the wallet by providing the correct secret key.

3. **Withdraw**: The owner can withdraw tokens from the wallet, ensuring that the withdrawal amount does not exceed the current balance.

4. **Purchase NFT**: A function `purchaseNFT` is provided to facilitate the purchase of NFTs, which internally calls the `WithdrawToken` function and emits an event.

## Smart Contract Details

### State Variables

- `ContractOwner`: The address of the wallet owner.
- `secretBalance`: The current balance of the wallet.
- `secretKey`: A secret key required for deposit, withdrawal, and NFT purchase.

### Events

- `onDeposit(uint256 amount)`: Emitted when tokens are deposited into the wallet.
- `onWithdraw(uint256 amount)`: Emitted when tokens are withdrawn from the wallet.
- `onPurchaseNFT(uint256 amount)`: Emitted when an NFT is purchased.

### Constructor

The constructor initializes the contract with an initial balance and sets the contract owner as the sender of the deployment transaction.

### Functions

- `getBalance()`: Retrieves the current balance of the wallet.
- `DepositToken(uint256 amt, uint256 key)`: Allows the owner to deposit tokens into the wallet.
- `WithdrawToken(uint256 amt, uint256 key)`: Allows the owner to withdraw tokens from the wallet, handling insufficient balance with a custom error.
- `getContractAddress()`: Retrieves the address of the contract.
- `getContractBalance()`: Retrieves the current balance of the contract.
- `purchaseNFT(uint256 amt, uint256 key)`: Facilitates the purchase of NFTs, internally calling the `WithdrawToken` function.


## Project Setup Instructions

To run this project on your computer after cloning the GitHub repository, follow the steps below:

1. **Install Dependencies:**
   - Navigate to the project directory in the terminal.
   - Run the following command to install project dependencies:
     ```bash
     npm install
     ```

2. **Start Ethereum Node:**
   - Open two additional terminals in your Visual Studio Code or preferred code editor.

   - In the second terminal, start the local Ethereum node using Hardhat:
     ```bash
     npx hardhat node
     ```

3. **Deploy Smart Contract:**
   - In the third terminal, deploy the smart contract to the local Ethereum network:
     ```bash
     npx hardhat run --network localhost scripts/deploy.js
     ```

4. **Launch Front-end:**
   - Go back to the first terminal and start the front-end application:
     ```bash
     npm run dev
     ```

5. **Access the Project:**
   - The project will be accessible on your local machine, typically at [http://localhost:3000/](http://localhost:3000/).

Now, the project is successfully running on your localhost. Ensure to follow these steps in sequence for a smooth setup process.


