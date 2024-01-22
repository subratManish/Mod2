import { useState, useEffect,useRef } from "react";
import { ethers } from "ethers";
import rahulKumarWalletAbi from "../artifacts/contracts/Assessment.sol/RahulKumarWallet.json"

export default function HomePage() {
  const [rahulWallet, setRahulWallet] = useState(undefined);
  const [rahulAccount, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [secretBalance, setSecretBalance] = useState(undefined);
  const [hideContractAddress, setHideContractAddress] = useState(false);

  const depositRef = useRef();
  const withdrawRef = useRef();

  const depositSecret = useRef();
  const withdrawSecret = useRef();

  const [buyNFT, setbuyNFT] = useState("");

  const contractAddress = "0x10D4431Fde93e57E67f55f8fac14C76Bee447A87";
  const atmABI = rahulKumarWalletAbi.abi;

  const getWalletAddress = async () => {
    if (window.ethereum) {
      setRahulWallet(window.ethereum);
    }

    if (rahulWallet) {
      try {
        const accounts = await rahulWallet.request({ method: "eth_accounts" });
        accoundHandler(accounts);
      } catch (error) {
        console.log("error", error)
      }
    }
  };

  const accoundHandler = (accounts) => {
    if (accounts && accounts.length > 0) {
      console.log("Account connected: ", accounts[0]);
      setAccount(accounts[0]);
    } else {
      console.log("No rahulAccount found");
    }
  };

  const connectToMetamask = async () => {
    if (!rahulWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await rahulWallet.request({ method: "eth_requestAccounts" });
    accoundHandler(accounts);

    // once wallet is set, we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(rahulWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      try {
        const currentBal = await atm.getBalance();
        console.log(currentBal)

        setSecretBalance(currentBal.toNumber());
      } catch (error) {
        console.log("error", error)
      }
    }
  };

  const depositToken = async () => {

    const amt = Number(depositRef.current.value);
    const secret = Number(depositSecret.current.value);
    console.log(amt,secret);

    if(amt===0){
      alert("amount should be more than 0");
      return;
    }

    try {
      if (atm) {
        let tx = await atm.DepositToken(amt,secret);
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

    if(amt===0){
      alert("amount should be more than 0");
      return;
    }

    console.log(amt,secret);

    try {
      if (atm) {
        let tx = await atm.WithdrawToken(amt,secret);
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
        <h2>Rahul Kumar </h2>
      </header>
      <div className="content">
        {!rahulAccount ? (
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

.btn-input{
  display :flex;
  flex-direction :column;
  width : 100%;
  margin-bottom : 1em;
}

input{
  padding: 10px 20px;
  font-size: 16px;
  background-color: white; /* Light yellow background color */
  color: #333; /* Dark text color */
  border: none;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background 0.2s, transform 0.2s;
  margin :0.4em;
}

.container {
  text-align: center;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(to bottom, #ffedda, #ffe3bf);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  color: #333;
}

header {
  margin-bottom: 30px;
  font-size: 36px;
}

.content {
  display: flex;
  flex-direction: column;
  align-items :flex-start;
  justify-content :flex-start;
  padding: 20px;
  border-radius: 8px;
}

.button-group {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

button {
  display: block;
  padding: 10px 20px;
  font-size: 16px;
  background: linear-gradient(to right, #43e97b, #38f9d7);
  color: black;
  border: 1px solid black;
  font-weight : bold;
  cursor: pointer;
  width: 20vw;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, background 0.2s;
}

button:hover {
  transform: scale(1.05);
  background: linear-gradient(to right, #ff5e62, #ff9966);
}
`}</style>
    </main>
  );
}
