// eslint-disable-next-line
import React from "react";
import "./css/main.css";
import Web3 from "web3";
require('events').EventEmitter.prototype._maxListeners = 100;

function Main(props) {
    let account =  props.account;
    let owner = props.owner;
    let result;
    let LottoCoinContract;
    let balance;
    let ownerBalance;
    
    const buyLotto = async () => {
        let web3 = new Web3(window.ethereum);
        if(window.ethereum){
            web3 = new Web3(window.ethereum);

            LottoCoinContract = new web3.eth.Contract(props.ABI, props.Addr);

            balance = await LottoCoinContract.methods.balanceOf(account[0]).call();
            ownerBalance = await LottoCoinContract.methods.balanceOf(account[0]).call();

            if(balance < 1) {
                alert("보유 코인이 부족합니다.\n코인 충전 후 다시 이용해주세요!");
                return;
            }

            if(ownerBalance < 5) {
                alert("상금으로 지급할 코인이 부족합니다.\n관리자에게 문의하세요!");
                return;
            }

            props.setLoading(true);
            result = await LottoCoinContract.methods.BuyLotto().send({"from": account[0]}).then(function(result) {
                window.location.href = `/Buy/${account[0]}/${owner}`;
            }).catch(function(e) {
                props.setLoading(false);
                alert(`error ouccur ${e}`);
                return;
            });
            props.setLoading(false);
            
            try{
                await window.ethereum.request({ method: "eth_requestAccounts" });
            }catch (error){
                alert(`error ouccur ${error}`);
            }
        } else if(window.web3){
            web3 = new Web3(Web3.curentProvider);
        } else{
            alert('메타마스크 연결이 필요합니다!');
            window.open("https://metamask.io/download/");
        }
    }

    return (
        <React.Fragment>
            <div className="description">
                <div className="description-wrap">
                    <div className="example-num">
                        <div>예시</div>
                        <ul>
                            <li><div>1</div></li>
                            <li><div>9</div></li>
                            <li><div>15</div></li>
                            <li><div>27</div></li>
                            <li><div>32</div></li>
                            <li><div>41</div></li>
                        </ul>
                    </div>
                    <div className="example-text">
                        <div className="rank">
                            <ul>
                                <li>
                                    <div>1등 5coin - 6개 맞췄을 경우</div>
                                </li>
                                <li>
                                    <div>2등 3coin - 5개 맞췄을 경우</div>
                                </li>
                                <li>
                                    <div>3등 2coin - 4개 맞췄을 경우</div>
                                </li>
                                <li>
                                    <div>4등 1coin - 3개 맞췄을 경우</div>
                                </li>
                                <li>
                                    <div>5등 0coin - 2개 이하 맞췄을 경우, 낙첨...</div>
                                </li>
                            </ul>
                        </div>
                        <div className="rec-text">
                            <div className="rec1">구매하기를 클릭하셔서 로또에 응모해보세요!</div>
                            <div className="rec2">1coin 소모</div>
                        </div>
                    </div> 
                    <button className="buy-button" onClick={buyLotto}><div>구매하기</div></button>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Main;