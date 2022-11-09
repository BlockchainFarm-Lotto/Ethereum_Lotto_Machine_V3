import React, {useEffect, useState} from "react";
import { Link, useLocation } from "react-router-dom";
import "./css/header.css";
import Web3 from "web3";

function Header(props) {
    const {pathname} = useLocation();
    let visible = true;
    if(pathname === "/Mypage" || pathname.includes("Buy")) visible = false;
    let owner;
    let account = "";
    let LottoCoinContract;
    let web3 = new Web3(window.ethereum);
    web3.currentProvider.setMaxListeners(1);

    const [getWeb3UserAddr, setGetWeb3UserAddr] = useState(""); // 메타마스크 활성화된 주소
    const [getVisible, setGetVisible] = useState(false);
    const [getOwner, setGetOwner] = useState("");

    const initWeb3 = async () => {

        web3 = new Web3(window.ethereum);

        if(window.ethereum){
            web3 = new Web3(window.ethereum);
            console.log('메타마스크 연결 성공');
            console.log(web3);
            try{
                await window.ethereum.request({ method: "eth_requestAccounts" });
            }catch (error){
                console.log(`error ouccur ${error}`);
                if(error.code === -32002) {
                    alert("메타마스크 연결 대기중입니다.\n지갑 연결을 완료하여 주세요!");
                    return;
                }
            }
        } else if(window.web3){
            web3 = new Web3(Web3.curentProvider);
        } else{
            console.log('메타마스크 연결 필요');
            alert('메타마스크 연결이 필요합니다!');
            window.open("https://metamask.io/download/");
        }

        account = await web3.eth.getAccounts();
        console.log("최초 활성화된 계정이 나옵니다 : " + account);

        setGetWeb3UserAddr(account);
        props.SetAccount(account);
        setGetVisible(true);

        LottoCoinContract = new web3.eth.Contract(props.ABI, props.Addr);
        owner = await LottoCoinContract.methods.owner().call();
        console.log('owner:', owner);
        
        setGetOwner(owner);
        props.SetOwner(owner);
    }

    // Detect change in Metamask account
    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on("chainChanged", () => {
                window.location.href = `/`;
            });
            window.ethereum.on("accountsChanged", () => {
                // 최초로 메타마스크 연결 시 비동기 함수가 아니기 때문에 account 값을 가져오지 못하는 트릭 활용
                console.log("account : " + account); 
                console.log("pathname : " + pathname);
                if(account !== "") {
                    window.location.href = `/`;
                }
            });
        }
    });

    return (
        <React.Fragment>
            <header id="fixed-bar" className="fixed-bar-box-shadow">
                <div id="fixed-bar-wrap">
                    <Link to="/">
                        <div id="fixed-bar-title">Ethereum Lotto</div>
                    </Link>
                    {visible ? getVisible ? <div className="btn-wrap"><span className="addr">{getWeb3UserAddr}</span><Link to="/Mypage" account={getWeb3UserAddr} owner={getOwner}><div className="mypage-button"><div>Mypage</div></div></Link></div> : 
                    <button className="link-button" onClick={initWeb3}><span className="button-text">연결하기</span></button>
                    : null} 
                </div>
            </header>
        </React.Fragment>
    )
}
export default Header;