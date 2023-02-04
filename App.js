// Import the crypto getRandomValues shim (**BEFORE** the shims)
import "react-native-get-random-values"

// Import the the ethers shims (**BEFORE** ethers)
import "@ethersproject/shims"

// Import the ethers library
import { ethers } from "ethers";
import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import {ButtonGroup} from 'react-native-elements'

const AvalancheTestNet ='https://avalanche-fuji.infura.io/v3/c749a25357764064bcf305b4ef923865'
const ethTestnet = 'https://goerli.infura.io/v3/c749a25357764064bcf305b4ef923865'
const mnemonicEth = 'deputy scrub price dose foam morning emerge melt minor garment issue sail'
const privateKeyEth = '0xa454dea6cd0fe78f3793d56659e45b13a6a4c341e56abb58939a544b7cc63795'
const publicKeyEth = '0x04f8c52bee7e247ac036cd63e0bd6cee4a4bfe17d0d3cdf51c7b1f5831d2f525ab8b2288a7356fe2cc5fedcbb9fa67a3dbcf82363e03ee1753fddf014a9dabbdb2'
const addressEth = '0x48fcd81C498c17caFA79dc1bEd272f5AF6580809'
const addressEth2='0x65A56372F2B9D6677ae4b0ecC5D3520038efde41'
const privateKeyEth2 ='0x1ee67c07cb56345fa6c71743893044513c5cbcdedd59b078474c1324daec62e2'
const memonicEth2 ='claim melt about cover elbow just lesson run aunt hero book pipe'
const networks =['ethereum','avalanche','polygon','bscscan']
const  rpcUrls=[ethTestnet,AvalancheTestNet,'https://rpc-mumbai.maticvigil.com/','https://data-seed-prebsc-1-s1.binance.org:8545/']
const symbols=['ETH','AVAX','MATIC','BNB']
export default function App() {
  //connects to blockchain

  const [provider,setProvider] = useState(new ethers.providers.JsonRpcProvider(ethTestnet))
  const [balance,setBalance] = useState('')
  const [amount,setAmount]=useState(0)
  const [to,setTo] = useState()
  const [networkIndex,setNetworkIndex] = useState(0)
  const [ethPrice,setEthPrice] = useState()
  const [wallet,setWallet] = useState()
  const [gasPrice,setGasPrice] = useState()
  const [recoverEnable,setRecoverEnable]= useState(false)
  const [recoverInput,setRecoverInput]=useState('')
  const [sending,setSending] = useState(false)

  useEffect(()=>{
      getBalance('0x84F4ef47CBef611F63aC85f6f1380f0282C199Ff')
      // console.log("is mnemonic valid",ethers.utils.isValidMnemonic(mnemonic))
      // coinMarketApi()
      // console.log("is address valid ?",ethers.utils.isAddress(address))
  },[])

  useEffect(()=>{

    setProvider(new ethers.providers.JsonRpcBatchProvider(rpcUrls[networkIndex]))
    getFees()
    setWallet(null)
    coinMarketApi()
  },[networkIndex])


  const coinMarketApi =async()=>{
    const resp = await fetch('https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol='+symbols[networkIndex],{
      headers:{
        'X-CMC_PRO_API_KEY': 'f453b848-0478-4e18-850a-3e977d4f800b'
      }
    })
    const json = await resp.json()
    const {price} = json?.data[symbols[networkIndex]]?.quote?.USD
    setEthPrice(price)
    console.log(price)


  }


  const getFees=async()=>{
    const fee = await provider.getFeeData()
    console.log("gas price ",ethers.utils.formatEther(fee.gasPrice))
    console.log("lastBaseFeePerGas",ethers.utils.formatEther(fee.lastBaseFeePerGas))
    console.log("maxFeePerGas",ethers.utils.formatEther(fee.maxFeePerGas))
    console.log("maxPriorityFeePerGas",ethers.utils.formatEther(fee.maxPriorityFeePerGas))
    setGasPrice(ethers.utils.formatEther(fee.maxFeePerGas))
  }


  const getBalance =async(add)=>{

    let balance = await provider.getBalance(add)
    balance = ethers.utils.formatUnits(balance,'ether')
    setBalance(balance)
    console.log("balance ",balance)
    // const mnemonic = providerentropyToMnemonic(ethers.utils.randomBytes(16))
  }

  const  createWallet = ()=>{
    try {
      let newWallet;
      newWallet = new ethers.Wallet.createRandom()
      setWallet(newWallet)
      console.log("wallet address\n", newWallet.address)
      console.log("wallet mnemonic phrase\n", newWallet.mnemonic.phrase)
      console.log("private key\n", newWallet.privateKey)
      console.log("public key\n", newWallet.publicKey)
      getBalance(newWallet.address)
    } catch (error) {
      alert('error ',error)
    }


  }
  const recoverMnemonic =async()=>{
    try {
      console.log("recovering wallet from mnemonic")
      if(!ethers.utils.isValidMnemonic(recoverInput)){
        alert("invalid mnemonic")
        return
      }
      const recoveredWallet = ethers.Wallet.fromMnemonic(recoverInput).connect(provider)
      setWallet(recoveredWallet)
      setRecoverEnable(false)
      setRecoverInput()
      getBalance(recoveredWallet.address)
    } catch (error) {
      alert("recover failed ",error)
    }
  }


  const recoverPrivate =async()=>{
    try {
      console.log("recovering wallet from private key")
      const recoveredWallet = new ethers.Wallet(recoverInput).connect(provider)
      console.log(recoveredWallet)
      setWallet(recoveredWallet)
      setRecoverEnable(false)
      setRecoverInput()
      getBalance(recoveredWallet.address)
    } catch (error) {
      alert('recover failed ',error)
    }

  }

  const onSend = async()=>{
    try {
      setSending(true)
      const amountEth = (Number(amount)/Number(ethPrice)).toFixed(18)
      console.log("type fo amounteth",typeof amountEth,amountEth)
      console.log("type o value",typeof ethers.utils.parseEther(amountEth.toString()).toString())
      console.log("value = ",ethers.utils.parseEther(amountEth.toString()))
      const tx = await wallet.sendTransaction({
        to:to,
        value:ethers.utils.parseEther(amountEth.toString())
      })
      await tx.wait()
      console.log("transaction done\n",tx)
    } catch (error) {
      alert("error sending "+symbols[networkIndex]+' '+error)
    }
    finally{
      setSending(false)
    }

  }

  const onRecover=()=>{
    console.log("need to recover wallet")
    const type = recoverInput.split(' ').length===1?'P':'M'
    if(type==='M'){
      recoverMnemonic()
    }
    else{
      recoverPrivate()
    }
  }

  return (
    <View style={styles.container}>
      <Text>Select BlockChain Network</Text>
      <ButtonGroup
        onPress={ind=>setNetworkIndex(ind)}
        selectedIndex={networkIndex}
        buttons={networks}
        containerStyle={{height: 50}}
     />

      {
        recoverEnable&&
        <View style={{width:'80%',flexDirection:'row',justifyContent:'center',marginVertical:10}}>
        <TextInput style={{width:250,backgroundColor:'gainsboro',paddingHorizontal:5}} onChangeText={setRecoverInput} value={recoverInput}  placeholder='enter mnemonic/private key'/>
        <Button title="recover" onPress={onRecover}/>
        </View>
      }
      {wallet ?
      <>
      <Text selectable={true}>wallet address: {wallet.address}</Text>
      <Text selectable={true}>Balance: {balance+' '+symbols[networkIndex]} </Text>


      <TextInput value={to} onChangeText={setTo} placeholder="address to send" style={{width:200,backgroundColor:'gainsboro',marginTop:50,height:40}}/>

      <View style={{flexDirection:'row',alignItems:'center',marginTop:20,width:'100%',justifyContent:'center'}}>
      <TextInput value={amount} onChangeText={setAmount} keyboardType='numeric' style={{width:100,height:40,backgroundColor:'gainsboro'}} placeholder='10' />
      <Text>USD</Text>
      <Text style={{left:20}}>{ethPrice&&amount?amount/ethPrice+' '+symbols[networkIndex]:''}</Text>
      </View>
      <Text>{'max gas fee : '+gasPrice}</Text>
      <Button onPress={onSend} title={sending?'submitted. waiting for response':'send'} disabled={!ethers.utils.isAddress(to)||sending}/>
      </>:null}

      <Button onPress={createWallet} title='create new wallet'/>
      <Button onPress={()=>setRecoverEnable(true)} title='Recover wallet' />


      {/* <StatusBar style="" /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop:50,
    alignItems: 'center',
    // justifyContent: 'center',
  },
});
