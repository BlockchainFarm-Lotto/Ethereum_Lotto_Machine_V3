// eslint-disable-next-line
import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import "./css/mypage.css";
import Web3 from "web3";

function Mypage(props) {
    let web3 = new Web3(window.ethereum);
    let account =  props.account;
    let owner = props.owner;
    let result;
    let LottoCoinContract;
    let getcoin;
    let setcoin;
    let sendcoin;
    let receivecoin;
    let ownerBalance;

    const [balance, setBalance] = useState("0");
    const [gettingCoin, setGettingCoin] = useState("0");
    const [settingCoin, setSettingCoin] = useState("0");
    const [getAddr, setGetAddr] = useState("");
    const [sendingCoin, setSendingCoin] = useState("0");

    const getBalanceOf = async () => {
        let web3 = new Web3(window.ethereum);
        web3.currentProvider.setMaxListeners(300);
        if(window.ethereum){
            web3 = new Web3(window.ethereum);
            LottoCoinContract = new web3.eth.Contract(props.ABI, props.Addr);
            result = await LottoCoinContract.methods.balanceOf(account[0]).call();
            
            setBalance(result);
            
            try{
                await window.ethereum.request({ method: "eth_requestAccounts" });
            }catch (error){
                alert(`error ouccur ${error}`)
            }
        } else if(window.web3){
            web3 = new Web3(Web3.curentProvider);
        } else{
            alert('메타마스크 연결이 필요합니다...');
        }
    }

    const getCoin = async () => {
        if(window.ethereum){
            web3 = new Web3(window.ethereum);
            web3.currentProvider.setMaxListeners(300);
            LottoCoinContract = new web3.eth.Contract(props.ABI, props.Addr);
            getcoin = await LottoCoinContract.methods.GetCoin().call().then(res => {setGettingCoin(res);});
            
            // getcoin = await LottoCoinContract.methods.balanceOf(account[0]).call().then(res => {console.log("getCoin result:", res); setGettingCoin(res);});
        }
    }

    const setCoin = async () => {
        if(window.ethereum){
            if(settingCoin < 1000) {
                alert("1000코인 이상 설정해주세요!");
                return;
            }

            web3 = new Web3(window.ethereum);
            web3.currentProvider.setMaxListeners(300);
            LottoCoinContract = new web3.eth.Contract(props.ABI, props.Addr);
            props.setLoading(true);
            setcoin = await LottoCoinContract.methods.SetCoin(settingCoin).send({"from": account[0]});
        }
    }

    const sendCoin = async () => {
        if(window.ethereum){
            web3 = new Web3(window.ethereum);
            web3.currentProvider.setMaxListeners(300);
            LottoCoinContract = new web3.eth.Contract(props.ABI, props.Addr);
            props.setLoading(true);
            sendcoin = await LottoCoinContract.methods.Send(getAddr, sendingCoin).send({"from": account[0]});
        }
    }

    const receiveCoin = async () => {
        if(window.ethereum){
            web3 = new Web3(window.ethereum);
            web3.currentProvider.setMaxListeners(300);
            LottoCoinContract = new web3.eth.Contract(props.ABI, props.Addr);

            ownerBalance = await LottoCoinContract.methods.balanceOf(owner).call();
        
            if(ownerBalance < 10) {
                alert("테스트로 지급할 코인이 부족합니다.\n관리자에게 문의하세요!");
                return;
            }

            props.setLoading(true);

            receivecoin = await LottoCoinContract.methods.ReceiveCoin().send({"from": account[0]}).then(function(result) {
                let newBalance = Number(balance) + 10;
                setBalance(String(newBalance));
            }).catch(function(e) {
                alert(`error occur ${e}`);
            });

            props.setLoading(false);
        }
    }

    const disconnectMetamask = async () => {
        await window.ethereum.request({
            method: "wallet_requestPermissions",
            params: [
              {
                eth_accounts: {}
              }
            ]
        });
        window.location.href = `/`;
    }

    useEffect(() => {
        getBalanceOf();
    }, [balance]);

    return (
        <React.Fragment>
            {
                account != owner ? 
        
            <div className="myinfo">
                <div className="myinfo-wrap">
                    <div className="details"> 
                        <div className="details-box">
                            <div className="title">
                                주소
                            </div>
                            <div className="contents">
                                {account[0]}
                            </div>
                        </div>
                        <div className="details-box">
                            <div className="title">
                                보유 코인
                            </div>
                            <div className="contents">
                                {balance} Coin
                            </div>
                        </div>
                        <div className="details-box">
                            <button className="web3-button" onClick={receiveCoin}><div>코인 받기</div></button>
                            <div className="getcoin-text"><span>테스트 코인을 받고 로또에 응모하세요!</span></div>
                        </div>
                        <div className="details-box">
                            <button className="unlink-button" onClick={disconnectMetamask}><div>Refresh</div></button>
                        </div>
                    </div>
                </div>
                <Link to="/"><div className="re-start"><div>메인으로</div></div></Link>
            </div>
            :
            <div className="myinfo">
                <div className="myinfo-wrap">
                    <div className="details"> 
                        <div className="details-box">
                            <div className="title">
                                주소
                            </div>
                            <div className="contents">
                                {account[0]}
                            </div>
                        </div>
                        <div className="details-box">
                            <div className="title">
                                보유 코인
                            </div>
                            <div className="contents">
                                {balance} Coin
                            </div>
                        </div>
                        <div className="details-box">
                            <button className="web3-button" onClick={setCoin}><div>SetCoin</div></button>
                            <input type="text" className="details-input getwidth" onChange={(e) => {setSettingCoin(e.target.value);}} />
                        </div>
                        <div className="details-box">
                            <button className="web3-button" onClick={getCoin}><div>GetCoin</div></button>
                            <div className="getcoin-text"><span>{gettingCoin + " Coin"}</span></div>
                        </div>
                        <div className="details-box">
                            <button className="web3-button" onClick={sendCoin}><div>Send</div></button>
                            <div className="send-form">
                                <div className="send-form-cont">
                                    <div className="tit2">To</div>
                                    <input type="text" className="details-input" onChange={(e) => {setGetAddr(e.target.value);}} /> 
                                </div>
                                <div className="send-form-cont">
                                    <div className="tit2">Coin</div>
                                    <input type="text" className="details-input"  onChange={(e) => {setSendingCoin(e.target.value);}} /> 
                                </div>
                            </div>
                        </div>
                        <div className="details-box">
                            <button className="unlink-button" onClick={disconnectMetamask}><div>Refresh</div></button>
                        </div>
                    </div>
                </div>
                <Link to="/"><div className="re-start"><div>메인으로</div></div></Link>
            </div>
            }
        </React.Fragment>
    )
}

export default Mypage;