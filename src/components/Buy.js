// eslint-disable-next-line
import React, {useEffect, useState} from "react";
import { Link, useParams } from "react-router-dom";
import "./css/buy.css";
import Web3 from "web3";
require('events').EventEmitter.prototype._maxListeners = 100;

function Buy(props) {
    const params = useParams();
    let account =  params.account;
    let owner = params.owner;
    const [resVisible, setResVisible] = useState(false);
    let rank = 0;
    let coin = 0;
    let matchCnt = 0;
    let lotto = [];
    let submitNum = [];
    let LottoCoinContract;
    let result;
    let balance;
    let matchIdx = [];

    const [submitArr, setSubmitArr] = useState([]);
    const [sub1, setSub1] = useState("");
    const [sub2, setSub2] = useState("");
    const [sub3, setSub3] = useState("");
    const [sub4, setSub4] = useState("");
    const [sub5, setSub5] = useState("");
    const [sub6, setSub6] = useState("");
    const [resArr, setResArr] = useState([]);
    const [Rank, setRank] = useState(0);
    const [Coin, setCoin] = useState(0);
    const [getMatchIdx, setGetMatchIdx] = useState([]);


    const lottoNum = () => {
        for(let i=0;i<6;i++) {
            let n = Math.floor(Math.random()*45) + 1;
            if(!checkNum(n)) {
                lotto.push(n);
            } else {
                i--;
            }
        }
        lotto = lotto.sort(function(a, b) {return a-b;});
        setResArr(lotto);
    }

    const checkNum = (n) => {
        return lotto.find((e) => (e === n));
    }

    const makeArr = async () => {
        submitNum = [];
        submitNum.push(sub1);
        submitNum.push(sub2);
        submitNum.push(sub3);
        submitNum.push(sub4);
        submitNum.push(sub5);
        submitNum.push(sub6);
        submitNum = submitNum.sort(function(a, b) {return a-b;});
        setSubmitArr(submitNum);
    }

    const matchLotto = async () => {
        for(let i=0;i<6;i++) {
            for(let j=0;j<6;j++) {
                if(resArr[i] == submitNum[j]) {
                    matchIdx.push(j);
                    matchCnt++;
                }
            }
        }
        setGetMatchIdx(matchIdx);
        
        await getRankCoin(matchCnt);
        
    }

    const getRankCoin = async () => {
        if(matchCnt == 6) {
            rank = 1;
            coin = 5;
        } else if(matchCnt == 5) {
            rank = 2;
            coin = 3;
        } else if(matchCnt == 4) {
            rank = 3;
            coin = 2;
        } else if(matchCnt == 3) {
            rank = 4;
            coin = 1;
        } else {
            rank = 0;
            coin = 0;
        }
        await changeRankData(rank);
        await changeCoinData(coin);
    }

    const changeRankData = async (n) => {
        setRank(Rank + n);
    }

    const changeCoinData = async (n) => {
        setCoin(Coin + n);
    }

    const WinningLotto = async () => {
        let web3 = new Web3(window.ethereum);
    
        if(window.ethereum){
            web3 = new Web3(window.ethereum);
            LottoCoinContract = new web3.eth.Contract(props.ABI, props.Addr);
            props.setLoading(true);

            result = await LottoCoinContract.methods.Winning(rank, resArr, submitArr).send({"from": account}).then(function(result) {
                setResVisible(true); // 결과 화면 보이게
            }).catch(function(e) {
                props.setLoading(false);
                alert(`error occur ${e}`);
                window.location.href = `/`;
                return;
            });
            // 로딩 화면
            props.setLoading(false);

            try{
                await window.ethereum.request({ method: "eth_requestAccounts" });
            }catch (error){
                alert(`error ouccur ${error}`);
            }
        } else if(window.web3){
            web3 = new Web3(Web3.curentProvider);
        } else{
            alert('메타마스크 연결이 필요합니다...');
        }
    }

    const submitLotto = async () => {
        await makeArr(); // 제출한 로또 번호 
        await matchLotto(); // 로또 번호 비교
        await WinningLotto();
    }

    useEffect(() => {
        lottoNum();
    }, []);

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
                    <div className="input-num">
                        <ul>
                            <li><input type="text" maxLength="2" onChange={(e) => {setSub1(e.target.value);}} /></li>
                            <li><input type="text" maxLength="2" onChange={(e) => {setSub2(e.target.value);}} /></li>
                            <li><input type="text" maxLength="2" onChange={(e) => {setSub3(e.target.value);}} /></li>
                            <li><input type="text" maxLength="2" onChange={(e) => {setSub4(e.target.value);}} /></li>
                            <li><input type="text" maxLength="2" onChange={(e) => {setSub5(e.target.value);}} /></li>
                            <li><input type="text" maxLength="2" onChange={(e) => {setSub6(e.target.value);}} /></li>
                        </ul>
                    </div>
                    <button className="submit-button" onClick={submitLotto}><div>제출하기</div></button>
                </div>
            </div>
            {resVisible ? 
            <div className="result">
            <div className="result-wrap">
                <div className="answer-num">
                    <div>정답</div>
                    <ul>
                        {resArr.map((value, idx) => {
                            return <li key={idx}><div>{value}</div></li>
                        })}
                    </ul>
                </div>
                <div className="result-num">
                    <div>결과</div>
                    <ul>
                        <li style={getMatchIdx.indexOf(0) >= 0 ? {backgroundColor:"#FFC5D0"} : null}><div>{sub1}</div></li>
                        <li style={getMatchIdx.indexOf(1) >= 0 ? {backgroundColor:"#FFC5D0"} : null}><div>{sub2}</div></li>
                        <li style={getMatchIdx.indexOf(2) >= 0 ? {backgroundColor:"#FFC5D0"} : null}><div>{sub3}</div></li>
                        <li style={getMatchIdx.indexOf(3) >= 0 ? {backgroundColor:"#FFC5D0"} : null}><div>{sub4}</div></li>
                        <li style={getMatchIdx.indexOf(4) >= 0 ? {backgroundColor:"#FFC5D0"} : null}><div>{sub5}</div></li>
                        <li style={getMatchIdx.indexOf(5) >= 0 ? {backgroundColor:"#FFC5D0"} : null}><div>{sub6}</div></li>
                    </ul>
                </div>
                <div className="result-text">
                    <div className="res-text-rank">{Rank == 0 ? "낙첨..." : Rank + "등 당첨!!!"}</div>
                    <div className="res-text-coin">획득 코인 : {Coin} Coin</div>
                </div>
            </div>
            <Link to="/"><div className="re-start"><div>다시하기</div></div></Link>
        </div>
        : null }
        </React.Fragment>
    )
}

export default Buy;