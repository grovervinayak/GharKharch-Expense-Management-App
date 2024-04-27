import React, { Component, useEffect } from 'react';
import {Text, View, StyleSheet, Button, Alert,TextInput, ScrollView, Image, TouchableOpacity, TouchableHighlight, PixelRatio, Dimensions, Pressable} from 'react-native';
import {connect} from "react-redux";
import OneSignal from 'react-native-onesignal';
import Icon from "react-native-vector-icons/AntDesign";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { scale, moderateScale, verticalScale, round} from './Scaling';

import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import {DashboardExpenseAnalysis, EventCardOuter, EventCardHeadingUpper, ExploreCard, RecentExpensesCardOuter} from "./CommonComponents/SingleCard";
import {ExpenseCardUpdated} from "./CommonComponents/SingleExpense";
import Svg, {Rect, G, Text as TextSvg} from "react-native-svg";
import {SingleCategory} from "./CommonComponents/SingleCategory";
import {Divider, DividerBorderLess} from "./CommonComponents/OtherCommonComponents";
import {userDashboardData} from "../Actions/userDashboardData";
import {recentExpensesList} from "../Actions/listWeekExpenses";
import {getExpectedCategoryData} from "../Actions/appDataActions";
import * as d3 from "d3";
import Ripple from "react-native-material-ripple";
import { BannerAd, BannerAdSize, TestIds } from '@react-native-firebase/admob';
import { ENV_CONSTANTS } from '../Utils/Constants';

