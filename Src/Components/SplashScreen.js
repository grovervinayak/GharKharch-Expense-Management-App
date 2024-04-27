import React, { Component, useEffect } from 'react';
import {Text, View, StyleSheet, Button, Alert,TextInput, ScrollView, Image, TouchableOpacity, TouchableHighlight} from 'react-native';


export default class SplashScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
    	text: "",
      phone_number:""
   	};
  }

  render() {
    return (

      <View style={PhoneLoginStyles.phoneView}>
        
          <View style={{}}> 
            <Image source={{uri:'https://firebasestorage.googleapis.com/v0/b/gharkharch-74971.appspot.com/o/Ghar%20Kharch%20Logo%2F%5BOriginal%20size%5D%20GHAR%20KHARCH%20(1).png?alt=media&token=edefb1a9-0a4e-4b77-84ed-62b3c7dc3e8b'}}
                   style={{ height: 150, width:200, alignSelf:'center'}}>
            </Image>
            <Text style={{fontFamily:'Oswald-Bold', fontSize:50, color:'white'}}>GHAR KHARCH</Text>
          </View>

          <View style={{width:'100%'}}>
            <Text style={{fontFamily:'Oswald-Bold', letterSpacing:1, paddingLeft:30, color:'white', alignSelf:'center'}}>
              YOUR PERSONAL EXPENSE MANAGER
            </Text>
          </View>
      </View>
    );
  }
}

const PhoneLoginStyles = StyleSheet.create({
  phoneView:{
    backgroundColor: '#63a335',
    alignItems: 'center',
    flex:1,
    justifyContent:'center',
    marginTop:-100
  },

})