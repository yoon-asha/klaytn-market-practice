import Caver from 'caver-js';
// import CounterABI from '../abi/CounterABI.json'
import KIP17ABI from '../abi/KIP17TokenABI.json'
import {ACCESS_KEY_ID, SECRET_ACCESS_KEY, CHAIN_ID, COUNT_CONTRACT_ADDRESS, NFT_CONTRACT_ADDRESS} from '../constants'

const option = {
  headers: [{
      name: "Authorization",
      value: "Basic " + Buffer.from(ACCESS_KEY_ID + ":" + SECRET_ACCESS_KEY).toString('base64')
    },
    // {name: "Autorization", value: "Basic S0FTSzZURFdIWTNQOFVUNERKOTVXWUZHOk53ckNsX3A4RE5hVm1DRnRaWUtnYTFBTFhBME9OTWp1aDlWUGIxbHI="},
    {
      name: "x-chain-id",
      value: CHAIN_ID
    }
  ]
}

const caver = new Caver(new Caver.providers.HttpProvider("https://node-api.klaytnapi.com/v1/klaytn", option))
const NFTContract = new caver.contract(KIP17ABI, NFT_CONTRACT_ADDRESS)

export const fetchCardsOf = async (address) => {
  // Fetch Balance
  const balance = await NFTContract.methods.balanceOf(address).call()
  console.log('balance > ' + balance)
  // Fetch Token IDs
  const tokenIds = []
  for (let i = 0; i<balance; i++) {
    const id = await NFTContract.methods.tokenOfOwnerByIndex(address, i).call()
    tokenIds.push(id)
  }
  
  // Fetch Token URIs
  const tokenUris = []
  for (let i = 0; i<balance; i++) {
    const id = await NFTContract.methods.tokenURI(tokenIds[i]).call()
    tokenIds.push(id)
  }
}

export const getBalance = (address) => {
  return caver.rpc.klay.getBalance(address).then((responce) => {
    const balance = caver.utils.convertFromPeb(caver.utils.hexToNumberString(responce))
    console.log(`BALANCE: ${balance}`)
    return balance
  })
}


// const CountContract = new caver.contract(CounterABI, COUNT_CONTRACT_ADDRESS)

// export const readCount = async () => {
//   const _count = await CountContract.methods.count().call()
//   console.log(_count)
// }

// export const setCount = async (newCount) => {
//   try {
//     // 사용할 account 설정
//     const privatekey = '0x9b08f0ab9a7c9d6ea74a8eded5df24649fc168e09fd47e12d1bdeba77da40396'
//     const deployer = caver.wallet.keyring.createFromPrivateKey(privatekey)
//     caver.wallet.add(deployer)
//     // 스마트 컨트랙트 실행 트랜잭션 날리기
//     // 결과 확인
//     const receipt = await CountContract.methods.setCount(newCount).send({
//       from: deployer.address, //address
//       gas: '0x4bfd200' //
//     })
//     console.log(receipt)
//   } catch (e) {
//     console.log(`[ERROR_SET_COUNT] ${e}`)
//   }
// }
