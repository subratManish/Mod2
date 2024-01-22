import { useState, useEffect, useRef } from "react";
import { ethers } from "ethers";
import subratKumarWalletAbi from "../artifacts/contracts/Assessment.sol/SubratKumarWallet.json";

export default function HomePage() {
  const [subratWallet, setSubratWallet] = useState(undefined);
  const [subratAccount, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [secretBalance, setSecretBalance] = useState(undefined);
  const [hideContractAddress, setHideContractAddress] = useState(false);

  const depositRef = useRef();
  const withdrawRef = useRef();

  const depositSecret = useRef();
  const withdrawSecret = useRef();

  const [buyNFT, setBuyNFT] = useState("");

  const contractAddress = "0x10D4431Fde93e57E67f55f8fac14C76Bee447A87";
  const atmABI = subratKumarWalletAbi.abi;

  const getWalletAddress = async () => {
    if (window.ethereum) {
      setSubratWallet(window.ethereum);
    }

    if (subratWallet) {
      try {
        const accounts = await subratWallet.request({ method: "eth_accounts" });
        accoundHandler(accounts);
      } catch (error) {
        console.log("error", error);
      }
    }
  };

  const accoundHandler = (accounts) => {
    if (accounts && accounts.length > 0) {
      console.log("Account connected: ", accounts[0]);
      setAccount(accounts[0]);
    } else {
      console.log("No subratAccount found");
    }
  };

  const connectToMetamask = async () => {
    if (!subratWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await subratWallet.request({ method: "eth_requestAccounts" });
    accoundHandler(accounts);

    // once wallet is set, we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(subratWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      try {
        const currentBal = await atm.getBalance();
        console.log(currentBal);

        setSecretBalance(currentBal.toNumber());
      } catch (error) {
        console.log("error", error);
      }
    }
  };

  const depositToken = async () => {
    const amt = Number(depositRef.current.value);
    const secret = Number(depositSecret.current.value);
    console.log(amt, secret);

    if (amt === 0) {
      alert("amount should be more than 0");
      return;
    }

    try {
      if (atm) {
        let tx = await atm.DepositToken(amt, secret);
        await tx.wait();
        getBalance();
        depositRef.current.value = 0;
        depositSecret.current.value = 0;
      }
    } catch (error) {
      alert("ACTION REJECTED");
    }
  };

  const withdrawToken = async () => {
    const amt = Number(withdrawRef.current.value);
    const secret = Number(withdrawSecret.current.value);

    if (amt === 0) {
      alert("amount should be more than 0");
      return;
    }

    console.log(amt, secret);

    try {
      if (atm) {
        let tx = await atm.WithdrawToken(amt, secret);
        await tx.wait();
        getBalance();
      }
    } catch (error) {
      alert("ACTION REJECTED");
      console.log(error);
    }
  };

  const purchaseNFT = async () => {
    try {
      if (atm) {
        let tx = await atm.purchaseNFT(1);
        await tx.wait();
        getBalance();
      }
    } catch (error) {
      alert("ACTION REJECTED");
    }
  };

  const toggleContractAddress = () => {
    setHideContractAddress((prevShowContractAddress) => !prevShowContractAddress);
  };

  useEffect(() => {
    getWalletAddress();
  }, []);

  useEffect(() => {
    if (atm) {
      getBalance();
    }
  }, [atm]);

  return (
    <main className="container">
      <header>
        <h1>Module 2 Frontend project</h1>
        <h2>Subrat Kumar </h2>
      </header>
      <div className="content">
        {!subratAccount ? (
          <button onClick={connectToMetamask}>Click to connect your MetaMask wallet</button>
        ) : (
          <>
            <div className="button-group">
              <div className="btn-input">
                <button onClick={toggleContractAddress}>
                  {hideContractAddress ? "Hide Contract Address" : "Show Contract Address"}
                </button>
                {hideContractAddress && (
                  <div>
                    <p>Contract Address: {contractAddress}</p>
                  </div>
                )}
              </div>
              <div className="btn-input">
                <button onClick={depositToken}>Deposit Token</button>
                <div>
                  <input ref={depositRef} type="number" placeholder="Amount"></input>
                  <input ref={depositSecret} type="password" placeholder="Secret Key"></input>
                </div>
              </div>
              <div className="btn-input">
                <button onClick={withdrawToken}>Withdraw Token</button>
                <div>
                  <input ref={withdrawRef} type="number" placeholder="Amount"></input>
                  <input ref={withdrawSecret} type="password" placeholder="Secret Key"></input>
                </div>
              </div>
              <div className="btn-input">
                <button onClick={purchaseNFT}>Buy NFT</button>
              </div>
            </div>
          </>
        )}
      </div>
      <style jsx>{`main {
  height: 100vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  background: linear-gradient(to right, #ff7e5f, #feb47b);
  color: #fff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.btn-input {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 1em;
}

input {
  padding: 10px 20px;
  font-size: 16px;
  background-color: white;
  color: #333;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background 0.
