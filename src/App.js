import { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import QRCode from 'qrcode.react'
import { getBalance, readCount, setCount } from './api/UseCaver'
import * as KlipAPI from './api/UseKlip'

/*
1. Smart contract 배포 주소 파악(가져오기)
2. caver.js 이용해서 스마트 컨트랙트 연동하기 
3. 가져온 스마트 컨트랙트 실행 결과(데이터) 웹에 표현하기
*/

// function onPressButton () {
//   console.log('hi')
// }

// app 밖에서 이렇게 해서 setBalance 함수 자체를 넘겨서 쓸 수도 있다.
const onPressButton = (_balance, _setBalance) => {
  _setBalance(_balance)
}
const DEFAULT_QR_CODE = 'DEFAULT'
function App() {
  const [ balance, setBalance ] = useState('0')
  const [ qrvalue, setQrvalue] = useState(DEFAULT_QR_CODE)
// 이 안에서 이렇게 쓸 수도 있고
// const onPressButton = (balance, setBalance) => {
//   setBalance(balance)
// }

const onClickgetAddress = () => {
  KlipAPI.getAddress(setQrvalue)
}
const onClicksetCount = () => {
  KlipAPI.setCount('777', setQrvalue)
}

return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <QRCode value={qrvalue} />
        <a>
          {balance}
        </a>
        <button onClick={() => {onClickgetAddress()}}>Get Address</button>
        <button onClick={()=>{onClicksetCount()}}>Set Count</button>
        {/* <button onClick={()=> {setCount(10)}}>Set Count</button> */}
        <button onClick={()=> {onPressButton('999', setBalance)}}> On Press Button </button>
      </header>
    </div>
  );
}

export default App;
