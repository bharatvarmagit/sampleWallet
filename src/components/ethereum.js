// Import the crypto getRandomValues shim (**BEFORE** the shims)
import "react-native-get-random-values"

// Import the the ethers shims (**BEFORE** ethers)
import "@ethersproject/shims"

// Import the ethers library
import { ethers } from "ethers";
import { View, Text, Button, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as bip39 from 'bip39'
import { StatusBar } from "expo-status-bar";
const ethTestnet = 'https://goerli.infura.io/v3/c749a25357764064bcf305b4ef923865'
const mnemonic = 'deputy scrub price dose foam morning emerge melt minor garment issue sail'
const privateKey = '0xa454dea6cd0fe78f3793d56659e45b13a6a4c341e56abb58939a544b7cc63795'
const publicKey = '0x04f8c52bee7e247ac036cd63e0bd6cee4a4bfe17d0d3cdf51c7b1f5831d2f525ab8b2288a7356fe2cc5fedcbb9fa67a3dbcf82363e03ee1753fddf014a9dabbdb2'
const address = '0x48fcd81C498c17caFA79dc1bEd272f5AF6580809'
const address2='0x65A56372F2B9D6677ae4b0ecC5D3520038efde41'
const privateKey2 ='0x1ee67c07cb56345fa6c71743893044513c5cbcdedd59b078474c1324daec62e2'
const memonic2 ='claim melt about cover elbow just lesson run aunt hero book pipe'

const Ethereum = () => {
  const provider = new ethers.providers.JsonRpcProvider(ethTestnet)
  const [balance,setBalance] = useState('')
  const [amount,setAmount]=useState(0)

  const [newMnemonic,setNewMnenomic] = useState()
  const [ethPrice,setEthPrice] = useState()
  const [wallet,setWallet] = useState()
  useEffect(()=>{
      getFees()
      // getBalance(address)
      // console.log("is mnemonic valid",ethers.utils.isValidMnemonic(mnemonic))
      // coinMarketApi()
      // console.log("is address valid ?",ethers.utils.isAddress(address))
  },[])

  const coinMarketApi =async()=>{
    const resp = await fetch('https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?id=1027',{
      headers:{
        'X-CMC_PRO_API_KEY': 'f453b848-0478-4e18-850a-3e977d4f800b'
      }
    })
    const json = await resp.json()
    const {price} = json?.data['1027']?.quote?.USD
    setEthPrice(price)
  }


  const getFees=async()=>{
    const gasFee = await provider.getGasPrice()
    const fee = await provider.getFeeData()
  }

  const getBalance =async(add)=>{
    let balance = await provider.getBalance(add)
    balance = ethers.utils.formatEther(balance)
    setBalance(balance)
    console.log("balance ",balance)
    // const mnemonic = providerentropyToMnemonic(ethers.utils.randomBytes(16))
  }

  const createWallet = ()=>{
    if(!newMnemonic){
      const code = new Mnemonic(Mnemonic.Words.ENGLISH);
      setNewMnenomic(code.toString())
      // setNewMnenomic(bip39.generateMnemonic())
      return
    }
    // if(wallet)return
    // let newWallet;
    // newWallet = new ethers.Wallet.createRandom()
    // setWallet(newWallet)
    // console.log("wallet address\n", newWallet.address)
    // console.log("wallet mnemonic phrase\n", newWallet.mnemonic.phrase)
    // console.log("private key\n", newWallet.privateKey)
    // console.log("public key\n", newWallet.publicKey)
  }

  const recoverMnemonic =async()=>{
    console.log("recovering wallet from mnemonic")
    const recoveredWallet = ethers.Wallet.fromMnemonic(mnemonic).connect(provider)
    setWallet(recoveredWallet)
  }


  const recoverPrivate =async()=>{
    console.log("recovering wallet from private key")
    const recoveredWallet = new ethers.Wallet(privateKey2)
    setWallet(recoveredWallet)

  }

  const onSend = async()=>{
    if(amount && ethPrice && amount/ethPrice<0.05){
      const amountEth = amount/ethPrice
      const tx = await wallet.sendTransaction({
        to:address2,
        value:ethers.utils.parseEther(amountEth.toString())
      })
      await tx.wait()
      console.log("transaction done\n",tx)
    }
    console.log("amount too high")
  }
  return (
    <View>
      {newMnemonic&&
      <>
      <Text selectable={true} />
      <Button title="change" />
      </>
      }
      {wallet?
      <>
      <Text>wallet address: {wallet.address}</Text>
      <View style={{flexDirection:'row',alignItems:'center',marginTop:20,width:'100%',justifyContent:'center'}}>
      <TextInput value={amount} onChangeText={setAmount} keyboardType='numeric' style={{width:100,height:40,backgroundColor:'gainsboro'}} placeholder='10' s/>
      <Text>USD</Text>
      <Text style={{left:20}}>{ethPrice&&amount?amount/ethPrice+' eth':''}</Text>
      </View>
      <Button onPress={onSend} title='send'/>
      </>:null
      }
      <Button onPress={createWallet} title='create wallet' />
      <Button onPress={recoverMnemonic} title='recover wallet 1 with mnemonic'/>
      <Button onPress={recoverPrivate} title='recover wallet 2 with private key'/>





      <StatusBar style="auto" />
    </View>
  );
}

export default Ethereum
