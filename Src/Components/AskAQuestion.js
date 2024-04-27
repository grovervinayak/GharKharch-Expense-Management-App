import React, { Component, useEffect } from 'react';
import {connect} from "react-redux";
import {Text, View, StyleSheet, Button, Alert,TextInput, ScrollView, Image, TouchableOpacity, TouchableHighlight, Modal} from 'react-native';
import { scale, moderateScale, verticalScale} from './Scaling';

import firestore from '@react-native-firebase/firestore';

import {ActivityMessage, ActivityLoader, ActivityError} from "./CommonComponents/ActivityCards";
import {MessageModal} from "./CommonComponents/SingleModal";
import {DrawerHeader} from "./CommonComponents/PageHeader";

import {checkActivityMessage, checkActivityLoader, checkActivityError} from "../Actions/activityActions";

class AskAQuestion extends Component {
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
      query_data:{
        "question_title":"",
        "question_description":"",
        "user_name":this.props.user_data.user_name,
        "user_phone_number":this.props.user_data.phone_number,
        "user_email":"",
        "status":"pending"
      },
      error_message:"",
      show_modal:false,
      message_header:"",
      message_description:""
   	};
  }

  showErrorMessage(){
    this.props.checkActivityError(true, "AskAQuestion");
      setTimeout(()=>{
        this.props.checkActivityError(false, "AskAQuestion");
      }, 3000);
  }

  addQuestion(){
    this.props.checkActivityLoader(true);
    firestore().collection('Queries').add(this.state.query_data).then(res=>{
      this.props.checkActivityLoader(false);
      this.setState({
        show_modal:true,
        message_header:"Thank you for getting in Touch!",
        message_description:"We are reviewing your request and on of our team member will get back in touch with you soon."
      })
    })
    .catch(error=>{
      this.setState({
        show_modal:true,
        message_header:"Sorry for inconvenience!",
        message_description:"Unable to submit your request, please try again after sometime."
      })
    })
  }

  pressFunction() {
    this.setState({
                  show_modal:false,
                  query_data:{
                    ...this.state.query_data,
                    question_title:"",
                    question_description:"",
                    user_email:""
                  }
                })
  }

  requestCloseFunction() {
    this.setState({
              add_category:false
            })
  }


  render() {
    return (

      <View style={PhoneLoginStyles.phoneView}>
        
          <DrawerHeader header_name={"Ask Any Question ?"}/>

          <ScrollView>
            <View style={{marginTop:10, marginHorizontal:20}}>
            <Text style={{fontFamily:'NotoSans-Regular', fontSize:scale(13), color:'#6a6a6a'}}>Question Title</Text>
            <TextInput style={{borderBottomWidth:1, marginTop:0, borderColor:'#9E9E9E'}}
                       value={this.state.query_data.question_title}
                       onChangeText={(title)=>{
                        this.setState({
                          query_data:{
                            ...this.state.query_data,
                            question_title:title
                          }
                        })
                       }}/>
          </View>
            <View style={{marginHorizontal:20, marginTop:20}}>
              <Text style={{fontFamily:'NotoSans-Regular', fontSize:scale(13), color:'#6a6a6a'}}>Description</Text>
              <View>
                <TextInput multiline={true} 
                           numberOfLines={5} 
                           textAlignVertical = "top" 
                           value={this.state.query_data.question_description}
                           style={{backgroundColor:'white', marginTop:5, borderWidth:1, borderColor:'#e1e4e86d', borderRadius:5, paddingHorizontal:10, paddingVertical:10, height:verticalScale(100)}}
                           onChangeText={(description)=>{
                            this.setState({
                              query_data:{
                                ...this.state.query_data,
                                question_description:description
                              }
                            })
                           }}
                           />
              </View>
            </View>
            <View style={{marginTop:20, marginHorizontal:20}}>
            <Text style={{fontFamily:'NotoSans-Regular', fontSize:scale(13), color:'#6a6a6a'}}>Email Address (For Further Contact)</Text>
            <TextInput style={{borderBottomWidth:1, marginTop:0, borderColor:'#9E9E9E'}}
                       value={this.state.query_data.user_email}
                       onChangeText={(email)=>{
                        this.setState({
                          query_data:{
                            ...this.state.query_data,
                            user_email:email
                          }
                        })
                       }}/>
          </View>
          <TouchableOpacity 
            activeOpacity={0.8}
            style={{width:moderateScale(225), backgroundColor:'#63A335', height:verticalScale(45), alignSelf:'center', marginTop:verticalScale(33), flexDirection:'row', justifyContent:'center', borderRadius:100, elevation: 3, marginBottom:10}}
            onPress={()=>{
              var mailformat = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
              if(this.state.query_data.question_title === ""){
                this.setState({
                  error_message:"Please Enter a Valid Question Title"
                })
                this.showErrorMessage();
              }
              else
              if(this.state.query_data.question_description === ""){
                this.setState({
                  error_message:"Please Enter a Valid Question Description"
                })
                this.showErrorMessage();
              }
              else
              if(this.state.query_data.user_email === "" || mailformat.test(this.state.query_data.user_email) === false){
                this.setState({
                  error_message:"Please Enter a Valid Email"
                })
                this.showErrorMessage();
              }
              else{
                this.addQuestion();
              }
            }}>
              <Text style={{color:'white', alignSelf:'center', fontFamily:'Montserrat-SemiBold', fontSize:scale(14)}}>
                Send Question
              </Text>
          </TouchableOpacity>
          </ScrollView>
          <MessageModal page_name={"AskAQuestion"}
                        show_modal={this.state.show_modal}
                        requestCloseFunction={this.requestCloseFunction.bind(this)}
                        message_header={this.state.message_header}
                        message_description={this.state.message_description}
                        pressFunction={this.pressFunction.bind(this)}
                        navigation={this.props.navigation}/>
          {this.props.activity_message && this.props.message_page_name === "AskAQuestion" ? <ActivityMessage message={"Thanks for Providing Feedback!"}/> : null}
          {this.props.activity_error && this.props.error_page_name === "AskAQuestion" ? <ActivityError error={this.state.error_message}/> : null}
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
}})(AskAQuestion);

export default WrappedComponent;

const PhoneLoginStyles = StyleSheet.create({
  phoneView:{
    backgroundColor: '#F6F6F6',
    flex:1
  },

})