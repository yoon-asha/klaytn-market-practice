import axios from "axios";
import { COUNT_CONTRACT_ADDRESS } from "../constants";

const A2A_API_PREPAER_URL = "https://a2a-api.klipwallet.com/v2/a2a/prepare";
const APP_NAME = "KLAY_MARKET";
// klip api
export const setCount = (count, setQrvalue) => {
  axios
    .post(A2A_API_PREPAER_URL, {
      bapp: {
        name: APP_NAME,
      },
      type: "execute_contract",
      transaction: {
        // from: "0x8756...4321", // optional 클립 연동하면 굳이x
        to: COUNT_CONTRACT_ADDRESS, // contract address
        // 실행할 함수에 대한 abi
        abi: '{ "constant": false, "inputs": [{ "name": "_count", "type": "uint256" }], "name": "setCount", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }',
        value: "0", // 단위는 peb. 1 KLAY
        params: `[\"${count}\"]`,
      }
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
              callback(responce.data.result.klaytn_address)
              clearInterval(timerId);
            }
          });
      }, 1000);
    });
};
