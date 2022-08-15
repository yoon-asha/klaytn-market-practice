import axios from "axios";
import { COUNT_CONTRACT_ADDRESS, MARKET_CONTRACT_ADDRESS, NFT_CONTRACT_ADDRESS } from "../constants";

const A2A_API_PREPAER_URL = "https://a2a-api.klipwallet.com/v2/a2a/prepare";
const APP_NAME = "KLAY_MARKET";
// klip api
export const buyCard = async (
  tokenId,
  setQrvalue,
  callback
) => {
  const functionJSON = `{ "constant": false, "inputs": [ { "name": "tokenId", "type": "uint256" }, { "name": "NFTAddress", "type": "address" } ], "name": "buyNFT", "outputs": [ { "name": "", "type": "bool" } ], "payable": true, "stateMutability": "payable", "type": "function" }`;
  executeContract(
    MARKET_CONTRACT_ADDRESS,
    functionJSON,
    "10000000000000000",
    `[\"${tokenId}\",\"${NFT_CONTRACT_ADDRESS}\"]`,
    setQrvalue,
    callback
  );
};

export const listingCard = async (
  fromAddress,
  tokenId,
  setQrvalue,
  callback
) => {
  const functionJSON = ` { "constant": false, "inputs": [ { "name": "from", "type": "address" }, { "name": "to", "type": "address" }, { "name": "tokenId", "type": "uint256" } ], "name": "safeTransferFrom", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }`;
  executeContract(
    NFT_CONTRACT_ADDRESS,
    functionJSON,
    "0",
    `[\"${fromAddress}\",\"${MARKET_CONTRACT_ADDRESS}\",\"${tokenId}\"]`,
    setQrvalue,
    callback
  );
};

export const mintCardMintURI = async (
  toAddress,
  tokenId,
  uri,
  setQrvalue,
  callback
) => {
  const functionJSON = `{ "constant": false, "inputs": [ { "name": "to", "type": "address" }, { "name": "tokenId", "type": "uint256" }, { "name": "tokenURI", "type": "string" } ], "name": "mintWithTokenURI", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }`;
  executeContract(
    NFT_CONTRACT_ADDRESS,
    functionJSON,
    "0",
    `[\"${toAddress}\",\"${tokenId}\",\"${uri}\"]`,
    setQrvalue,
    callback
  );
};

export const executeContract = (
  txTo,
  functionJSON,
  value,
  params,
  setQrvalue,
  callback
) => {
  axios
    .post(A2A_API_PREPAER_URL, {
      bapp: {
        name: APP_NAME,
      },
      type: "execute_contract",
      transaction: {
        // from: "0x8756...4321", // optional 클립 연동하면 굳이x
        to: txTo,
        // 실행할 함수에 대한 abi
        abi: functionJSON,
        value: value, // 단위는 peb. 1 KLAY
        params: params,
      },
    })
    .then((res) => {
      // const request_key = res.data.request_key
      // 위랑 아래랑 같음!!!
      const { request_key } = res.data;
      const qrcode = `https://klipwallet.com/?target=/a2a?request_key=${request_key}`;
      setQrvalue(qrcode);
      let timerId = setInterval(() => {
        axios
          .get(
            `https://a2a-api.klipwallet.com/v2/a2a/result?request_key=${request_key}`
          )
          .then((responce) => {
            if (responce.data.result) {
              console.log(`[RESULT] ${JSON.stringify(responce.data.result)}`);
              callback(responce.data.result);
              clearInterval(timerId);
            }
          });
      }, 1000);
    });
};

export const getAddress = (setQrvalue, callback) => {
  axios
    .post(A2A_API_PREPAER_URL, {
      bapp: {
        name: APP_NAME,
      },
      type: "auth",
    })
    .then((res) => {
      // const request_key = res.data.request_key
      // 위랑 아래랑 같음!!!
      const { request_key } = res.data;
      const qrcode = `https://klipwallet.com/?target=/a2a?request_key=${request_key}`;
      setQrvalue(qrcode);
      let timerId = setInterval(() => {
        axios
          .get(
            `https://a2a-api.klipwallet.com/v2/a2a/result?request_key=${request_key}`
          )
          .then((responce) => {
            if (responce.data.result) {
              console.log(`[RESULT] ${JSON.stringify(responce.data.result)}`);
              // console.log(responce.data.result.klaytn_address)
              callback(responce.data.result.klaytn_address);
              clearInterval(timerId);
            }
          });
      }, 1000);
    });
};

// export const setCount = (count, setQrvalue) => {
//   axios
//     .post(A2A_API_PREPAER_URL, {
//       bapp: {
//         name: APP_NAME,
//       },
//       type: "execute_contract",
//       transaction: {
//         // from: "0x8756...4321", // optional 클립 연동하면 굳이x
//         to: COUNT_CONTRACT_ADDRESS, // contract address
//         // 실행할 함수에 대한 abi
//         abi: '{ "constant": false, "inputs": [{ "name": "_count", "type": "uint256" }], "name": "setCount", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }',
//         value: "0", // 단위는 peb. 1 KLAY
//         params: `[\"${count}\"]`,
//       }
//     })
//     .then((res) => {
//       // const request_key = res.data.request_key
//       // 위랑 아래랑 같음!!!
//       const { request_key } = res.data;
//       const qrcode = `https://klipwallet.com/?target=/a2a?request_key=${request_key}`;
//       setQrvalue(qrcode);
//       let timerId = setInterval(() => {
//         axios
//           .get(
//             `https://a2a-api.klipwallet.com/v2/a2a/result?request_key=${request_key}`
//           )
//           .then((responce) => {
//             if (responce.data.result) {
//               console.log(`[RESULT] ${JSON.stringify(responce.data.result)}`);
//               clearInterval(timerId);
//             }
//           });
//       }, 1000);
//     });
// };
