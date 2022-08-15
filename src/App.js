import { useState } from "react";
// 부트스트랩 css import 해줘야 함 그리고 app.css 위에 있어야 한다
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./market.css";
import QRCode from "qrcode.react";
import { fetchCardsOf, getBalance, readCount } from "./api/UseCaver";
import * as KlipAPI from "./api/UseKlip";
import {
  Alert,
  Button,
  Card,
  CardImg,
  Container,
  Form,
  Nav,
} from "react-bootstrap";
import { MARKET_CONTRACT_ADDRESS } from "./constants";

/*
1. Smart contract 배포 주소 파악(가져오기)
2. caver.js 이용해서 스마트 컨트랙트 연동하기 
3. 가져온 스마트 컨트랙트 실행 결과(데이터) 웹에 표현하기
*/

// app 밖에서 이렇게 해서 setBalance 함수 자체를 넘겨서 쓸 수도 있다.
// const onPressButton = (_balance, _setBalance) => {
//   _setBalance(_balance)
// }
const DEFAULT_QR_CODE = "DEFAULT";
const DEFAULT_ADDRESS = "0x0000000000000000000000000000000000";
function App() {
  // 이 안에서 이렇게 쓸 수도 있고
  // const onPressButton = (balance, setBalance) => {
  //   setBalance(balance)
  // }

  // State Data

  // Gobal Data
  // address
  // nft
  const [nfts, setNfts] = useState([]);
  const [myBalance, setMyBalance] = useState("0");
  const [myAddress, setMyAddress] = useState(DEFAULT_ADDRESS);

  // UI
  const [qrvalue, setQrvalue] = useState(DEFAULT_QR_CODE);
  const [mintImgUrl, setMintImgUrl] = useState("");
  // tab
  const [tab, setTab] = useState("MINT"); // MARKET, MINT, WALLET
  // mintInput

  // Modal

  // fetchMarketNFTs
  const fetchMarketNFTs = async () => {
    // const _nfts = await fetchCardsOf(MARKET_CONTRACT_ADDRESS);
    const _nfts = await fetchCardsOf(
      "0x749f3E4a1564421FF1EA8399c15800aE6A716F3f"
    );
    setNfts(_nfts);
  };

  // fetchMyNFTs
  const fetchMyNFTs = async () => {
    // const _nfts = await fetchCardsOf(myAddress);
    const _nfts = await fetchCardsOf(
      "0x749f3E4a1564421FF1EA8399c15800aE6A716F3f"
    );
    setNfts(_nfts);
    // balanceOf > 내가 가진 전체 NFT 토큰 개수를 가져온다
    // tokenOfOwnerByIndex > 내가 가진 NFT token ID를 하나씩 가져온다 > 배열로
    // tokenURI > 앞에서 가져온 tokenID를 이용해서 tokenURI를 하나씩 가져온다 >
  };

  // onClickMint
  const onClickMint = async (uri) => {
    if (myAddress === DEFAULT_ADDRESS) alert("Wrong Address");
    const randomTokenId = parseInt(Math.random() * 10000000);
    KlipAPI.mintCardMintURI(
      myAddress,
      randomTokenId,
      uri,
      setQrvalue,
      (result) => {
        alert(JSON.stringify(result));
      }
    );
  };

  // onClickMyCard
  // onClickMarketCard

  // getUserData
  const getUserData = () => {
    KlipAPI.getAddress(setQrvalue, async (address) => {
      setMyAddress(address);
      const _balance = await getBalance(address);
      setMyBalance(_balance);
    });
  };

  // const onClickgetAddress = () => {
  //   KlipAPI.getAddress(setQrvalue);
  // };
  // const onClicksetCount = () => {
  //   KlipAPI.setCount("777", setQrvalue);
  // };

  return (
    <div className="App">
      <div style={{ backgroundColor: "pink", padding: 10 }}>
        {/* 주소 잔고 */}
        <div style={{ marginBottom: "1em" }}>내 지갑</div>
        {myAddress}
        <Alert
          className="alert-balance"
          style={{ fontSize: 20, cursor: "pointer" }}
          onClick={getUserData}
        >
          {myBalance}
        </Alert>
      </div>
      <Container
        style={{
          backgroundColor: "#61dafb",
          width: 300,
          height: 300,
          padding: 20,
        }}
      >
        <QRCode value={qrvalue} size={256} style={{ margin: "auto" }} />
      </Container>
      <a href="/">hello world</a>
      <button onClick={fetchMyNFTs} style={{ cursor: "pointer" }}>
        NFT 가져오기
      </button>

      {/* 갤러리(마켓, 내 지갑) */}
      {tab === "MARKET" || tab === "WALLET" ? (
        <div className="container" style={{ padding: 0, width: 300 }}>
          {nfts.map((nft, index) => {
            return (
              <>
                {/* <CardImg key={index} src={nft.uri} /> */}
                <Card.Img
                  key={index}
                  className="img-responsive"
                  src={nft.uri}
                />
                {/* <div>
                HELLO!!!</div> */}
              </>
            );
            // console.log(nft.uri)
          })}
        </div>
      ) : null}

      {/* 발행 페이지 */}
      {tab === "MINT" ? (
        <div className="container" style={{ padding: 0, width: "100%" }}>
          <Card className="text-center" style={{ height: "50%" }}>
            <Card.Body>
              {mintImgUrl !== "" ? (
                <Card.Img src={mintImgUrl} style={{width: '200px'}} />
              ) : null}
              <Form>
                <Form.Group>
                  <Form.Control
                    value={mintImgUrl}
                    onChange={(e) => {
                      console.log(e.target.value);
                      setMintImgUrl(e.target.value);
                    }}
                    type="text"
                    placeholder="이미지 주소를 입력해주세요."
                  />
                  <Button
                    variant="primary"
                    style={{
                      backgroundColor: "hotpink",
                      borderColor: "hotpink",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      onClickMint(mintImgUrl);
                    }}
                  >
                    발행하기
                  </Button>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </div>
      ) : null}
      {/* 탭 */}
      <nav
        className="navbar fixed-bottom navbar-light"
        role="navigation"
        style={{ backgroundColor: "palegoldenrod", height: 45 }}
      >
        <Nav className="w-100">
          <div className="d-flex flex-row justify-content-around w-100">
            <div
              onClick={() => {
                setTab("MARKET");
                fetchMarketNFTs();
              }}
              className="row d-flex flex-column justify-content-center align-items-center"
              style={{ cursor: "pointer" }}
            >
              <div>MARKET</div>
            </div>

            <div
              onClick={() => {
                setTab("MINT");
                fetchMarketNFTs();
              }}
              className="row d-flex flex-column justify-content-center align-items-center"
              style={{ cursor: "pointer" }}
            >
              <div>MINT</div>
            </div>

            <div
              onClick={() => {
                setTab("WALLET");
                fetchMarketNFTs();
              }}
              className="row d-flex flex-column justify-content-center align-items-center"
              style={{ cursor: "pointer" }}
            >
              <div>WALLET</div>
            </div>
          </div>
        </Nav>
      </nav>

      {/* 모달 */}
    </div>
  );
}

export default App;
