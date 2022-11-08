// eslint-disable-next-line
import './App.css';
import React, {useState} from "react";
import { BrowserRouter, Route, Routes} from "react-router-dom";
import {Main, Header, Buy, Mypage} from "./components";
import LoadingOverlay from 'react-loading-overlay';
import styled, { css } from "styled-components";
import {LottoCoinABI, LottoCoinAddr} from "./contracts/LottoCoinDeploy";

const LoadingWarp = styled.div`
  height: 100vh;
`

function App() {
  
  const [account, setAccount] = useState("");
  const [owner, setOwner] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <BrowserRouter>
      <React.Fragment>
        <LoadingOverlay active={loading} spinner={loading} text="waiting for response of metamask...">
          <LoadingWarp>
            <Header Addr={LottoCoinAddr} ABI={LottoCoinABI} SetAccount={setAccount} SetOwner={setOwner} />
              <Routes>
                <Route path="/" element={<Main Addr={LottoCoinAddr} ABI={LottoCoinABI} account={account} owner={owner} setLoading={setLoading} />}/> 
                <Route path="/Buy/:account/:owner" element={<Buy Addr={LottoCoinAddr} ABI={LottoCoinABI} setLoading={setLoading} />}/>
                <Route path="/Mypage" element={<Mypage Addr={LottoCoinAddr} ABI={LottoCoinABI} account={account} owner={owner} setLoading={setLoading} />}/>
              </Routes>
          </LoadingWarp>
        </LoadingOverlay>
      </React.Fragment>
    </BrowserRouter>
  );
}

export default App;
