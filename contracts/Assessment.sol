// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// import "hardhat/console.sol";

contract subratKumarWalletAbi {
    
    address payable public ContractOwner;
    uint256 public secretBalance;
    uint256 public secretKey;

    event onDeposit(uint256 amount);
    event onWithdraw(uint256 amount);
    event onPurchaseNFT(uint256 _number);

    constructor(uint initBal) payable {
        ContractOwner = payable(msg.sender);
        secretBalance = initBal;
        secretKey = 1234;
    }

    function getBalance() public view returns (uint256) {
        return secretBalance;
    }

    function DepositToken(uint256 amt, uint256 key) public payable {
        uint256 prevBal = secretBalance;

        // make sure this is the ContractOwner
        require(msg.sender == ContractOwner, "You don't own this account.");
        require(key == secretKey, "key doesn't match");

        // perform transaction
        secretBalance += amt;

        // assert transaction completed successfully
        assert(secretBalance == prevBal + amt);

        // emit the event
        emit onDeposit(amt);
    }

    // custom error
    error InsufficientBalance(uint256 secretBalance, uint256 withdrawAmount);

    function WithdrawToken(uint256 amt,uint256 key) public {
        require(msg.sender == ContractOwner, "You are not authorized");
        require(key == secretKey, "key doesn't match");

        uint256 prevBal = secretBalance;
        if (secretBalance < amt) {
            revert InsufficientBalance({
                secretBalance: secretBalance,
                withdrawAmount: amt
            });
        }

        // WithdrawToken the given amount
        secretBalance -= amt;

        // assert the secretBalance is correct
        assert(secretBalance == (prevBal - amt));

        // emit the event
        emit onWithdraw(amt);
    }

    function getContractAddress() public view returns (address) {
        return address(this);
    }

    function getContractBalance() public view returns (uint256) {
        return secretBalance;
    }

    function purchaseNFT(uint256 amt,uint256 key) public {
        WithdrawToken(amt,key);

        emit onPurchaseNFT(amt);
    }
}
