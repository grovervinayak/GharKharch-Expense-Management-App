import React, { Component, useState, useRef, useEffect} from 'react';
import {connect} from "react-redux";
import {Text, View, StyleSheet, Button, Alert,TextInput, ScrollView, Image, TouchableOpacity, TouchableHighlight} from 'react-native';
import RNOtpVerify from 'react-native-otp-verify';
import auth from "@react-native-firebase/auth";
import AsyncStorage from '@react-native-community/async-storage';
import CountDown from 'react-native-countdown-component';
import firestore from '@react-native-firebase/firestore';

import {
  checkRestoreToken
} from "../Actions/checkSigninStatus";

import {ActivityMessage, ActivityLoader, ActivityError} from "./CommonComponents/ActivityCards";

import {checkActivityMessage, checkActivityLoader, checkActivityError} from "../Actions/activityActions";

class VerifyOTP extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      pin1:"",
      timer:45,
      error_message:"Entered Incorrect OTP"
    };
    var auth_state = true;
    auth().onAuthStateChanged((user)=>{
      if(user){
        
      this.props.checkActivityLoader(true);
        const user_d = firestore().collection('Users');
        user_d.doc(user.uid).get().then((snap)=>{
          if(snap.exists){
            console.log("EXIST");
            AsyncStorage.setItem('user', user.uid).then(res=>{
          this.props.checkRestoreToken(user.uid);
        });
          }
          else{
            const user_det = {
              "user_name":user.displayName,
              "phone_number":user.phoneNumber,
              "user_salary":0,
              "last_month_expenses":0,
              "current_expenses":0,
              "last_month_savings":0,
              "current_savings":0,
              "country_code":this.props.route.params.number_code,
              "last_logged_in":new Date().getMonth(),
              "categories":{
                "Food":0,
                "Travel":0,
                "Others":0
              }
            }
            firestore().collection('Users').doc(user.uid).set(user_det).then((res)=>{
              AsyncStorage.setItem('user', user.uid).then(res=>{
          this.props.checkRestoreToken(user.uid);
        });
            })
          }
          this.props.checkActivityLoader(false);
        })
      }
    })
    this.startTimer();
  }

  componentDidMount()
  {
    this.refs.pin1ref.focus();
    
  }

  verifyUserOTP(){
    const {pin1} = this.state;
    var verificationCode = pin1;
    this.props.checkActivityLoader(true);
    console.log(this.props.route.params.confirmResult);
      this.props.route.params.confirmResult
      .confirm(verificationCode).then(res=>{
        console.log(res);
        this.props.checkActivityLoader(false);
      }).catch(error=>{
        console.log(error);
        this.props.checkActivityLoader(false);
        this.showErrorMessage();
      })
  }

  startTimer = () => {
 this.clockCall = setInterval(() => {
  this.decrementClock();
 }, 1000);
}

decrementClock = () => {  
 if(this.state.timer === 1) clearInterval(this.clockCall)
 this.setState((prevstate) => ({ timer: prevstate.timer-1 }));
};

componentWillUnmount() {
 clearInterval(this.clockCall);
}

resendOTP(){
      auth()
      .signInWithPhoneNumber(this.props.route.params.phone_number)
      .then(confirmResult => {
        this.setState({ confirmResult })
        console.log("Confirm", confirmResult);
      })
      .catch(error => {
        alert(error.message)
      })
}

