import { View, Text, Button } from 'react-native'
import React from 'react'

const Home = ({navigation}) => {

  return (
    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
      <Button title='Ethereum testnet' onPress={()=>navigation.navigate('ethereum')}/>
      <Button title='polygon testnet' onPress={()=>navigation.navigate('polygon')}/>
      <Button title='avalanche testnet' onPress={()=>navigation.navigate('avalanche')}/>
      <Button title='bscscan testnet' onPress={()=>navigation.navigate('bscscan')}/>
    </View>
  )
}

export default Home
