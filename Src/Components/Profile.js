import React, { Component, useEffect } from 'react';
import {connect} from "react-redux";
import {Text, View, StyleSheet, Button, Alert,TextInput, ScrollView, Image, TouchableOpacity, TouchableHighlight, Modal} from 'react-native';
import Icon from "react-native-vector-icons/AntDesign";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { scale, moderateScale, verticalScale} from './Scaling';

import firestore from '@react-native-firebase/firestore';
import auth from "@react-native-firebase/auth";
import AsyncStorage from '@react-native-community/async-storage';

import {checkActivityMessage, checkActivityLoader, checkActivityError} from "../Actions/activityActions";

import {ActivityMessage, ActivityLoader, ActivityError} from "./CommonComponents/ActivityCards";

import {
  checkRestoreToken
} from "../Actions/checkSigninStatus";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
    	name_style:{
        marginTop:3,
        marginBottom:-7,
        paddingLeft:3,
        color:'#9E9E9E',
        "fontFamily":'Montserrat-Regular'
      },
      add_name:false,
      user_name:""
   	};
  }

  updateName(){
    this.props.checkActivityLoader(true);
    firestore().collection('Users').doc(this.props.userToken).update({
      user_name:this.state.user_name
    }).then(res=>{
      this.props.checkActivityMessage(true, "Profile");
      this.props.checkActivityLoader(false);
      setTimeout(()=>{
        this.props.checkActivityMessage(false, "Profile");
      }, 3000);
    })
    firestore().collection("FMCTokens").doc(this.props.user_data.phone_number).update({
      user_name: this.state.user_name
    }).then(res=>{

    })
    firestore().collection("Events").where("event_users", "array-contains", this.props.user_data.phone_number).get().then(querySnapshot=>{
      querySnapshot.forEach((single_user, index)=>{
        console.log(single_user);
        var user_data = single_user.data();
        const ex_ind = user_data.event_users_expenses.findIndex(({user_phone_number})=> user_phone_number === this.props.user_data.phone_number);
        user_data.event_users_expenses[ex_ind].user_name = this.state.user_name;
        single_user.ref.update({
          event_users_expenses: user_data.event_users_expenses
        })
      })
    })
  }

  signOutUser(){
    auth().signOut().then(res=>{
      AsyncStorage.removeItem('user').then(user=>{
        this.props.checkRestoreToken(null);
        console.log(user);
      })
    })
  }

  showErrorMessage(){
    this.props.checkActivityError(true, "Profile");
      setTimeout(()=>{
        this.props.checkActivityError(false, "Profile");
      }, 3000);
  }

  render() {
    const message="Profile Updated Successfully";
    return (

        
      <View style={PhoneLoginStyles.phoneView}>
        <View style={{backgroundColor:'#078D1D', width:'100%', height:verticalScale(110)}}>
        <View style={{ display:'flex', flexDirection:'row', alignItems:'center', height:verticalScale(60)}}>
        <MaterialIcon name="menu" size={25} color={"white"} style={{marginLeft:15}}
                        onPress={()=>{
                          this.props.navigation.toggleDrawer();
                        }}/>
          <Text style={{color:'white', fontSize:scale(18), paddingLeft:20, fontFamily:'Montserrat-Bold'}}>
            Profile
          </Text>
          </View>
            <TouchableOpacity 
            activeOpacity={0.8}
            style={{width:moderateScale(156), backgroundColor:'white', height:verticalScale(43), alignSelf:'center', marginTop:verticalScale(56), flexDirection:'row', justifyContent:'center', borderRadius:100, elevation: 3, position:'absolute', right:20}}
            onPress={()=>{
              this.setState({
                add_name:true
              })
            }}>
              <Text style={{color:'#078D1D', alignSelf:'center', fontFamily:'Montserrat-Bold', fontSize:scale(13)}}>
                Edit Profile
              </Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={{height:'100%', width:'100%'}}>
        <View style={{backgroundColor:'white', elevation:15, marginTop:20, marginLeft:20, marginBottom:0, marginRight:20, borderRadius:6}}>
          <View style={{paddingLeft:scale(18), paddingTop:verticalScale(10), paddingRight:scale(18)}}>
            <Text style={{fontFamily:'NotoSans-Regular', color:'grey', borderBottomWidth:1, borderColor:'lightgray', paddingBottom:8, marginTop:10}}>Name</Text>
            <Text style={{color:'#03B721', fontFamily:'NotoSans-Regular', marginTop:5, fontSize:22, marginBottom:20}}>
              {this.props.user_data.user_name === "" || this.props.user_data.user_name === null ? "N/A" : this.props.user_data.user_name}
            </Text>
            <Text style={{fontFamily:'NotoSans-Regular', color:'grey', borderBottomWidth:1, borderColor:'lightgray', paddingBottom:8, marginTop:10}}>Phone Number</Text>
            <Text style={{color:'#03B721', fontFamily:'NotoSans-Regular', marginTop:5, fontSize:22, marginBottom:15}}>{this.props.user_data.phone_number}</Text>
          </View>
        </View>

        <TouchableOpacity style={{backgroundColor:'white', elevation:15, marginTop:20, marginLeft:20, marginBottom:40, marginRight:20, borderRadius:6}}
                          onPress={()=>{
                            this.signOutUser();
                          }}>
          <View style={{paddingLeft:20, paddingTop:5, paddingRight:20, paddingBottom:5, flexDirection:'row', justifyContent:'space-between'}}>
            <Text style={{fontFamily:'NotoSans-Regular', color:'grey', fontSize:scale(14), marginTop:10, marginBottom:10}}>Sign Out</Text>
            <Icon name="logout" color={'grey'} size={20} style={{marginTop:12, marginLeft:10}}/>
          </View>
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.add_name}
          onRequestClose={() => {
            this.setState({
              add_name:false
            })
          }}
        >
          <TouchableOpacity style={{position:'absolute', width:'100%', height:'100%', backgroundColor:'#4141418f'}}
                            onPress={()=>{
                              this.setState({
                                add_name:false
                              })
                            }}></TouchableOpacity>
          <View style={{backgroundColor:'white', position:'absolute', bottom:80, width:'100%', alignItems:'center', alignSelf:'center', elevation:10, padding:20}}>
            <View style={{width:'100%'}}>
              <Text style={this.state.name_style}>Change Name</Text>
            <TextInput style={{borderBottomWidth:1, marginTop:0, borderColor:'#9E9E9E'}}
                       onChangeText={(name)=>{
                        this.setState({
                          user_name:name
                        })
                       }}/>
            </View>
            <TouchableOpacity 
            activeOpacity={0.8}
            style={{width:moderateScale(225), backgroundColor:'#63A335', height:verticalScale(45), alignSelf:'center', marginTop:verticalScale(33), flexDirection:'row', justifyContent:'center', borderRadius:100, elevation: 3, marginBottom:10}}
            onPress={()=>{
              if(this.state.user_name === ""){
                this.setState({
                  error_message:"Please Enter a valid Name"
                })
                this.showErrorMessage();
              }
              else {
                this.updateName();
                this.setState({
                  add_name:false
                })
              }
            }}>
              <Text style={{color:'white', alignSelf:'center', fontFamily:'Montserrat-SemiBold', fontSize:scale(14)}}>
                Change Name
              </Text>
          </TouchableOpacity>
          </View>
        </Modal>
        </ScrollView>
        {this.props.activity_message && this.props.message_page_name === "Profile" ? <ActivityMessage message={message}/> : null}
        {this.props.activity_error && this.props.error_page_name === "Profile" ? <ActivityError error={this.state.error_message}/> : null}
        {this.props.activity_loader ? <ActivityLoader/> : null}
      </View>
        
    );
  }
}

const WrappedComponent = connect(({signInReducer, userDashboardDataReducer, activityReducer}) => {
  return {
    userToken: signInReducer.userToken,
    user_data: userDashboardDataReducer.user_data,
    activity_message: activityReducer.activity_message,
    activity_error: activityReducer.activity_error,
    activity_loader: activityReducer.activity_loader
  };
}, (dispatch) => {
  return {
    checkRestoreToken:(user) => dispatch(checkRestoreToken(user)),
    checkActivityMessage:(message_state, page_name) => dispatch(checkActivityMessage(message_state, page_name)),
    checkActivityError:(error_state, page_name) => dispatch(checkActivityError(error_state, page_name)),
    checkActivityLoader:(loader_state) => dispatch(checkActivityLoader(loader_state))
}})(Profile);

export default WrappedComponent;

const PhoneLoginStyles = StyleSheet.create({
  phoneView:{
    backgroundColor: '#fff',
    alignItems: 'center',
    flex:1,
    flexDirection:'column'
  },

})