showErrorMessage(){
    this.props.checkActivityError(true, "VerifyOTP");
      setTimeout(()=>{
        this.props.checkActivityError(false, "VerifyOTP");
      }, 3000);
  }

  render() {
    const {pin1} = this.state;
    var phoneNumber = this.props.route.params.phone_number;
    var crosses = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
    var codedNumber = this.props.route.params.number_code+crosses.substring(this.props.route.params.number_code.length, phoneNumber.length-4)+phoneNumber.substring(phoneNumber.length-4, phoneNumber.length);
    return (
      <View>
        <ScrollView keyboardShouldPersistTaps={'handled'} style={{height:'100%', width:'100%', backgroundColor:'white'}}>
      <View style={PhoneLoginStyles.phoneView}>
        <View>

          <View>
            <Image source={{uri:'https://firebasestorage.googleapis.com/v0/b/gharkharch-74971.appspot.com/o/Ghar%20Kharch%20Logo%2FGHAR%20KHARCH.png?alt=media&token=b7836a95-9a77-44f0-8ac8-455c1eb1a814'}}
                   style={{ height: 150}}>
            </Image>
          </View>

          <View style={{width:'100%'}}>
            <Text style={{fontFamily:'Oswald-Bold', color:'#63A335', letterSpacing:1, paddingLeft:30}}>
              YOUR PERSONAL EXPENSE MANAGER
            </Text>
          </View>

          <View style={{width:250, display:'flex', flexDirection:'column', justifyContent:'space-around'}}>
            <Text style={{fontFamily:'Oswald-Regular', color:'#03B721', letterSpacing:1, paddingLeft:90, fontSize:20, marginTop:20}}>
              Verify OTP
            </Text>
            <View style={{flexDirection:'row', justifyContent:'space-around', width:'100%', display:'flex', marginTop:20}}>
            <Text style={{fontFamily:'NotoSans-Regular', fontSize:15, marginVertical:5, color:'grey', marginLeft:5, textAlign:'center'}}>
              OTP will be sent via <Text style={{fontFamily:'NotoSans-Bold'}}>SMS</Text>
            </Text>
            </View>
            <View style={{flexDirection:'row', justifyContent:'space-around', width:'100%'}}>
            <Text style={{fontFamily:'NotoSans-Regular', fontSize:15, marginVertical:5, color:'grey', marginLeft:5, textAlign:'center'}}>
              You will receive an OTP on <Text style={{fontFamily:'NotoSans-Bold'}}>{codedNumber}</Text>
            </Text>
            </View>
          </View>

          <View>
            <TextInput style={{height:50,  borderColor: 'gray', borderBottomWidth: 1, paddingLeft:13, fontSize:20, borderColor:'grey', letterSpacing:25}}
                       maxLength={6}
                       ref={"pin1ref"}
                       value={this.state.pin1}
                       keyboardType="numeric"
                       onChangeText={(pin1)=>{
                        this.setState({
                          pin1:pin1
                        })
                        
                       }}/>

            {/*<TextInput style={{height:50,  borderColor: 'gray', borderBottomWidth: 1, width:40, paddingLeft:13, fontSize:20, borderColor:'grey'}}
                       maxLength={1}
                       ref={"pin2ref"}
                       keyboardType="numeric"
                       value={this.state.pin2}
                       onChangeText={(pin2)=>{
                        this.setState({
                          pin2:pin2
                        })
                        if(pin2!==""){
                          this.refs.pin3ref.focus();
                        }
                       }}
                       onKeyPress={(e)=>{
                          if(e.nativeEvent.key === "Backspace"){
                            if(this.state.pin2 === ""){
                              this.setState({
                                pin1:""
                              })
                              this.refs.pin1ref.focus();
                            }
                          }
                        }}/>

            <TextInput style={{height:50,  borderColor: 'gray', borderBottomWidth: 1, width:40, paddingLeft:13, fontSize:20, borderColor:'grey'}}
                       maxLength={1}
                       ref={"pin3ref"}
                       keyboardType="numeric"
                       value={this.state.pin3}
                       onChangeText={(pin3)=>{
                        this.setState({
                          pin3:pin3
                        })
                        if(pin3!==""){
                          this.refs.pin4ref.focus();
                        }
                       }}
                       onKeyPress={(e)=>{
                          if(e.nativeEvent.key === "Backspace"){
                            if(this.state.pin3 === ""){
                              this.setState({
                                pin2:""
                              })
                              this.refs.pin2ref.focus();
                            }
                          }
                        }}/>

            <TextInput style={{height:50,  borderColor: 'gray', borderBottomWidth: 1, width:40, paddingLeft:13, fontSize:20, borderColor:'grey'}}
                       maxLength={1}
                       ref={"pin4ref"}
                       keyboardType="numeric"
                       value={this.state.pin4}
                       onChangeText={(pin4)=>{
                        this.setState({
                          pin4:pin4
                        })
                        if(pin4!==""){
                          this.refs.pin5ref.focus();
                        }
                       }}
                       onKeyPress={(e)=>{
                          if(e.nativeEvent.key === "Backspace"){
                            if(this.state.pin4 === ""){
                              this.setState({
                                pin3:""
                              })
                              this.refs.pin3ref.focus();
                            }
                          }
                        }}/>

            <TextInput style={{height:50,  borderColor: 'gray', borderBottomWidth: 1, width:40, paddingLeft:13, fontSize:20, borderColor:'grey'}}
                       maxLength={1}
                       ref={"pin5ref"}
                       keyboardType="numeric"
                       value={this.state.pin5}
                       onChangeText={(pin5)=>{
                        this.setState({
                          pin5:pin5
                        })
                        if(pin5!==""){
                          this.refs.pin6ref.focus();
                        }
                       }}
                       onKeyPress={(e)=>{
                          if(e.nativeEvent.key === "Backspace"){
                            if(this.state.pin5 === ""){
                              this.setState({
                                pin4:""
                              })
                              this.refs.pin4ref.focus();
                            }
                          }
                        }}/>

            <TextInput style={{height:50,  borderColor: 'gray', borderBottomWidth: 1, width:40, paddingLeft:13, fontSize:20, borderColor:'grey'}}
                       maxLength={1}
                       ref={"pin6ref"}
                       keyboardType="numeric"
                       value={this.state.pin6}
                       onChangeText={(pin6)=>{
                        this.setState({
                          pin6:pin6
                        })

                       }}
                       onKeyPress={(e)=>{
                          if(e.nativeEvent.key === "Backspace"){
                            if(this.state.pin6 === ""){
                              this.setState({
                                pin5:""
                              })
                              this.refs.pin5ref.focus();
                            }
                          }
                        }}/>*/}
          </View>

          <View style={{flexDirection:'row', justifyContent:'space-between'}}>
              <Text style={{color:'#A9A9A9',fontFamily:'Oswald-Regular', letterSpacing:1}}>
                {this.state.timer > 9 ? `00:${this.state.timer}` : `00:0${this.state.timer}`}
              </Text>
              {this.state.timer === 0 ? 
                <TouchableOpacity onPress={()=>{
                                  this.setState({
                                    timer:45
                                  })
                                  this.startTimer();
                                  this.resendOTP();
                                }}>
                  <Text style={{fontFamily:'Oswald-SemiBold', color:'#63A335', letterSpacing:1}}>
                    Resend
                  </Text>
                </TouchableOpacity> :
                <Text style={{fontFamily:'Oswald-SemiBold', color:'#63A33544', letterSpacing:1}}>
                  Resend
                </Text> }
          </View>
          
          <TouchableOpacity 
            activeOpacity={0.8}
            style={{width:200, backgroundColor:'#63A335', height:45, alignSelf:'center', marginTop:25, flexDirection:'row', justifyContent:'center', borderRadius:100, elevation: 3, marginBottom:10}}
            onPress={()=>{
              this.verifyUserOTP();
            }}>
              <Text style={{color:'white', alignSelf:'center'}}>
                Verify
              </Text>
          </TouchableOpacity>
        </View>
      </View>
        </ScrollView>
        {this.props.activity_message && this.props.message_page_name === "VerifyOTP" ? <ActivityMessage message={category_message}/> : null}
        {this.props.activity_error && this.props.error_page_name === "VerifyOTP" ? <ActivityError error={this.state.error_message}/> : null}
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
    checkRestoreToken:(user) => dispatch(checkRestoreToken(user)),
    checkActivityMessage:(message_state, page_name) => dispatch(checkActivityMessage(message_state, page_name)),
    checkActivityError:(error_state, page_name) => dispatch(checkActivityError(error_state, page_name)),
    checkActivityLoader:(loader_state) => dispatch(checkActivityLoader(loader_state))
}})(VerifyOTP);

export default WrappedComponent;

const PhoneLoginStyles = StyleSheet.create({
  phoneView:{
    backgroundColor: '#fff',
    alignItems: 'center',
    flex:1,
    flexDirection:'column'
  },

})