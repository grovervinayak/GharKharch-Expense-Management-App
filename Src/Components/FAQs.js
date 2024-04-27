import React, { Component, useEffect } from 'react';
import {Text, View, StyleSheet, Button, Alert,TextInput, ScrollView, Image, TouchableOpacity, TouchableHighlight} from 'react-native';


export default class FAQs extends Component {
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
            <Text>FAQs Page</Text>
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