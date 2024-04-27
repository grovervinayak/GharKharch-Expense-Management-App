import React, { Component, useEffect } from 'react';
import {connect} from "react-redux";
import {Text, View, StyleSheet, Button, Alert,TextInput, ScrollView, Image, TouchableOpacity, TouchableHighlight} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Icon from "react-native-vector-icons/AntDesign";
import firestore from '@react-native-firebase/firestore';
import { scale, moderateScale, verticalScale} from './Scaling';
import {SingleExpenseCard} from "./CommonComponents/SingleExpense";

import {
  listWeekExpenses, getStartEndDate
} from "../Actions/listWeekExpenses";

import {ActivityMessage, ActivityLoader} from "./CommonComponents/ActivityCards";

import {checkActivityMessage, checkActivityLoader, checkActivityError} from "../Actions/activityActions";
import RecentExpenses from './RecentExpenses';
import {WeeklyExpensesLoader, WeeklyExpensesGraphLoader} from "./SVGLoaders";
import { EventCardOuter, WeeklyExpenseCardOuter } from './CommonComponents/SingleCard';
import {ExpenseBarGraph} from "./CommonComponents/CommonBarGraphs";
import { VictoryBar, VictoryChart, VictoryTheme, VictoryTooltip, VictoryVoronoiContainer, VictoryAxis } from "victory-native";
import Svg from 'react-native-svg';
import { BannerAd, BannerAdSize, TestIds } from '@react-native-firebase/admob';

const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-9891251702854942/7694570617';

class WeeklyExpenses extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      phone_number:"",
      loading: true
    };
    firestore().collection('Users').doc(this.props.userToken).collection('WeekExpenses').orderBy("week_expense_date","desc").onSnapshot(res=>{
      this.props.listWeekExpenses(res);
      this.setState({
          loading: false
      })
    })
  }

  render() {
    const message="Expense Added Successfully";
    const map_svg = [1,1,1,1,1,1];
    const data = [
        { quarter: 1, earnings: 13000 },
        { quarter: 2, earnings: 16500 },
        { quarter: 3, earnings: 14250 },
        { quarter: 4, earnings: 19000 }
      ];
    return (

        
      <View style={PhoneLoginStyles.phoneView}>
        {this.state.loading === true ? 
        <View style={{marginTop:10, marginHorizontal:15}}>
          <View style={{backgroundColor:'white', width:'100%',marginBottom:verticalScale(10), paddingTop:verticalScale(5), paddingLeft:scale(8), paddingBottom:verticalScale(5), height:verticalScale(340), borderRadius:5, borderWidth:1, borderColor:'#e1e4e86d'}}>
                <WeeklyExpensesGraphLoader/>
            </View>
        {map_svg.map((s_m, index)=>
            <View style={{backgroundColor:'white', width:'100%',marginBottom:verticalScale(10), paddingTop:verticalScale(5), paddingLeft:scale(8), paddingBottom:verticalScale(5), height:verticalScale(60), borderRadius:5, borderWidth:1, borderColor:'#e1e4e86d'}} key={index}>
                <WeeklyExpensesLoader/>
            </View>
        )}
        </View> : <ScrollView style={{height:'100%', width:'100%', backgroundColor:'#F6F6F6'}}>
        {this.props.week_expenses_list.length === 0 ?
        <View style={{backgroundColor:'white'}}>
          <Text style={{alignSelf:'center', marginTop:60, fontFamily:'Montserrat-Bold', fontSize:25, color:'lightgrey'}}>NO ADDED EXPENSES</Text>
          <Image source={{'uri':'https://firebasestorage.googleapis.com/v0/b/gharkharch-74971.appspot.com/o/Ghar%20Kharch%20Logo%2Fanimation_500_kdsvqt2a.gif?alt=media&token=745453bc-c7ea-4b88-bdd0-1cbbae738414'}}
                 style={{height:400, opacity:0.5}}/>
        </View> : 
        <View style={{ marginTop:10}}>
            <EventCardOuter>
                <ExpenseBarGraph x_axis={"week_name"}
                                 y_axis={"week_total_expense"}
                                 data={this.props.week_expenses_list}/>
            </EventCardOuter>
          <View>
            {this.props.week_expenses_list.map((single_week,index)=>
            <WeeklyExpenseCardOuter>
                <SingleExpenseCard single_week={single_week} 
                                   key={index} 
                                   navigation={this.props.navigation} 
                                   getStartEndDate={this.props.getStartEndDate}/>
            </WeeklyExpenseCardOuter>
            )}
            <BannerAd
      unitId={adUnitId}
      size={BannerAdSize.ADAPTIVE_BANNER}
    />
          </View>
        </View>}
        <View style={{height:74}}></View>
        
            </ScrollView> }
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
}})(WeeklyExpenses);

export default WrappedComponent;

const PhoneLoginStyles = StyleSheet.create({
  phoneView:{
    backgroundColor: '#F6F6F6',
    flex:1,
    flexDirection:'column'
  },

})