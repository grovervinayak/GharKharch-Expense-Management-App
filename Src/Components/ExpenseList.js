import React, { Component, useEffect } from 'react';
import {connect} from "react-redux";
import {Text, View, StyleSheet, Button, Alert,TextInput, ScrollView, Image, TouchableOpacity, TouchableHighlight} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Icon from "react-native-vector-icons/AntDesign";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import firestore from '@react-native-firebase/firestore';
import { scale, moderateScale, verticalScale} from './Scaling';
import {SingleExpenseCard} from "./CommonComponents/SingleExpense";

import {
  listWeekExpenses, getStartEndDate
} from "../Actions/listWeekExpenses";

import {ActivityMessage, ActivityLoader} from "./CommonComponents/ActivityCards";

import {checkActivityMessage, checkActivityLoader, checkActivityError} from "../Actions/activityActions";
import WeeklyExpenses from './WeeklyExpenses';
import RecentExpenses from './RecentExpenses';
import LastMonthExpenses from "./LastMonthExpenses";

const ExpenseTopTab = createMaterialTopTabNavigator();

function ExpenseTabPage() {
  return (
    <ExpenseTopTab.Navigator tabBarOptions={{
      inactiveTintColor:'lightgray',
      activeTintColor:'white',
      labelStyle: { fontSize: 11, fontFamily:'NotoSans-Regular' },
      style: { backgroundColor: '#078D1D', color:'white'},
      indicatorStyle:{backgroundColor:'white'}
    }}>
      <ExpenseTopTab.Screen name="Weekly Expenses" component={WeeklyExpenses} />
      <ExpenseTopTab.Screen name="This Month" component={RecentExpenses} />
      <ExpenseTopTab.Screen name="Last Months" component={LastMonthExpenses} />
    </ExpenseTopTab.Navigator>
  );
}

class ExpenseList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      phone_number:""
    };
    firestore().collection('Users').doc(this.props.userToken).collection('WeekExpenses').orderBy("week_expense_date","desc").onSnapshot(res=>{
      this.props.listWeekExpenses(res);
    })
  }

  render() {
    const message=this.props.entered_activity_message;
    return (

        
      <View style={PhoneLoginStyles.phoneView}>
        <View style={{backgroundColor:'#078D1D', width:'100%', height:verticalScale(53), display:'flex', flexDirection:'row', alignItems:'center'}}>
        <MaterialIcon name="menu" size={25} color={"white"} style={{marginLeft:15}}
                        onPress={()=>{
                          this.props.navigation.toggleDrawer();
                        }}/>
          <Text style={{color:'white', fontSize:scale(18), paddingLeft:20, fontFamily:'Montserrat-Bold'}}>
            Expenses
          </Text>
        </View>
        
        <ExpenseTabPage/>
        {/*<ScrollView style={{height:'100%', width:'100%', backgroundColor:'#F6F6F6'}}>
        {this.props.week_expenses_list.length === 0 ?
        <View style={{backgroundColor:'white'}}>
          <Text style={{alignSelf:'center', marginTop:60, fontFamily:'Montserrat-Bold', fontSize:25, color:'lightgrey'}}>NO ADDED EXPENSES</Text>
          <Image source={{'uri':'https://firebasestorage.googleapis.com/v0/b/gharkharch-74971.appspot.com/o/Ghar%20Kharch%20Logo%2Fanimation_500_kdsvqt2a.gif?alt=media&token=745453bc-c7ea-4b88-bdd0-1cbbae738414'}}
                 style={{height:500, opacity:0.5}}/>
        </View> : 
        <View style={{marginLeft:20, marginRight:20, marginTop:10}}>
          <View>
            {this.props.week_expenses_list.map((single_week,index)=>
                <SingleExpenseCard single_week={single_week} 
                                   key={index} 
                                   navigation={this.props.navigation} 
                                   getStartEndDate={this.props.getStartEndDate}/>
            )}
          </View>
        </View>}
        
            </ScrollView>*/}
        <TouchableOpacity 
            activeOpacity={0.8}
            style={{width:moderateScale(55), backgroundColor:'#e89110', height:verticalScale(53), alignSelf:'center', bottom:20, flexDirection:'row', justifyContent:'center', borderRadius:200, elevation: 3, position:'absolute', right:20, alignItems:'center'}}
            onPress={()=>{
              console.log("Hello");
              this.props.navigation.navigate("AddNewExpense", {
                page_name: "Add"
              });
            }}>
              <Icon name={"plus"} size={30} color={"white"}/>
          </TouchableOpacity>
        {this.props.activity_message && this.props.message_page_name === "ExpenseList" ? <ActivityMessage message={message}/> : null}
        
        {this.props.activity_loader ? <ActivityLoader/> : null}
      </View>
        
    );
  }
}

const WrappedComponent = connect(({signInReducer, userDashboardDataReducer, addExpenseReducer, activityReducer}) => {
  return {
    userToken: signInReducer.userToken,
    user_data: userDashboardDataReducer.user_data,
    week_expenses_list: addExpenseReducer.week_expenses_list,
    activity_message: activityReducer.activity_message,
    activity_error: activityReducer.activity_error,
    activity_loader: activityReducer.activity_loader,
    entered_activity_message: activityReducer.entered_activity_message,
    message_page_name: activityReducer.message_page_name,
    error_page_name: activityReducer.error_page_name
  };
}, (dispatch) => {
  return {
    listWeekExpenses:(week_expenses) => dispatch(listWeekExpenses(week_expenses)),
    getStartEndDate:(week_expense_date) => dispatch(getStartEndDate(week_expense_date)),
    checkActivityMessage:(message_state, page_name) => dispatch(checkActivityMessage(message_state, page_name)),
    checkActivityError:(error_state, page_name) => dispatch(checkActivityError(error_state, page_name)),
    checkActivityLoader:(loader_state) => dispatch(checkActivityLoader(loader_state))
}})(ExpenseList);

export default WrappedComponent;

const PhoneLoginStyles = StyleSheet.create({
  phoneView:{
    backgroundColor: '#F6F6F6',
    flex:1,
    flexDirection:'column'
  },

})