import { useState } from 'react';
// 부트스트랩 css import 해줘야 함 그리고 app.css 위에 있어야 한다
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';
import './market.css';
import QRCode from 'qrcode.react'
import { fetchCardsOf, getBalance, readCount, setCount } from './api/UseCaver'
import * as KlipAPI from './api/UseKlip'
import { Alert, Container } from 'react-bootstrap';

/*
1. Smart contract 배포 주소 파악(가져오기)
2. caver.js 이용해서 스마트 컨트랙트 연동하기 
3. 가져온 스마트 컨트랙트 실행 결과(데이터) 웹에 표현하기
*/

// app 밖에서 이렇게 해서 setBalance 함수 자체를 넘겨서 쓸 수도 있다.
// const onPressButton = (_balance, _setBalance) => {
//   _setBalance(_balance)
// }
const DEFAULT_QR_CODE = 'DEFAULT'
const DEFAULT_ADDRESS = '0x0000000000000000000000000000000000'
function App() {

// 이 안에서 이렇게 쓸 수도 있고
// const onPressButton = (balance, setBalance) => {
//   setBalance(balance)
// }

  // State Data

  // Gobal Data
  // address
  // nft
  const [ nfts, setNfts ] = useState([])
  const [ myBalance, setMyBalance ] = useState('0')
  const [ myAddress, setMyAddress ] = useState(DEFAULT_ADDRESS)

  // UI
  const [ qrvalue, setQrvalue] = useState(DEFAULT_QR_CODE)
  // tab
  // mintInput

  // Modal

  // fetchMarketNFTs
  // fetchMyNFTs
  const fetchMyNFTs = () => {
    // [ {tokenId: 1, tokenUri: "https://cdn.pixabay.com/photo/2022/06/27/14/38/cat-7287671_960_720.jpg"}, {tokenId:2 이렇게 나오게~_~}] 
    fetchCardsOf('0x749f3E4a1564421FF1EA8399c15800aE6A716F3f')
    // balanceOf > 내가 가진 전체 NFT 토큰 개수를 가져온다

    // 2
    // tokenOfOwnerByIndex > 내가 가진 NFT token ID를 하나씩 가져온다 > 배열로

    // tokenURI > 앞에서 가져온 tokenID를 이용해서 tokenURI를 하나씩 가져온다 >
  }





  // onClickMint
  // onClickMyCard
  // onClickMarketCard
  
  // getUserData
  const getUserData = () => {
    KlipAPI.getAddress(setQrvalue, async (address)=> {
      setMyAddress(address)
      const _balance = await getBalance(address)
      setMyBalance(_balance)
    })
  }

  // getBalance

const onClickgetAddress = () => {
  KlipAPI.getAddress(setQrvalue)
}
const onClicksetCount = () => {
  KlipAPI.setCount('777', setQrvalue)
}

return (
    <div className="App">
      <div style={{backgroundColor: 'pink', padding: 10}}>
        {/* 주소 잔고 */}
        <div style={{ marginBottom: '1em'}}>내 지갑</div>
        {myAddress}
        <Alert className='alert-balance' style={{fontSize: 20}} onClick={getUserData}>{myBalance}</Alert>
      </div>
        <Container style={{backgroundColor: '#61dafb', width: 300, height: 300, padding: 20}}>
        <QRCode value={qrvalue} size={256} style={{margin: 'auto'}} />
        </Container>
        <a href='/'>hello world</a>
        <button onClick={fetchMyNFTs}>NFT 가져오기</button>
        {/* 갤러리(마켓, 내 지갑) */}
        {/* 발행 페이지 */}
        {/* 탭 */}
        {/* 모달 */}
    </div>
  );
}

export default App;
