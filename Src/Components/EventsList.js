import React, { Component, useEffect } from 'react';
import {connect} from "react-redux";
import {Text, View, StyleSheet, Button, Alert,TextInput, ScrollView, Image, TouchableOpacity, TouchableHighlight, FlatList, SectionList} from 'react-native';
import { scale, moderateScale, verticalScale} from './Scaling';
import Icon from "react-native-vector-icons/AntDesign";

import firestore from '@react-native-firebase/firestore';

import {
  getEventList
} from "../Actions/eventActions";
import {
  getEventData
} from "../Actions/appDataActions";
import {ActivityMessage, ActivityLoader, ActivityError} from "./CommonComponents/ActivityCards";

import {checkActivityMessage, checkActivityLoader, checkActivityError} from "../Actions/activityActions";
import {EventCardOuter, EventCardInnerUpper, EventCardInnerLower} from "./CommonComponents/SingleCard";

class EventsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
    	text: "",
      phone_number:""
   	};

    firestore().collection("Events").where("event_users", "array-contains", this.props.user_data.phone_number).onSnapshot(res=>{
      this.props.getEventList(res);
    })

  }

  render() {
    return (

      <View style={PhoneLoginStyles.phoneView}>
        <View style={{backgroundColor:'#078D1D', width:'100%', height:verticalScale(110), elevation:5, marginBottom:15}}>
        <TouchableOpacity style={{position:'absolute', paddingTop:verticalScale(18), paddingLeft:10, zIndex:1, paddingRight:15}}
                            onPress={()=>{
                              this.props.navigation.goBack();
                            }}>
            <Icon name={"arrowleft"} color={'white'} size={20} style={{}}/>
          </TouchableOpacity>
          <Text style={{color:'white', paddingTop:15, fontSize:scale(18), paddingLeft:37, fontFamily:'Montserrat-Bold'}}>
            Events
          </Text>
          <TouchableOpacity 
            activeOpacity={0.8}
            style={{width:moderateScale(156), backgroundColor:'white', height:verticalScale(43), alignSelf:'center', marginTop:verticalScale(56), flexDirection:'row', justifyContent:'center', borderRadius:100, elevation: 3, position:'absolute', right:20}}
            onPress={()=>{
              console.log("Hello");
              this.props.navigation.navigate("CreateEvent", {
                page_name: "Add"
              });
            }}>
              <Text style={{color:'#078D1D', alignSelf:'center', fontFamily:'Montserrat-Bold', fontSize:scale(13)}}>
                Create Event
              </Text>
          </TouchableOpacity>
        </View>
        <SectionList
          sections={this.props.event_list}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (<EventCardOuter>
                                        <EventCardInnerUpper event_item={item}/>
                                        <EventCardInnerLower navigation={this.props.navigation} 
                                                             event_item={item}
                                                             getEventData={this.props.getEventData}/>
                                      </EventCardOuter>)}
          renderSectionHeader={({ section: { title } }) => (
            <View style={{paddingHorizontal:15, backgroundColor:'#fcfcfc', marginBottom:13 }}>
                <Text style={{fontFamily:'NotoSans-Regular', marginVertical:5, color:'grey'}}>{title}</Text>
            </View>
          )}
        />
      </View>
    );
  }
}

const WrappedComponent = connect(({signInReducer, userDashboardDataReducer, activityReducer, eventReducer}) => {
  return {
    userToken: signInReducer.userToken,
    user_data: userDashboardDataReducer.user_data,
    activity_message: activityReducer.activity_message,
    activity_error: activityReducer.activity_error,
    activity_loader: activityReducer.activity_loader,
    message_page_name: activityReducer.message_page_name,
    error_page_name: activityReducer.error_page_name,
    event_list: eventReducer.event_list
  };
}, (dispatch) => {
  return {
    checkActivityMessage:(message_state, page_name) => dispatch(checkActivityMessage(message_state, page_name)),
    checkActivityError:(error_state, page_name) => dispatch(checkActivityError(error_state, page_name)),
    checkActivityLoader:(loader_state) => dispatch(checkActivityLoader(loader_state)),
    getEventList:(all_events) => dispatch(getEventList(all_events)),
    getEventData:(event_item) => dispatch(getEventData(event_item))
}})(EventsList);

export default WrappedComponent;

const PhoneLoginStyles = StyleSheet.create({
  phoneView:{
    backgroundColor: '#F6F6F6',
    flex:1,
    flexDirection:'column'
  },

})