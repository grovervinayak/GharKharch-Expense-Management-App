import React, { Component, useEffect } from 'react';
import {connect} from "react-redux";
import {Text, View, StyleSheet, Button, Alert,TextInput, ScrollView, Image, TouchableOpacity, TouchableHighlight} from 'react-native';
import auth from "@react-native-firebase/auth";
import RNOtpVerify from 'react-native-otp-verify';
import AsyncStorage from '@react-native-community/async-storage';
import {country_codes} from "../Core/countryCodes";
import {Picker} from '@react-native-community/picker';
import { scale, moderateScale, verticalScale} from './Scaling';
import Icon from "react-native-vector-icons/AntDesign";

import {ActivityMessage, ActivityLoader, ActivityError} from "./CommonComponents/ActivityCards";

import {checkActivityMessage, checkActivityLoader, checkActivityError} from "../Actions/activityActions";

class PhoneLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
    	text: "",
      phone_number:"",
      confirmResult:{},
      number_code:"+91"
   	};
  }

  handleSendCode()
  {
      const phone_number= this.state.number_code+this.state.phone_number;
      this.props.checkActivityLoader(true);
      auth()
      .signInWithPhoneNumber(phone_number)
      .then(confirmResult => {
        this.setState({ confirmResult })
        this.props.checkActivityLoader(false);
        this.props.navigation.navigate('VerifyOTP',{
          confirmResult: confirmResult,
          phone_number: phone_number,
          number_code: this.state.number_code
        });
        
      })
      .catch(error => {
        alert(error.message);
        this.props.checkActivityLoader(false);
      })
  }

  useEffect() {

    RNOtpVerify.getOtp()
      .then(p =>
        RNOtpVerify.addListener(message => {
          try {
            if (message) {
              console.log(message);
            }
          } catch (error) {
          }
        }),
      )
      .catch(error => {
      });

    // remove listener on unmount
    return () => {
      RNOtpVerify.removeListener();
    };
  }

  render() {
    return (
      <View>
        <ScrollView keyboardShouldPersistTaps={'handled'} style={{height:'100%', width:'100%', backgroundColor:'white'}}>
      <View style={PhoneLoginStyles.phoneView}>
        <View>

          <View>
            <Image source={{uri:ENV_CONSTANTS.LOGIN_IMAGE}}
                   style={{ height: 150}}>
            </Image>
          </View>

          <View style={{width:'100%'}}>
            <Text style={{fontFamily:'Oswald-Bold', color:'#63A335', letterSpacing:1, paddingLeft:scale(45)}}>
              YOUR PERSONAL EXPENSE MANAGER
            </Text>
          </View>

          <View style={{marginTop:5}}>
            <Image source={{uri:ENV_CONSTANTS.LOGIN_IMAGE}}
                   style={{width: 300, height: 300}}>
            </Image>
          </View>

          <View style={{marginTop:15, flexDirection:'row', justifyContent:'flex-start'}}>
            <Picker
              style={{ height: 50, width: scale(100), fontFamily:'Montserrat-Regular', opacity:0, position:'absolute', zIndex:9}}
              mode={'dropdown'}
              selectedValue={this.state.number_code}
              onValueChange={(itemValue, itemIndex) => {
                this.setState({
                  number_code: itemValue
                })
              }}

            >
                {country_codes.map((single_category)=>
                  <Picker.Item label={single_category.name+"("+single_category.dial_code+")"} value={single_category.dial_code} key={single_category.dial_code}/>)}
            </Picker>
            <View style={{height: 50, borderColor: 'gray', borderWidth: 1, paddingLeft:10, paddingRight:12, borderTopLeftRadius:3,borderBottomLeftRadius:3, borderColor:'#63A335', flexDirection:'row', alignItems:'center'}}>
            <Text style={{fontSize:scale(16)}}>{this.state.number_code}</Text>
            <Icon name="caretdown" style={{paddingLeft:5}} size={10}/>
            </View>
            <TextInput
                style={{ height: 50, borderColor: 'gray', borderWidth: 1, paddingLeft:17, borderTopRightRadius:3, borderBottomRightRadius:3, borderColor:'#63A335', fontSize:18, width:scale(230)}}
                placeholder="Phone Number"
                keyboardType="numeric"
                maxLength={10}
                value={this.state.phone_number}
                onChangeText={value=>{
                  this.setState({
                    phone_number:value
                  })
                }}
            />
          </View>
          <TouchableOpacity 
            activeOpacity={0.8}
            style={{width:200, backgroundColor:'#63A335', height:45, alignSelf:'center', marginTop:25, flexDirection:'row', justifyContent:'center', borderRadius:100, elevation: 3, marginBottom:10}}
            onPress={this.handleSendCode.bind(this)}>
              <Text style={{color:'white', alignSelf:'center'}}>
                LOGIN
              </Text>
          </TouchableOpacity>

        </View>
      </View>
      
        </ScrollView>
        {this.props.activity_message && this.props.message_page_name === "PhoneLogin" ? <ActivityMessage message={category_message}/> : null}
        {this.props.activity_error && this.props.error_page_name === "PhoneLogin" ? <ActivityError error={this.state.error_message}/> : null}
        {this.props.activity_loader ? <ActivityLoader/> : null}
        </View>
    );
  }
}

const WrappedComponent = connect(({activityReducer}) => {
  return {
    activity_message: activityReducer.activity_message,
    activity_error: activityReducer.activity_error,
    activity_loader: activityReducer.activity_loader,
    message_page_name: activityReducer.message_page_name,
    error_page_name: activityReducer.error_page_name
  };
}, (dispatch) => {
  return {
    checkActivityMessage:(message_state, page_name) => dispatch(checkActivityMessage(message_state, page_name)),
    checkActivityError:(error_state, page_name) => dispatch(checkActivityError(error_state, page_name)),
    checkActivityLoader:(loader_state) => dispatch(checkActivityLoader(loader_state))
}})(PhoneLogin);

export default WrappedComponent;

const PhoneLoginStyles = StyleSheet.create({
  phoneView:{
    backgroundColor: '#fff',
    alignItems: 'center',
    flex:1,
    flexDirection:'column'
  },

})