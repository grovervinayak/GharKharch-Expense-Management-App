import React, { Component, useEffect } from 'react';
import {connect} from "react-redux";
import {Text, View, StyleSheet, Button, Alert,TextInput, ScrollView, Image, TouchableOpacity, TouchableHighlight} from 'react-native';
import { scale, moderateScale, verticalScale} from './Scaling';

import Icon from "react-native-vector-icons/MaterialIcons";

import firestore from '@react-native-firebase/firestore';

import {ActivityMessage, ActivityLoader, ActivityError} from "./CommonComponents/ActivityCards";
import {DrawerHeader} from "./CommonComponents/PageHeader";

import {checkActivityMessage, checkActivityLoader, checkActivityError} from "../Actions/activityActions";

class Feedback extends Component {
  constructor(props) {
    super(props);
    this.state = {
    	icon_state:[{
        "icon_name":"sentiment-very-dissatisfied",
        "icon_value":"Very Dissatisfied",
        "enabled_color":"#a9a9a9"
      },
      {
        "icon_name":"sentiment-dissatisfied",
        "icon_value":"Dissatisfied",
        "enabled_color":"#a9a9a9"
      },
      {
        "icon_name":"sentiment-neutral",
        "icon_value":"Neutral",
        "enabled_color":"#a9a9a9"
      },
      {
        "icon_name":"sentiment-satisfied",
        "icon_value":"Satisfied",
        "enabled_color":"#a9a9a9"
      },
      {
        "icon_name":"sentiment-very-satisfied",
        "icon_value":"Very Satisfied",
        "enabled_color":"#a9a9a9"
      }],
      feedback_data:{
        "feedback_experience":"",
        "feedback_comments":"",
        "feedback_suggestions":"",
        "user_name":this.props.user_data.user_name,
        "user_phone_number":this.props.user_data.phone_number
      },
      error_message:""
   	};
  }

  showErrorMessage(){
    this.props.checkActivityError(true, "Feedback");
      setTimeout(()=>{
        this.props.checkActivityError(false, "Feedback");
      }, 3000);
  }

  addFeedback(){
    this.props.checkActivityLoader(true);
    const feedback_document = firestore().collection('Feedback').doc(this.state.feedback_data.user_phone_number);
    feedback_document.set(this.state.feedback_data).then(res=>{
      this.props.checkActivityMessage(true, "Feedback");
      
      const feedback_data = {
        "feedback_experience":"",
        "feedback_comments":"",
        "feedback_suggestions":"",
        "user_name":this.props.user_data.user_name,
        "user_phone_number":this.props.user_data.phone_number
      };

      this.setState({
        feedback_data: feedback_data
      })

      setTimeout(()=>{
        this.props.checkActivityMessage(false, "Feedback");
        this.props.checkActivityLoader(false);
        this.props.navigation.navigate('Home');
      }, 1300);

    });
      
  }

