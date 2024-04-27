import React, { Component, useEffect } from 'react';
import {connect} from "react-redux";
import {Text, View, StyleSheet, Button, Alert,TextInput, ScrollView, Image, TouchableOpacity, TouchableHighlight, PermissionsAndroid, FlatList} from 'react-native';
import { scale, moderateScale, verticalScale} from './Scaling';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import Icon from "react-native-vector-icons/AntDesign";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import Contacts from 'react-native-contacts';

import {EventCardOuter, EventCardInnerUpper, EventCardInnerLower, ContactCard} from "./CommonComponents/SingleCard";
import {ActivityMessage, ActivityLoader} from "./CommonComponents/ActivityCards";
import {MessageModal} from "./CommonComponents/SingleModal";

import {userContacts, addUserInEvent, removeUserInEvent} from "../Actions/userDashboardData";
import {checkActivityMessage, checkActivityLoader, checkActivityError} from "../Actions/activityActions";

class FriendsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
    	text: "",
      phone_number:"",
      name_style:{
        marginTop:3,
        marginBottom:-7,
        paddingLeft:3,
        color:'#9E9E9E',
        "fontFamily":'Montserrat-Regular'
      },
      show_modal:false,
      message_header:"",
      message_description:"",
      user_contacts:this.props.user_contacts
   	};
    Contacts.getAll((err, contacts) => {
    if (err === 'denied'){
      // error
    } else {
      this.props.userContacts(contacts, this.props.route.params.event_item);
    }
  })

  }

  addFriends() {
    var event_item = this.props.route.params.event_item;
    firestore().collection("Events").doc(event_item.key).update({
      event_users_expenses: firestore.FieldValue.arrayUnion.apply(null,this.props.event_users),
      event_users: firestore.FieldValue.arrayUnion.apply(null, this.props.event_contacts)
    })
  }

  checkUserInCollection(single_user) {
    var user_phone_number = single_user.phone_number;
    if(user_phone_number.substring(0,1) !== "+") {
      user_phone_number = this.props.user_data.country_code + user_phone_number;
    }

    firestore().collection("FMCTokens").doc(user_phone_number).get().then((snap)=>{
      console.log(snap);
      if(snap.exists) {
        if(snap.data().user_name !== ""){
          single_user.user_name = snap.data().user_name;
        }
        this.props.addUserInEvent(single_user);
      }
      else
      {
        this.setState({
          show_modal:true,
          message_header:"User Does not Exist!",
          message_description:`${single_user.user_name} is not Using this app. Go to invite Friends and send him/her invite to use this Ghar Kharch App.`
        })
      }
    })
  }

  pressFunction() {
    this.setState({
      show_modal:false
    })
  }

  requestCloseFunction() {
    this.setState({
      add_category:false
    })
  }

  searchFilter(search_term) {
    const items = this.props.user_contacts.filter((data)=>{
      if(search_term == null)
          return data
      else if(data.user_name.toLowerCase().includes(search_term.toLowerCase())){
          return data
      }
    })
    this.setState({
      user_contacts: items
    })
  }

  render() {
    return (

      <View style={PhoneLoginStyles.phoneView}>
        <View style={{backgroundColor:'#078D1D', width:'100%', height:verticalScale(57), elevation:5, justifyContent:'space-between', flexDirection:'row', alignItems:'center'}}>
        <View><TouchableOpacity style={{position:'absolute', paddingLeft:10, zIndex:1, paddingRight:15, paddingTop:3}}
                            onPress={()=>{
                              this.props.navigation.goBack();
                            }}>
            <Icon name={"arrowleft"} color={'white'} size={20} style={{}}/>
          </TouchableOpacity>
          <Text style={{color:'white', fontSize:scale(18), paddingLeft:37, fontFamily:'Montserrat-Bold'}}>
            Friends List
          </Text></View>
          <TouchableOpacity style={{marginRight:19}}
                            onPress={()=>{
                              this.addFriends();
                            }}>
            <Text style={{fontFamily:'NotoSans-Bold', fontSize:moderateScale(18), color:'white'}}>OK</Text>
          </TouchableOpacity>
        </View>
        <View style={{backgroundColor:'white', borderBottomWidth:1, borderColor:'#E0E0E0', paddingLeft:15, flexDirection:'row', alignItems:'center'}}>
          <MaterialIcon name={"search"} size={20} color={"grey"}/>
          <TextInput placeholder={"Search Contact"}
                     style={{fontFamily:'NotoSans-Regular', width:'100%'}}
                     onChangeText={(search_term)=>{
                      this.searchFilter(search_term);
                     }}/>
        </View>
        <FlatList
          data={this.state.user_contacts}
          renderItem={({item})=><ContactCard single_contact={item}
                                             addUserInEvent={this.props.addUserInEvent}
                                             checkUserInCollection={this.checkUserInCollection.bind(this)}/>}
          keyExtractor={item => item.phone_number}
        />
        <MessageModal page_name={"AskAQuestion"}
                        show_modal={this.state.show_modal}
                        requestCloseFunction={this.requestCloseFunction.bind(this)}
                        message_header={this.state.message_header}
                        message_description={this.state.message_description}
                        pressFunction={this.pressFunction.bind(this)}
                        navigation={this.props.navigation}/>
        {this.props.activity_loader ? <ActivityLoader/> : null}
      </View>
    );
  }
}

const WrappedComponent = connect(({signInReducer, userDashboardDataReducer, activityReducer}) => {
  return {
    userToken: signInReducer.userToken,
    user_data: userDashboardDataReducer.user_data,
    user_contacts: userDashboardDataReducer.user_contacts,
    event_users: userDashboardDataReducer.event_users,
    event_contacts: userDashboardDataReducer.event_contacts,
    activity_message: activityReducer.activity_message,
    activity_error: activityReducer.activity_error,
    activity_loader: activityReducer.activity_loader,
    message_page_name: activityReducer.message_page_name,
    error_page_name: activityReducer.error_page_name
  };
}, (dispatch) => {
  return {
    userContacts:(contacts, event_item) => dispatch(userContacts(contacts, event_item)),
    addUserInEvent:(user_contact) => dispatch(addUserInEvent(user_contact)),
    removeUserInEvent:(user_contact) => dispatch(removeUserInEvent(user_contact)),
    checkActivityMessage:(message_state, page_name) => dispatch(checkActivityMessage(message_state, page_name)),
    checkActivityError:(error_state, page_name) => dispatch(checkActivityError(error_state, page_name)),
    checkActivityLoader:(loader_state) => dispatch(checkActivityLoader(loader_state))
}})(FriendsList);

export default WrappedComponent;

const PhoneLoginStyles = StyleSheet.create({
  phoneView:{
    backgroundColor: '#F6F6F6',
    flex:1,
    flexDirection:'column'
  },

})