const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-9891251702854942/7694570617';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
    	text: "",
      phone_number:"",
      total_budget:0,
      total_expected_budget:0,
      config_data:{
        heading_1:"BUDGET",
        heading_2:"EXPENSES",
        heading_1_data:"Plan your budget and spend wisely. Plan each and every category seperately and save more.",
        heading_2_data:"Analyze each and every expense and control and reduce your extra expenses.",
        heading_1_icon:"account-balance-wallet",
        heading_2_icon:"insert-chart",
        heading_1_link:"Budget",
        heading_2_link:"Expenses"
      }
   	};
    if(__DEV__) {
      console.log("Debug");
    }
    if(this.props.userToken !== null) {

    firestore().collection('Users').doc(this.props.userToken).onSnapshot(res=>{
      this.props.userDashboardData(res);
      this.changeExpected(res);
      var current_month = new Date().getMonth();
      console.log(current_month);
      if(res !== null) {
        messaging().getToken().then(token=>{
          this.props.getExpectedCategoryData(res._data);
          firestore().collection("FMCTokens").doc(res._data.phone_number).get().then(snap=>{
            if(snap.exists){
              if(!snap._data.tokens.includes(token)){
                firestore().collection("FMCTokens").doc(res._data.phone_number).update({
                  tokens: firestore.FieldValue.arrayUnion(token)
                })
              }
            }
            else{
              firestore().collection("FMCTokens").doc(res._data.phone_number).set({
                tokens: firestore.FieldValue.arrayUnion(token),
                phone_number: res._data.phone_number,
                user_name: res._data.user_name
              })
            }
          })
        })
      if(current_month - res._data.last_logged_in === 1){
        console.log("Inside sbsksa");
        var categories = {};
        Object.keys(res._data.categories).forEach((single_category, index)=>{
          Object.assign(categories, {
            [single_category]:0
          });
        });
        firestore().collection('Users').doc(this.props.userToken).update({
          "last_month_expenses":res._data.current_expenses,
          "last_month_savings":parseInt(res._data.user_salary, 10) - res._data.current_expenses,
          "current_expenses":0,
          "categories":categories,
          "last_logged_in":new Date().getMonth()
        }).then(res=>{

        })
      }
      else if(current_month - res._data.last_logged_in > 1){
        var categories = {};
        Object.keys(res._data.categories).forEach((single_category, index)=>{
          Object.assign(categories, {
            [single_category]:0
          });
        });
        firestore().collection('Users').doc(this.props.userToken).update({
          "last_month_expenses":0,
          "last_month_savings":0,
          "current_expenses":0,
          "categories":categories,
          "last_logged_in":new Date().getMonth()
        }).then(res=>{

        })
      }
      }
    })
    firestore().collection("Users").doc(this.props.userToken).collection("DailyExpenses").orderBy("expense_date", "desc").limit(3).onSnapshot(res=>{
      console.log(res);
      this.props.recentExpensesList(res, "dahboard_page");
    })
    

    OneSignal.setLogLevel(6, 0);
    if(__DEV__) {
      OneSignal.init(ENV_CONSTANTS.ONE_SIGNAL_ID_DEV, {kOSSettingsKeyAutoPrompt : false, kOSSettingsKeyInAppLaunchURL: false, kOSSettingsKeyInFocusDisplayOption:2});
    }
    else {
      OneSignal.init(ENV_CONSTANTS.ONE_SIGNAL_ID_PROD, {kOSSettingsKeyAutoPrompt : false, kOSSettingsKeyInAppLaunchURL: false, kOSSettingsKeyInFocusDisplayOption:2});
    }  
    
    OneSignal.inFocusDisplaying(2); // Controls what should happen if a notification is received while the app is open. 2 means that the notification will go directly to the device's notification center.

    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('ids', this.onIds);

    }
    
  }

  onMessageReceived() {
    function onMessageReceived(message) {
      notifee.displayNotification(JSON.parse(message.data.notifee));
    }
  }

  //This function is used for OneSignal listener
  componentWillUnmount() {
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
    OneSignal.removeEventListener('ids', this.onIds);
  }

  //This will show the message on console that message is received
  onReceived(notification) {
    console.log("Notification received: ", notification);
  }

  //When the in app message is opened and what will happen if user click the app message
  onOpened(openResult) {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
  }

  // It will show the device id for push notifications and In App messaging
  onIds(device) {
    console.log('Device info: ', device);
  }

  componentDidMount() {
    var total_budget = this.props.user_data.current_expenses;
    var total_expected_budget = 0;
    if(this.props.user_data.expected_categories !== undefined) {

      var total_b = 0;
      console.log("dsdsd");
      Object.values(this.props.user_data.expected_categories).forEach((cat, index)=> {
        total_b = total_b + cat;
      })
    }
    this.setState({
      total_budget: total_b,
      total_expected_budget: total_b
    })
  }

  changeExpected(res) {
    var total_budget = res._data.current_expenses;
    var total_expected_budget = 0;
    if(res._data.expected_categories !== undefined) {

      var total_b = 0;
      console.log("dsdsd");
      Object.values(res._data.expected_categories).forEach((cat, index)=> {
        total_b = total_b + cat;
      })
    }
    this.setState({
      total_budget: total_b,
      total_expected_budget: total_b
    })
  }

  render() {
    const { width, height } = Dimensions.get('window');

    var categories = this.props.user_data === undefined ? [] : Object.keys(this.props.user_data.categories);
    var cat_values = this.props.user_data === undefined ? [] : Object.values(this.props.user_data.categories);
    const current_savings = this.props.user_data === undefined ? 0 : parseInt(this.props.user_data.user_salary, 10) - this.props.user_data.current_expenses;
 
    var maximum_num = Math.max(this.props.user_data.current_expenses, current_savings, this.props.user_data.last_month_expenses, this.props.user_data.last_month_savings);
    var current_graph = [this.props.user_data.current_expenses, current_savings];
    var last_graph = [this.props.user_data.last_month_expenses, this.props.user_data.last_month_savings];
    var colors=["#078D1D", "#e89110"];
    var current_x = ["Current Expenses", "Current Savings"];

    

    return (

        
      <View style={PhoneLoginStyles.phoneView}>
        
        <View style={{backgroundColor:'#078D1D', width:'100%', height:verticalScale(57), position:'absolute', top:0, zIndex:99, display:'flex', alignItems:'center', flexDirection:'row'}}>
          <MaterialIcon name="menu" size={25} color={"white"} style={{marginLeft:15}}
                        onPress={()=>{
                          this.props.navigation.toggleDrawer();
                        }}/>
          <Text style={{color:'white', fontSize:scale(18), paddingLeft:20, fontFamily:'Montserrat-Bold'}}>
            Dashboard
          </Text>
        </View>
        <ScrollView style={{height:'100%', width:'100%', backgroundColor:'#F6F6F6'}}>
          <View style={{backgroundColor:'#078D1D', width:'100%', height:verticalScale(0), marginTop:80}}>
          </View>
          <View>

            <EventCardOuter>
              <View style={{flexDirection:'row', justifyContent:'space-between', width:'100%'}}>
              <View style={{width:'55%'}}>
                <DashboardExpenseAnalysis analysis_heading={"CURRENT MONTH"}
                                          expenses={this.props.user_data.current_expenses}
                                          savings={current_savings}/>
                <View style={{marginTop:20}}></View>
                <DashboardExpenseAnalysis analysis_heading={"LAST MONTH"}
                                          expenses={this.props.user_data.last_month_expenses}
                                          savings={this.props.user_data.last_month_savings}/>
              </View>
              <View style={{ width:'35%', flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
              <Svg height="150" width="65">
                {current_graph.map((item, index)=>
                  <Rect x={15 * (index+1)} y={` ${80 - (item/maximum_num * 80)}%`} height={`${item/maximum_num * 80}%`} width={"10"} fill={colors[index]} rx={5} key={index}/>
                )}
                <TextSvg x="5" y="134" fontSize="11" width="100" fill="grey" fontFamily="NotoSans-Regular">Current</TextSvg>
                <TextSvg x="5" y="147" fontSize="11" width="100" fill="grey" fontFamily="NotoSans-Regular">Month</TextSvg>
                </Svg>
                <Svg height="150" width="80">
                {last_graph.map((item, index)=>
                  <Rect x={15 * (index+1)} y={` ${80 - (item/maximum_num * 80)}%`} height={`${item/maximum_num * 80}%`} width={"10"} fill={colors[index]} rx={5} index={index} key={index}/>
                )}
                <TextSvg x="8" y="134" fontSize="11" width="100" fill="grey" fontFamily="NotoSans-Regular">Last</TextSvg>
                <TextSvg x="8" y="147" fontSize="11" width="100" fill="grey" fontFamily="NotoSans-Regular">Month</TextSvg>
              </Svg>
            </View>
            
            </View>
            </EventCardOuter>

           {/* <EventCardOuter>
              <EventCardHeadingUpper navigation={this.props.navigation}/>
           </EventCardOuter> */}

            <View style={{flexDirection:'row', justifyContent:'space-evenly', marginHorizontal:15}}>
              <View style={{width:'55%'}}>
                <EventCardOuter>
                  <ExploreCard heading={this.state.config_data.heading_1}
                               heading_data={this.state.config_data.heading_1_data}
                               heading_icon={this.state.config_data.heading_1_icon}
                               heading_link={this.state.config_data.heading_1_link}
                               navigation={this.props.navigation}/>
                </EventCardOuter>
              </View>

              <View style={{width:'55%'}}>
                <EventCardOuter>
                  <ExploreCard heading={this.state.config_data.heading_2}
                               heading_data={this.state.config_data.heading_2_data}
                               heading_icon={this.state.config_data.heading_2_icon}
                               heading_link={this.state.config_data.heading_2_link}
                               navigation={this.props.navigation}/>
                </EventCardOuter>
              </View>
            </View>

            <RecentExpensesCardOuter>
              <View style={{marginTop:14, marginHorizontal:12}}>
              <View>
                <Text style={{fontFamily:'NotoSans-Bold', fontSize:verticalScale(14), marginVertical:-2, color:'grey'}}>RECENT EXPENSES</Text>
              </View>
              <Divider/>
              {this.props.recent_expenses.map((single_expense, index)=>(
                <View style={{ marginHorizontal:5}} key={index}>
                  <ExpenseCardUpdated single_expense={single_expense}/>
                </View>
              ))}
              <DividerBorderLess/>
              </View>
              <Ripple rippleOpacity={0.18} onPress={() => {
                              this.props.navigation.navigate("Expenses", {screen:"ExpenseList", params: {
                                screen: "This Month"
                              }});
                              console.log("huhu");
                          }}>
              <View style={{padding:14}}>
              <View>
                <View style={{flexDirection:'row', alignItems:'center', alignSelf:'center'}}>
                  <Text style={{fontFamily:'NotoSans-Regular', fontSize:moderateScale(15), color:'grey', marginRight:7}}>View More</Text>
                  <Icon name={"doubleright"} size={15} color={'grey'}/>
                </View>
              </View>
              </View>
              </Ripple>

            </RecentExpensesCardOuter>
            <EventCardOuter>
              <View>
                <Text style={{fontFamily:'NotoSans-Bold', fontSize:verticalScale(14), marginVertical:-2, color:'grey'}}>CATEGORIES</Text>
              </View>
              <Divider/>
              {categories.length === 0 ? 
                <View>
                  <Text style={{alignSelf:'center', marginTop:verticalScale(70), fontFamily:'Montserrat-Bold', fontSize:moderateScale(23), color:'lightgrey'}}>NO ADDED CATEGORIES</Text>
                </View> :
                <View style={{}}>
                  {this.props.user_data === undefined ? null :
                    categories.map((single_category, index)=>
                    <SingleCategory key={index}
                                    page_name={"Dashboard"}
                                    category_name={single_category} 
                                    category_value={cat_values[index]} 
                                    category_width={this.props.user_data.current_expenses === 0 ? 0 : cat_values[index]/this.state.total_budget * 100}
                                    expected_category_value={this.props.expected_category[index]}
                                    expected_category_width={this.state.total_expected_budget === 0 ? 0 : this.props.expected_category[index]/this.state.total_expected_budget * 100}/>
                    )
                  }
                </View>
              }
            </EventCardOuter> 
            
            <BannerAd
      unitId={adUnitId}
      size={BannerAdSize.ADAPTIVE_BANNER}
    />
          </View>
          </ScrollView>
      </View>
       
    );
  }
}

const WrappedComponent = connect(({signInReducer, userDashboardDataReducer, addExpenseReducer, appDataReducer}) => {
  return {
    userToken: signInReducer.userToken,
    user_data: userDashboardDataReducer.user_data,
    recent_expenses: addExpenseReducer.recent_expenses,
    expected_category: appDataReducer.expected_category
  };
}, (dispatch) => {
  return {
    userDashboardData:(user_data) => dispatch(userDashboardData(user_data)),
    recentExpensesList:(recent_expenses, page_name) => dispatch(recentExpensesList(recent_expenses, page_name)),
    getExpectedCategoryData:(user_data) => dispatch(getExpectedCategoryData(user_data))
}})(Dashboard);

export default WrappedComponent;

const PhoneLoginStyles = StyleSheet.create({
  phoneView:{
    backgroundColor: '#F6F6F6',
    flex:1,
    flexDirection:'column'
  },

})