  render() {
    const colors=["#CC0000", "#ff4444", "#FF8800", "#00C851", "#007E33"];
    return (

      <View style={PhoneLoginStyles.phoneView}>
          
          <DrawerHeader header_name={"Feedback"}/>
          <ScrollView keyboardShouldPersistTaps={'handled'}>
            <View style={{marginLeft:12, marginRight:12, marginTop:20}}>
              <Text style={{fontFamily:'NotoSans-Regular', fontSize:scale(13), color:'#6a6a6a'}}>Rate your Experience *</Text>
              <View style={{backgroundColor:'white', marginTop:5, borderWidth:1, borderColor:'#e1e4e86d', borderRadius:5, paddingHorizontal:10, paddingVertical:20, flexDirection:'row', justifyContent:'space-evenly', flexWrap:'wrap'}}>
                {this.state.icon_state.map((single_icon, index)=>
                  <TouchableOpacity key={index} style={{flexDirection:'column', alignItems:'center', flexBasis:'20%'}}
                                    onPress={()=>{
                                      var {icon_state} = this.state;
                                      icon_state.forEach((icon_single, index1)=>{
                                        if(index1 === index){
                                          icon_single.enabled_color = colors[index1];
                                        }
                                        else{
                                          icon_single.enabled_color = "#a9a9a9";
                                        }
                                      })
                                      this.setState({
                                        icon_state:icon_state,
                                        feedback_data:{
                                          ...this.state.feedback_data,
                                          feedback_experience:this.state.icon_state[index].icon_value
                                        }
                                      })
                                    }}>
                    <Icon name={single_icon.icon_name} size={54} color={single_icon.enabled_color}/>
                    <Text style={{fontFamily:'NotoSans-Regular', color:`${single_icon.enabled_color}`, fontSize:scale(9)}}>{single_icon.icon_value}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <View style={{marginLeft:12, marginRight:12, marginTop:20}}>
              <Text style={{fontFamily:'NotoSans-Regular', fontSize:scale(13), color:'#6a6a6a'}}>Comments *</Text>
              <View>
                <TextInput multiline={true} 
                           numberOfLines={5} 
                           textAlignVertical = "top" 
                           style={{backgroundColor:'white', marginTop:5, borderWidth:1, borderColor:'#e1e4e86d', borderRadius:5, paddingHorizontal:10, paddingVertical:10, height:verticalScale(60)}}
                           onChangeText={(comments)=>{
                            this.setState({
                              feedback_data:{
                                ...this.state.feedback_data,
                                "feedback_comments":comments
                              }
                            })
                          }}/>
              </View>
            </View>

            <View style={{marginLeft:12, marginRight:12, marginTop:20}}>
              <Text style={{fontFamily:'NotoSans-Regular', fontSize:scale(13), color:'#6a6a6a'}}>Suggestions for Future Updates (Optional)</Text>
              <View>
                <TextInput multiline={true} 
                           numberOfLines={5} 
                           textAlignVertical = "top" 
                           style={{backgroundColor:'white', marginTop:5, borderWidth:1, borderColor:'#e1e4e86d', borderRadius:5, paddingHorizontal:10, paddingVertical:10, height:verticalScale(100)}}
                           onChangeText={(suggestions)=>{
                            this.setState({
                              feedback_data:{
                                ...this.state.feedback_data,
                                "feedback_suggestions":suggestions
                              }
                            })
                          }}/>
              </View>
            </View>

            <TouchableOpacity 
              activeOpacity={0.8}
              style={{width:moderateScale(225), backgroundColor:'#63A335', height:verticalScale(45), alignSelf:'center', marginTop:verticalScale(33), flexDirection:'row', justifyContent:'center', borderRadius:100, elevation: 3, marginBottom:10}}
              onPress={()=>{
                if(this.state.feedback_data.feedback_experience === ""){
                  this.setState({
                    error_message:"Please Enter a valid Rating Experience"
                  })
                  this.showErrorMessage();
                }
                else
                if(this.state.feedback_data.feedback_comments === ""){
                  this.setState({
                    error_message:"Please Enter the valid Comments"
                  })
                  this.showErrorMessage();
                }
                else {
                  this.addFeedback();
                }
              }}>
              <Text style={{color:'white', alignSelf:'center', fontFamily:'Montserrat-SemiBold', fontSize:scale(14)}}>
                Send Feedback
              </Text>
          </TouchableOpacity>
          </ScrollView>
          {this.props.activity_message && this.props.message_page_name === "Feedback"? <ActivityMessage message={"Thanks for Providing Feedback!"}/> : null}
          {this.props.activity_error && this.props.error_page_name === "Feedback" ? <ActivityError error={this.state.error_message}/> : null}
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
}})(Feedback);

export default WrappedComponent;

const PhoneLoginStyles = StyleSheet.create({
  phoneView:{
    backgroundColor: '#F6F6F6',
    flex:1
  },

})