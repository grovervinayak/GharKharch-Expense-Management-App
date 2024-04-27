import React, { Component, useEffect } from 'react';
import {connect} from "react-redux";
import {Text, View, StyleSheet, Button, Alert,TextInput, ScrollView, Image, TouchableOpacity, 
        TouchableHighlight,RefreshControl} from 'react-native';
import Icon from "react-native-vector-icons/AntDesign";
import firestore from '@react-native-firebase/firestore';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';

import {SingleExpenseCard, SingleDayExpenseOuter, SingleExpenseDetail, SingleWeekExpenseHeading, ExpenseCardUpdated} from "./CommonComponents/SingleExpense";

import {
  listWeekExpenses, getWeekExpenses, getSwipingEnabled, getStartEndDate
} from "../Actions/listWeekExpenses";

import { scale, moderateScale, verticalScale, round, printDate} from './Scaling';

import {ActivityMessage, ActivityLoader} from "./CommonComponents/ActivityCards";

import {EventCardOuter} from "./CommonComponents/SingleCard";

import {checkActivityMessage, checkActivityLoader, checkActivityError} from "../Actions/activityActions";
import { roundToNearestPixel } from 'react-native/Libraries/Utilities/PixelRatio';
import { add, log } from 'react-native-reanimated';
import logger from 'redux-logger';
import { Divider, DividerBorderLess } from './CommonComponents/OtherCommonComponents';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';
import { ExpenseWeekLoaderHeader, ExpenseWeekLoader } from './SVGLoaders';
import { VictoryBar, VictoryChart, VictoryTheme, VictoryTooltip, VictoryAxis } from "victory-native";
import Svg from "react-native-svg";
import {ExpenseBarGraph} from "./CommonComponents/CommonBarGraphs";

