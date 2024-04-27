import React, { Component, useEffect } from 'react';
import {Text, View, StyleSheet, Button, Alert,TextInput, ScrollView, Image, TouchableOpacity, TouchableHighlight, PermissionsAndroid} from 'react-native';
import { scale, moderateScale, verticalScale} from './Scaling';
import {connect} from "react-redux";
import Icon from "react-native-vector-icons/AntDesign";
import DateTimePicker from '@react-native-community/datetimepicker';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';

import {EventCardOuter, EventCardInnerUpper, EventCardInnerLower} from "./CommonComponents/SingleCard";
import {ActivityMessage, ActivityLoader, ActivityError} from "./CommonComponents/ActivityCards";

import {checkActivityMessage, checkActivityLoader, checkActivityError} from "../Actions/activityActions";

class CreateEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
    	text: "",
      phone_number:"",
      show_calendar:false,
      expense_date:"",
      start_date_button:"Today",
      end_date_button:"Today",
      today_date:new Date(),
      date_button:"",
      name_style:{
        marginTop:3,
        marginBottom:-7,
        paddingLeft:3,
        color:'#9E9E9E',
        "fontFamily":'Montserrat-Regular'
      },
      create_event:{
        "event_name":"",
        "event_price":0,
        "start_date":new Date(),
        "end_date":new Date(),
        "event_users":[this.props.user_data.phone_number],
        "notification_key":"",
        "event_users_expenses":[{
          "user_name":this.props.user_data.user_name,
          "user_phone_number":this.props.user_data.phone_number,
          "user_expense":0,
          "user_share_status":"Added",
          "user_designation":"Host"
        }]
      }
   	};
  }

  friendsPermission() {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS
    ).then(res=>{
      if(res === "granted"){
        this.props.navigation.navigate("FriendsList");
      }
    })
  }

  createEvent() {
    firestore().collection("Events").add(this.state.create_event).then(res=>{
      console.log(res._documentPath._parts[1]);
      this.props.navigation.goBack();
    })
    .catch(err=>{

    })
  }

  render() {

    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

    return (

      <View style={PhoneLoginStyles.phoneView}>
        <View style={{backgroundColor:'#078D1D', width:'100%', height:verticalScale(57), elevation:5}}>
        <TouchableOpacity style={{position:'absolute', paddingTop:verticalScale(18), paddingLeft:10, zIndex:1, paddingRight:15}}
                            onPress={()=>{
                              this.props.navigation.goBack();
                            }}>
            <Icon name={"arrowleft"} color={'white'} size={20} style={{}}/>
          </TouchableOpacity>
          <Text style={{color:'white', paddingTop:15, fontSize:scale(18), paddingLeft:37, fontFamily:'Montserrat-Bold'}}>
            Create Event
          </Text>
        </View>
        <ScrollView>
        <View style={{marginTop:20, marginHorizontal:15}}>
          <View>
            <Text style={this.state.name_style}>Event Name</Text>
            <TextInput style={{borderBottomWidth:1, marginTop:0, borderColor:'#9E9E9E'}}
                       onChangeText={(name)=>{
                        this.setState({
                          create_event:{
                            ...this.state.create_event,
                            "event_name":name
                          }
                        })
                       }}/>
          </View>
          <View style={{marginTop:25, flexDirection:'row', justifyContent:'space-between'}}>

            <View>
              <Text style={this.state.name_style}>Start Date</Text>
              <TouchableOpacity style={{width:scale(130), flexDirection:'row', alignItems:'center', backgroundColor:'white', marginTop:15, paddingHorizontal:25, paddingVertical:12, elevation:5, borderRadius:4}}
                                onPress={()=>{
                                  this.setState({
                                    show_calendar:true,
                                    expense_date:"start_date",
                                    date_button:"start_date_button"
                                  })
                                }}>
                <Icon name="calendar" color={'grey'} size={19} style={{paddingTop:1, paddingRight:8}}/>
                <Text style={{color:'grey', alignSelf:'center', fontFamily:'Montserrat-Bold', fontSize:scale(13)}}>
                  {this.state.start_date_button}
                </Text>
              </TouchableOpacity>
            </View>

            <View>
              <Text style={this.state.name_style}>End Date</Text>
              <TouchableOpacity style={{width:scale(130), flexDirection:'row', alignItems:'center', backgroundColor:'white', marginTop:15, paddingHorizontal:25, paddingVertical:12, elevation:5, borderRadius:4}}
                                onPress={()=>{
                                  this.setState({
                                    show_calendar:true,
                                    expense_date:"end_date",
                                    date_button:"end_date_button"
                                  })
                                }}>
                <Icon name="calendar" color={'grey'} size={19} style={{paddingTop:1, paddingRight:8}}/>
                <Text style={{color:'grey', alignSelf:'center', fontFamily:'Montserrat-Bold', fontSize:scale(13)}}>
                  {this.state.end_date_button}
                </Text>
              </TouchableOpacity>
            </View>

          </View>


          <TouchableOpacity 
            activeOpacity={0.8}
            style={{width:moderateScale(225), backgroundColor:'#63A335', height:verticalScale(45), alignSelf:'center', marginTop:verticalScale(33), flexDirection:'row', justifyContent:'center', borderRadius:100, elevation: 3, marginBottom:10}}
            onPress={()=>{
              this.createEvent();
            }}>
              <Text style={{color:'white', alignSelf:'center', fontFamily:'Montserrat-SemiBold', fontSize:scale(14)}}>
                Create Event
              </Text>
          </TouchableOpacity>
        </View>
        </ScrollView>

        {this.state.show_calendar ? (
          <DateTimePicker testID="dateTimePicker"
          value={this.state.create_event[this.state.expense_date]}
          timeZoneOffsetInMinutes={0}
          maximumDate={new Date().setDate(new Date().getDate()+180)}
          minimumDate={new Date().setDate(new Date().getDate()-180)}
          display="default"
          onChange={(event, selectedDate)=>{
            var date_button = this.state[this.state.date_button];
            if(selectedDate !== undefined){
              if(selectedDate.getDate() !== this.state.today_date.getDate()){
                date_button = selectedDate.getDate()+"-"+months[selectedDate.getMonth()]+"-"+selectedDate.getFullYear()%100;
              }
              else{
                date_button = "Today";
              }
            
              this.setState({
                create_event:{
                  ...this.state.create_event,
                  [this.state.expense_date]:new Date(selectedDate)
                },
                [this.state.date_button]:date_button,
                show_calendar:false
              })
              console.log(selectedDate);
            }
            this.setState({
              show_calendar:false
            })
          }}/>) : null}

      </View>
    );
  }
}

const WrappedComponent = connect(({signInReducer, userDashboardDataReducer, activityReducer}) => {
  return {
    userToken: signInReducer.userToken,
    user_data: userDashboardDataReducer.user_data,
    event_users:userDashboardDataReducer.event_users,
    event_contacts:userDashboardDataReducer.event_contacts,
    activity_message: activityReducer.activity_message,
    activity_error: activityReducer.activity_error,
    activity_loader: activityReducer.activity_loader,
    message_page_name: activityReducer.message_page_name,
    error_page_name: activityReducer.error_page_name
  };
}, (dispatch) => {
  return {
    addExpenseAction:(new_expense, user_token) => dispatch(addExpenseAction(new_expense, user_token)),
    checkActivityMessage:(message_state, page_name) => dispatch(checkActivityMessage(message_state, page_name)),
    checkActivityError:(error_state, page_name) => dispatch(checkActivityError(error_state, page_name)),
    checkActivityLoader:(loader_state) => dispatch(checkActivityLoader(loader_state))
}})(CreateEvent);

export default WrappedComponent;

const PhoneLoginStyles = StyleSheet.create({
  phoneView:{
    backgroundColor: '#F6F6F6',
    flex:1,
    flexDirection:'column'
  },

})