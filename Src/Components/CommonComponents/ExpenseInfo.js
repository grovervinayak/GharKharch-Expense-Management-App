import React, { Component } from 'react';
import {connect} from "react-redux";
import {Text, View, StyleSheet, Button, Alert,TextInput, ScrollView, Image, TouchableOpacity, TouchableHighlight, FlatList, Animated} from 'react-native';
import firestore from '@react-native-firebase/firestore';

import { scale, moderateScale, verticalScale, round, printDate, week_first_day, week_last_day, 
    week_document_name, week_first_date, week_last_date} from '../Scaling';
  import {SingleExpenseCard} from "./SingleExpense";
  import {Divider, DividerBorderLess} from "./OtherCommonComponents";
  
  import {
    listWeekExpenses, getStartEndDate, thisMonthExpensesList, lastMonthExpensesList, emptyThisMonthExpenses
  } from "../../Actions/listWeekExpenses";
  import {checkActivityMessage, checkActivityLoader, checkActivityError, enteredActivityMessage} from "../../Actions/activityActions";
  import {ExpenseCardUpdated} from "./SingleExpense";

import Icon from "react-native-vector-icons/AntDesign";
import Ripple from "react-native-material-ripple";
import { Easing } from 'react-native-reanimated';

class ExpenseInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            text: "",
            phone_number:"",
            refreshing:false,
            loading:this.props.animate_width,
            animate_width:this.props.animate_width,
            unique_item: 1,
            show: false
        };
    }

    toggleAnimation(index) {
        var animate_width = this.state.animate_width;
           if(animate_width[index].view_state === true){
           Animated.timing(animate_width[index].value, {
             toValue : 180,
             timing : 100,
             useNativeDriver: false
           }).start(()=>{
               animate_width[index].view_state = false;
             this.setState({viewState : false, animate_width: animate_width})
           });
           }
           else{
               
             Animated.timing(animate_width[index].value, {
               toValue : 0,
               timing : 100,
               useNativeDriver: false
             }).start(()=>{
               animate_width[index].view_state = true;
                 this.setState({viewState: true, animate_width: animate_width})
             });
           }
    }

    deleteItem(single_detail) {
        this.props.checkActivityLoader(true);
        var day = single_detail.expense_date.toDate().getDay();
        if(day === 0){
          day = 7;
        }
        var first_day = week_first_day(single_detail.expense_date.toDate(), day);
            var last_day = week_last_day(first_day);
            const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
            const document_name = week_document_name(first_day);
            var first_date = week_first_date(first_day);
        var last_date = week_last_date(last_day);
        var expense_month = single_detail.expense_date.toDate().getMonth();
    
        var expense_price = parseFloat(single_detail.expense_price);
        expense_price = Math.round((expense_price + Number.EPSILON) * 100) / 100;
        console.log(expense_price);
        console.log("Week_Card", document_name);
    
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
        user_doc.collection('WeekExpenses').doc(document_name).get().then((res)=>{
          console.log(res._data);
          var week_card_detail = res._data;
        user_doc.collection('WeekExpenses').doc(document_name).update({
          week_total_expense: round(week_card_detail.week_total_expense - expense_price)
        }).then(res=>{
          
        })
      })
    
        user_doc.collection('DailyExpenses').doc(single_detail.key).delete().then(res=>{
          this.props.checkActivityMessage(true, "ExpenseList");
          this.props.enteredActivityMessage("Expense is Deleted Successfully");
          this.setState({
            action_done:"Delete",
            unique_item:this.state.unique_item+1
          })
          this.props.checkActivityLoader(false);
          setTimeout(()=>{
            this.props.checkActivityMessage(false, "ExpenseList");
          }, 3000);
        });
      }

    render() {
        return (
            <View>
            <Ripple onPress={()=>{
                this.toggleAnimation(this.props.index);
                console.log("huhsuas");
            }}>
                <View style={{marginHorizontal:25}}>
                    <ExpenseCardUpdated single_expense={this.props.item}
                                        navigation={this.props.navigation}/>
                    
                    
                    
                    <DividerBorderLess/>
                </View>
                </Ripple>
                <Animated.View style={{position:'absolute', backgroundColor:'white', right:0, height:'99%', width:this.state.animate_width[this.props.index].value, flexDirection:'row', alignItems:'center', elevation:0, justifyContent:'space-around', overflow:'hidden', zIndex:9}}>  
                        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-around', position:'absolute', right:10, zIndex:10}}>
                            <TouchableOpacity style={{width:49, height:49, backgroundColor:'green', borderRadius:100, flexDirection:'row', alignItems:'center', justifyContent:'space-around', elevation:5, marginRight:20, zIndex:99}}
                                              onPress={()=>{
                                                this.props.navigation.navigate("AddNewExpense", {
                                                    page_name: "Edit",
                                                    single_detail: this.props.item
                                                  })
                                                  var animate_width = this.state.animate_width;
                                                  animate_width[this.props.index].view_state = false;
                                                  animate_width[this.props.index].value = new Animated.Value(0);
                                                  this.setState({
                                                      unique_item: this.state.unique_item + 1,
                                                      animate_width: animate_width
                                                  })

                                              }}>
                                <Icon name={"edit"} size={18} color={"white"}/>
                            </TouchableOpacity>
                            <TouchableOpacity style={{width:49, height:49, backgroundColor:'#F34A30', borderRadius:100, flexDirection:'row', alignItems:'center', justifyContent:'space-around', elevation:5}}
                                              onPress={()=>{
                                                this.deleteItem(this.props.item);
                                              }}>
                                <Icon name={"delete"} size={18} color={"white"}/>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </View>
        )
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
      error_page_name: activityReducer.error_page_name,
      entered_activity_message: activityReducer.entered_activity_message,
      recent_expenses: addExpenseReducer.recent_expenses,
      this_month_expenses: addExpenseReducer.this_month_expenses,
      last_month_expenses: addExpenseReducer.last_month_expenses
    };
  }, (dispatch) => {
    return {
      listWeekExpenses:(week_expenses) => dispatch(listWeekExpenses(week_expenses)),
      getStartEndDate:(week_expense_date) => dispatch(getStartEndDate(week_expense_date)),
      checkActivityMessage:(message_state, page_name) => dispatch(checkActivityMessage(message_state, page_name)),
      checkActivityError:(error_state, page_name) => dispatch(checkActivityError(error_state, page_name)),
      checkActivityLoader:(loader_state) => dispatch(checkActivityLoader(loader_state)),
      recentExpensesList:(recent_expenses, page_name) => dispatch(recentExpensesList(recent_expenses, page_name)),
      thisMonthExpensesList:(this_month_expenses) => dispatch(thisMonthExpensesList(this_month_expenses)),
      lastMonthExpensesList: (last_month_expenses) => dispatch(lastMonthExpensesList(last_month_expenses)),
      emptyThisMonthExpenses: () => dispatch(emptyThisMonthExpenses()),
      enteredActivityMessage: (entered_activity_message) => dispatch(enteredActivityMessage(entered_activity_message))
  }})(ExpenseInfo);

export default WrappedComponent;