class ExpenseWeekList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      phone_number:"",
      swiping:false,
      action_done:"",
      unique_item:1,
      week_card_detail: this.props.route.params.week_card_detail,
      loading: true
    };
    
    firestore().collection('Users').doc(this.props.userToken).collection('DailyExpenses').orderBy("expense_date","asc").startAt(this.props.start_week_date).endAt(this.props.end_week_date).onSnapshot(res=>{
      this.props.getWeekExpenses(res);
      this.setState({
        loading: false
      })
    })
  }

  deleteItem(single_detail) {
    this.props.checkActivityLoader(true);
    var expense_month = single_detail.expense_date.toDate().getMonth();

    var expense_price = parseFloat(single_detail.expense_price);
    expense_price = Math.round((expense_price + Number.EPSILON) * 100) / 100;
    console.log(expense_price);

    var user_doc = firestore().collection('Users').doc(this.props.userToken);
    if(new Date().getMonth() - expense_month === 1){
      user_doc.update({
        last_month_expenses:round(this.props.user_data.last_month_expenses - expense_price),
        last_month_savings: round(this.props.user_data.last_month_savings + expense_price)
      }).then(res=>{

      })
    }
    else
    if(new Date().getMonth() === expense_month) {
      user_doc.update({
          current_expenses:round(this.props.user_data.current_expenses - expense_price),
          [`categories.${single_detail.expense_category}`]:round(this.props.user_data.categories[single_detail.expense_category] - expense_price)
      }).then(res=>{

      })
    }

    user_doc.collection('WeekExpenses').doc(this.props.route.params.week_card_detail.key).update({
      week_total_expense: round(this.props.route.params.week_card_detail.week_total_expense - expense_price)
    }).then(res=>{
      this.setState({
        week_card_detail:{
          ...this.state.week_card_detail,
          week_total_expense: round(this.state.week_card_detail.week_total_expense - expense_price)
        }
      })
    })

    user_doc.collection('DailyExpenses').doc(single_detail.key).delete().then(res=>{
      this.props.checkActivityMessage(true, "ExpenseWeekList");
      this.setState({
        action_done:"Delete",
        unique_item:this.state.unique_item+1
      })
      this.props.checkActivityLoader(false);
      setTimeout(()=>{
        this.props.checkActivityMessage(false, "ExpenseWeekList");
      }, 3000);
    });
  }

  render() {

    const week_days = [];

    const week_numbers = [1,2,3,4,5,6,7];
    week_numbers.forEach((single_date, index)=>{
      var date = new Date(this.props.start_week_date);
      date.setDate(date.getDate() + index);
      week_days.push(printDate(date));
    })
    const all_week_expenses = this.props.all_week_expenses;
    var category_message;
    if(this.state.action_done === "Delete"){
      category_message = "Expense is deleted successfully";
    }
    else{
      category_message = "Expense is edited successfully";
    }
    return (

        
      <View style={PhoneLoginStyles.phoneView} key={this.state.unique_item}>
        <View style={{backgroundColor:'#078D1D', width:'100%', height:verticalScale(53), elevation:5}}>
        <TouchableOpacity style={{position:'absolute', paddingTop:verticalScale(18), paddingLeft:10, zIndex:1, paddingRight:10}}
                            onPress={()=>{
                              this.props.navigation.goBack();
                            }}>
            <Icon name={"arrowleft"} color={'white'} size={20} style={{}}/>
          </TouchableOpacity>
          <Text style={{color:'white', paddingTop:15, fontSize:scale(18), paddingLeft:32, fontFamily:'Montserrat-Bold'}}>
            Expenses
          </Text>
        </View>
        {this.state.loading === true ? 
        <View>
        <View style={{paddingVertical:10, backgroundColor:'white', height:moderateScale(40), marginTop:15}}>
          <ExpenseWeekLoaderHeader/>
        </View>
        <View style={{marginTop:10, height: moderateScale(240)}}>
          <EventCardOuter>
            <ExpenseWeekLoader/>
          </EventCardOuter>
        </View>
        <View style={{marginTop:10, height: moderateScale(240)}}>
          <EventCardOuter>
            <ExpenseWeekLoader/>
          </EventCardOuter>
        </View>
        </View> : 
        <ScrollView style={{height:'100%', width:'100%', backgroundColor:'#F6F6F6'}} scrollEnabled={!(this.props.swiping)}>

          <SingleWeekExpenseHeading week_card_detail={this.state.week_card_detail}/>

          <View style={{marginTop:10}}>
          {this.state.week_card_detail.week_total_expense === 0 ? 
            <View style={{backgroundColor:'white'}}>
            <Text style={{alignSelf:'center', marginTop:60, fontFamily:'Montserrat-Bold', fontSize:25, color:'lightgrey'}}>NO ADDED EXPENSES</Text>
            <Image source={{'uri':'https://firebasestorage.googleapis.com/v0/b/gharkharch-74971.appspot.com/o/Ghar%20Kharch%20Logo%2Fanimation_500_kdsvqt2a.gif?alt=media&token=745453bc-c7ea-4b88-bdd0-1cbbae738414'}}
                   style={{height:400, opacity:0.5}}/>
          </View> :
          <EventCardOuter>
          <ExpenseBarGraph x_axis={"expense_print_date"}
                           y_axis={"expense_day_price"}
                           data={Object.values(this.props.all_week_expenses)}/>
            </EventCardOuter>}
            {week_numbers.map((single_expense, index)=>
              all_week_expenses[single_expense].expense_details.length === 0 ? null : (<EventCardOuter>
              <SingleDayExpenseOuter key={index} week_day={week_days[index]} week_day_price={all_week_expenses[single_expense].expense_day_price}>
              
              <View style={{backgroundColor:'white', elevation:0, borderRadius:3, borderTopWidth:1, borderColor:'#e1e4e86d', borderBottomWidth:1}}>
                <View style={{paddingTop:10}}>
                  {all_week_expenses[single_expense].expense_details.map((single_detail, index1)=>
                    <View style={{}}>
                    <ExpenseCardUpdated single_expense={single_detail}/>
                    <DividerBorderLess/>
                </View>
                  )}
                </View>
              </View>
            </SingleDayExpenseOuter>
            </EventCardOuter>)
              )}
          </View>
                  </ScrollView>}
          
        
        {this.props.activity_message && this.props.message_page_name === "ExpenseWeekList" ? <ActivityMessage message={category_message}/> : null}
        {this.props.activity_error && this.props.error_page_name === "ExpenseWeekList" ? <ActivityError error={this.state.error_message}/> : null}
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
    all_week_expenses: addExpenseReducer.all_week_expenses,
    swiping: addExpenseReducer.swiping,
    start_week_date: addExpenseReducer.start_week_date,
    end_week_date: addExpenseReducer.end_week_date,
    activity_message: activityReducer.activity_message,
    activity_error: activityReducer.activity_error,
    activity_loader: activityReducer.activity_loader,
    message_page_name: activityReducer.message_page_name,
    error_page_name: activityReducer.error_page_name
  };
}, (dispatch) => {
  return {
    listWeekExpenses:(week_expenses) => dispatch(listWeekExpenses(week_expenses)),
    getWeekExpenses:(all_expenses) => dispatch(getWeekExpenses(all_expenses)),
    getSwipingEnabled:(swiping) => dispatch(getSwipingEnabled(swiping)),
    getStartEndDate:(week_expense_date) => dispatch(getStartEndDate(week_expense_date)),
    checkActivityMessage:(message_state, page_name) => dispatch(checkActivityMessage(message_state, page_name)),
    checkActivityError:(error_state, page_name) => dispatch(checkActivityError(error_state, page_name)),
    checkActivityLoader:(loader_state) => dispatch(checkActivityLoader(loader_state))
}})(ExpenseWeekList);

export default WrappedComponent;

const PhoneLoginStyles = StyleSheet.create({
  phoneView:{
    backgroundColor: '#F6F6F6',
    flex:1,
    flexDirection:'column'
  },

})