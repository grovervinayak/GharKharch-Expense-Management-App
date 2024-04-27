import React, { Component, useEffect } from 'react';
import {connect} from "react-redux";
import {Text, View, StyleSheet, Button, Alert,TextInput, ScrollView, Image, TouchableOpacity, TouchableHighlight, FlatList, Animated} from 'react-native';
import {EventCardOuter} from "./CommonComponents/SingleCard";
import firestore from '@react-native-firebase/firestore';

import { scale, moderateScale, verticalScale, round, printDate, week_first_day, week_last_day, 
  week_document_name, week_first_date, week_last_date} from './Scaling';
import {SingleExpenseCard} from "./CommonComponents/SingleExpense";
import {Divider, DividerBorderLess} from "./CommonComponents/OtherCommonComponents";

import {
  listWeekExpenses, getStartEndDate, thisMonthExpensesList, lastMonthExpensesList, emptyThisMonthExpenses
} from "../Actions/listWeekExpenses";

import {ActivityMessage, ActivityLoader} from "./CommonComponents/ActivityCards";
import {ExpenseCardUpdated} from "./CommonComponents/SingleExpense";
import {checkActivityMessage, checkActivityLoader, checkActivityError} from "../Actions/activityActions";
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';
import Svg from "react-native-svg";
import Icon from "react-native-vector-icons/AntDesign";
import Ripple from "react-native-material-ripple";
import { Easing } from 'react-native-reanimated';
import ExpenseInfo from './CommonComponents/ExpenseInfo';
import { BannerAd, BannerAdSize, TestIds } from '@react-native-firebase/admob';

const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-9891251702854942/7694570617';

var date=new Date();
    date.setDate(1);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);

    const MyLoader = () => (
        <ContentLoader speed={1.2} interval={0.1}>
            
          <Rect x="25" y="10" rx="2" ry="2" width="230" height="15" />
          <Rect x="320" y="10" rx="2" ry="2" width="50" height="16" />
          <Rect x="25"  y="37" rx="2" ry="2" width="100" height="13" />
          <Rect x="290" y="37" rx="2" ry="2" width="80" height="13" />
          
        </ContentLoader>
      )

/* Class for ThisMonth widget in Expenses Tab*/
class RecentExpenses extends Component {
  constructor(props) {
    super(props);
    this.state = {
    	text: "",
      phone_number:"",
      refreshing:false,
      loading:true,
      animate_width:[],
      unique_item: 1,
      show: false
       };
    
    this.retrieveAllExpenses();
       
  }

  /* Retrieve first top expenses from this function, currently not in use */
  retrieveFirstExpenses() {
    firestore().collection("Users").doc(this.props.userToken).collection("DailyExpenses").orderBy("expense_date", "desc").endAt(date).limit(10).get().then(res=>{
        this.props.emptyThisMonthExpenses();
        this.props.thisMonthExpensesList(res);
        var animate_width=[];
        res.forEach((sin, index)=>{
            animate_width.push({
                'value': new Animated.Value(0),
                'view_state': true
            })
        })
        this.setState({
            animate_width: animate_width,
            loading: false
        })
    })
  }

  /* Retrieve more expenses through infinite scrolling, currently not in use*/
  retrieveMoreExpenses() {
    const doc_key = this.props.this_month_expenses[this.props.this_month_expenses.length - 1].expense_date.toDate();
    this.setState({
        refreshing: true
    })
    firestore().collection("Users").doc(this.props.userToken).collection("DailyExpenses").orderBy("expense_date", "desc").startAfter(doc_key).endAt(date).limit(10).get().then(res=>{
        this.props.thisMonthExpensesList(res);
        var animate_width=this.state.animate_width;
        res.forEach((sin, index)=>{
            animate_width.push({
                'value': new Animated.Value(0),
                'view_state': true
            })
        })
        this.setState({
            refreshing: false, 
            animate_width: animate_width
        })
    })
  }

  /* Retrieving all the expenses at once, it will be depricated after the new release in which I will correct the infinite scrolling */
  retrieveAllExpenses() {
    firestore().collection("Users").doc(this.props.userToken).collection("DailyExpenses").orderBy("expense_date", "desc").endAt(date).onSnapshot(res=>{
      this.props.emptyThisMonthExpenses();
      this.props.thisMonthExpensesList(res);
      var animate_width=[];
      res.forEach((sin, index)=>{
          animate_width.push({
              'value': new Animated.Value(0),
              'view_state': true
          })
      })
      this.setState({
          animate_width: animate_width,
          loading: false
      })
  })
  }

  render() {
      var arr=[1,1,1,1,1];
      var card_style={position:'absolute', backgroundColor:'white', right:0, height:'100%', width:this.state.animate_width, flexDirection:'row', alignItems:'center', elevation:0, justifyContent:'space-around', overflow:'hidden'};
    return (

      <View style={PhoneLoginStyles.phoneView} key={this.state.unique_item}>
          <View style={{width:'100%', backgroundColor:'white'}} >
        {this.state.loading === true ?
        <View style={{marginTop:20, height:'100%', width:'100%'}}>
        {arr.map((sin, index)=>
            <View style={{height:75}}><MyLoader/></View>
        )}
        </View>
        :
        <FlatList
            data={this.props.this_month_expenses}
            style={{height:'100%'}}
            renderItem={({item, index})=>
              <ExpenseInfo item={item}
                           index={index}
                           navigation={this.props.navigation}
                           animate_width={this.state.animate_width}
                           loading={this.state.loading}/>
                }
            keyExtractor={item => item.phone_number}
            ListHeaderComponent={<View>
                <BannerAd
      unitId={adUnitId}
      size={BannerAdSize.ADAPTIVE_BANNER}
    />
                                </View>}
            ListFooterComponent={this.state.refreshing ? <View style={{height:80}}><MyLoader/></View> : <View style={{marginBottom:80}}></View>}
            refreshing={this.state.show}
            onRefresh={()=>{
                this.retrieveAllExpenses();
            }}
            ListEmptyComponent={<View style={{backgroundColor:'white'}}>
            <Text style={{alignSelf:'center', marginTop:60, fontFamily:'Montserrat-Bold', fontSize:25, color:'lightgrey'}}>NO ADDED EXPENSES</Text>
            <Image source={{'uri':'https://firebasestorage.googleapis.com/v0/b/gharkharch-74971.appspot.com/o/Ghar%20Kharch%20Logo%2Fanimation_500_kdsvqt2a.gif?alt=media&token=745453bc-c7ea-4b88-bdd0-1cbbae738414'}}
                   style={{height:500, opacity:0.5}}/>
          </View> }
        />    }   
        </View>
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
      error_page_name: activityReducer.error_page_name,
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
      emptyThisMonthExpenses: () => dispatch(emptyThisMonthExpenses())
  }})(RecentExpenses);

export default WrappedComponent;

const PhoneLoginStyles = StyleSheet.create({
  phoneView:{
    backgroundColor: '#F6F6F6',
    flex:1,
    flexDirection:'column',
    height:'100%'
  },

})