import React, { Component, useEffect } from 'react';
import {connect} from "react-redux";
import {Text, View, StyleSheet, Button, Alert,TextInput, ScrollView, Image, TouchableOpacity, TouchableHighlight, PermissionsAndroid, FlatList} from 'react-native';
import { scale, moderateScale, verticalScale} from './Scaling';
import {Picker} from '@react-native-community/picker';
import firestore from '@react-native-firebase/firestore';
import Icon from "react-native-vector-icons/AntDesign";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import {EventCardOuter, EventCardInnerUpper, EventCardInnerLower, FriendNames} from "./CommonComponents/SingleCard";
import {SingleEventExpense} from "./CommonComponents/SingleExpense";

import {getEventExpenses} from "../Actions/eventActions";

class EventDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
    	text: "",
      phone_number:""
     };
     firestore().collection("Events").doc(this.props.event_item.key).collection("EventExpenses").onSnapshot(res=>{
       this.props.getEventExpenses(res);
     })
  }

  componentDidMount() {
    
  }

  friendsPermission() {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS
    ).then(res=>{
      if(res === "granted"){
        this.props.navigation.navigate("FriendsList", {
          event_item: this.props.event_item
        });
      }
    })
  }

  render() {
    var event_item = this.props.event_item;
    return (

      <View style={PhoneLoginStyles.phoneView}>
        <View style={{backgroundColor:'#078D1D', width:'100%', height:verticalScale(110)}}>
          <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
          <View>
          <TouchableOpacity style={{position:'absolute', paddingTop:verticalScale(18), paddingLeft:10, zIndex:1, paddingRight:15}}
                            onPress={()=>{
                              this.props.navigation.goBack();
                            }}>
            <Icon name={"arrowleft"} color={'white'} size={20} style={{}}/>
          </TouchableOpacity>
          <Text style={{color:'white', paddingTop:verticalScale(15), fontSize:scale(18), paddingLeft:38, fontFamily:'Montserrat-Bold'}}>
            Events
          </Text>
          </View>
          <TouchableOpacity style={{marginRight:15, marginTop:15}}
                            onPress={()=>{
                              this.friendsPermission();
                            }}>
            <MaterialIcon name={"share"} size={28} color={"white"}/>
          </TouchableOpacity>
          </View>
            <TouchableOpacity 
            activeOpacity={0.8}
            style={{width:moderateScale(156), backgroundColor:'white', height:verticalScale(43), alignSelf:'center', marginTop:verticalScale(56), flexDirection:'row', justifyContent:'center', borderRadius:100, elevation: 3, position:'absolute', right:20}}
            onPress={()=>{
              console.log("Hello");
              this.props.navigation.navigate("AddNewExpense", {
                page_name: "EventPage",
                event_item: event_item
              });
            }}>
              <Text style={{color:'#078D1D', alignSelf:'center', fontFamily:'Montserrat-Bold', fontSize:scale(13)}}>
                Add New
              </Text>
          </TouchableOpacity>
        </View>
        <ScrollView>
        <View style={{marginTop:20}}>
          <EventCardOuter>
            <EventCardInnerUpper event_item={event_item}/>
            <View style={{marginTop:10}}>
              <View style={{borderBottomWidth:1, paddingBottom:4, borderColor:'#E0E0E0', marginBottom:9}}>
                <Text style={{fontFamily:'Montserrat-Medium', fontSize:moderateScale(15)}}>Friends</Text>
              </View>
              <View>
              {event_item.event_users_expenses.map((single_user, index)=>
                  <FriendNames key={index} 
                               single_user={single_user}
                               friend_width={single_user.user_expense/event_item.event_price * 100}/>
              )}

              </View>

            </View>
          </EventCardOuter>
              <View style={{borderBottomWidth:1, paddingBottom:4, borderColor:'#E0E0E0', marginBottom:9, marginHorizontal:15}}>
                <Text style={{fontFamily:'NotoSans-Regular', fontSize:moderateScale(16)}}>Event Expenses</Text>
              </View>
          <EventCardOuter>
            <FlatList
              data={this.props.event_expenses}
              renderItem={({item})=><SingleEventExpense/>}
              keyExtractor={item => item.key}
            />
            <SingleEventExpense/>

          </EventCardOuter>

          <TouchableOpacity style={{backgroundColor:'#f40e0e', marginTop:10, marginHorizontal:15, alignItems:'center', flexDirection:'row', justifyContent:'space-around', borderRadius:5, elevation:2, marginBottom:10, paddingVertical:8}}>
            <View style={{flexDirection:'row', alignItems:'center'}}>
            <MaterialIcon name={"exit-to-app"} size={24} color={"white"}/>
            <Text style={{fontFamily:'NotoSans-Bold', color:'white', fontSize:moderateScale(15), marginLeft:6}}>Exit Event</Text>
            </View>
          </TouchableOpacity>
        </View>
        </ScrollView>
      </View>
    );
  }
}

const WrappedComponent = connect(({signInReducer, userDashboardDataReducer, activityReducer, eventReducer, appDataReducer}) => {
  return {
    userToken: signInReducer.userToken,
    user_data: userDashboardDataReducer.user_data,
    event_users: userDashboardDataReducer.event_users,
    event_contacts: userDashboardDataReducer.event_contacts,
    activity_message: activityReducer.activity_message,
    activity_error: activityReducer.activity_error,
    activity_loader: activityReducer.activity_loader,
    message_page_name: activityReducer.message_page_name,
    error_page_name: activityReducer.error_page_name,
    event_list: eventReducer.event_list,
    event_expenses: eventReducer.event_expenses,
    event_item: appDataReducer.event_item
  };
}, (dispatch) => {
  return {
    checkActivityMessage:(message_state, page_name) => dispatch(checkActivityMessage(message_state, page_name)),
    checkActivityError:(error_state, page_name) => dispatch(checkActivityError(error_state, page_name)),
    checkActivityLoader:(loader_state) => dispatch(checkActivityLoader(loader_state)),
    getEventList:(all_events) => dispatch(getEventList(all_events)),
    getEventExpenses:(event_expenses) => dispatch(getEventExpenses(event_expenses))
}})(EventDetails);

export default WrappedComponent;

const PhoneLoginStyles = StyleSheet.create({
  phoneView:{
    backgroundColor: '#F6F6F6',
    flex:1,
    flexDirection:'column'
  },

})