import React, { Component, useEffect } from 'react';
import {Text, View, StyleSheet, Button, Alert,TextInput, ScrollView, Image, TouchableOpacity, TouchableHighlight} from 'react-native';
import Icon from "react-native-vector-icons/AntDesign";
import { scale, moderateScale, verticalScale} from '../Scaling';
import Ripple from "react-native-material-ripple";

/* This function is for card of single expense in Weekly Expenses Page. This contain small line which shows weekly expense details */
export function SingleExpenseCard(props){
	return(
			<Ripple style={{ width:'100%',flexDirection:'row',justifyContent:'space-between', alignItems:'center', paddingVertical:14, paddingHorizontal:12}}
              onPress={()=>{
                var week_expense_date = props.single_week.week_expense_date.toDate();
                props.getStartEndDate(week_expense_date);
                props.navigation.navigate("ExpenseWeekList", {
                  document_key:props.single_week.key,
                  week_card_detail:props.single_week
                })
              }}>
              <View style={{flexDirection:'row'}}>
              <View style={{borderRightWidth:1, height:verticalScale(43),borderColor:'lightgray', alignItems:'center', flexDirection:'row'}}>
                <Text style={{color:'#078D1D', fontFamily:'NotoSans-Bold', fontSize:moderateScale(16), paddingLeft:scale(4), paddingRight:scale(10)}}>{props.single_week.week_expense_month}</Text>
              </View>
              <View style={{flexDirection:'row', paddingLeft:scale(10), alignItems:'center'}}>
                <Icon name="calendar" color={'grey'} size={moderateScale(22)}/>
                <Text style={{marginLeft:scale(6), fontSize:moderateScale(14.3), fontFamily:'NotoSans-Regular', color:'grey'}}>{props.single_week.week_name}</Text>
              </View>
              </View>
              <View style={{flexDirection:'row', alignItems:'center', paddingRight:moderateScale(5)}}
              					rippleOpacity={0.18}
              					>
                <Text style={{fontSize:moderateScale(18), paddingRight:scale(7), fontFamily:'NotoSans-Bold', color:'#63a335'}}>₹{props.single_week.week_total_expense}</Text>
                <Icon name="right" color={'#63a335'} size={20}/>
              </View>
            </Ripple>
    )
}

export function SingleDayExpenseOuter(props){
	return(
		<View style={{ marginBottom:10}}>
              <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                <Text style={{fontSize:moderateScale(12), fontFamily:'NotoSans-Regular', marginTop:0, marginBottom:0, color:'grey'}}>{props.week_day}</Text>
                <Text style={{color:'#63a335', fontFamily:'NotoSans-Regular', fontSize:moderateScale(14)}}>₹{props.week_day_price}</Text>
              </View>
              {props.children}
        </View>
		)
}

export function SingleExpenseDetail(props){
	return(
		<View style={{backgroundColor:'white', flexDirection:'row', justifyContent:'space-between', borderBottomWidth:1, borderBottomColor:'#e1e4e84d' ,paddingTop:7, paddingBottom:8, overflow:'hidden', paddingHorizontal:10}}>
            <View>
            	<Text style={{color:'grey', fontFamily:'NotoSans-Regular',marginTop:0, marginBottom:1, fontSize:moderateScale(15)}}>{props.expense_detail.expense_name}</Text>
            	<Text style={{color:'#e88533', fontFamily:'NotoSans-Regular',marginTop:5, marginBottom:0, fontSize:moderateScale(10)}}>{props.expense_detail.expense_category}</Text>
            </View>
            <Text style={{color:'grey', fontFamily:'NotoSans-Bold',marginTop:10, marginBottom:0, fontSize:moderateScale(15)}}>₹{props.expense_detail.expense_price}</Text>
        </View>
		)
}

export function SingleWeekExpenseHeading(props){
	return(
		<View style={{backgroundColor:'white', marginTop:15}}>
            <View style={{flexDirection:'row', paddingLeft:20, paddingTop:5, paddingBottom:5, paddingRight:20, justifyContent:'space-between'}}>
                <Text style={{fontSize:moderateScale(16), color:'#078D1D', fontFamily:'NotoSans-Bold'}}>{props.week_card_detail.week_expense_month}</Text>
                <Text style={{fontSize:moderateScale(14), fontFamily:'NotoSans-Regular', color:'grey', width:'60%'}}>{props.week_card_detail.week_name}</Text>
                <Text style={{fontSize:moderateScale(16),color:'#03B721', fontFamily:'NotoSans-Bold'}}>₹{props.week_card_detail.week_total_expense}</Text>
            </View>
        </View>
		)
}

export function SingleEventExpense(props) {
  return(
            <View style={{borderBottomWidth:1, paddingBottom:7, borderColor:'#E0E0E0', marginBottom:7}}>
              <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:5}}>
                <Text style={{fontFamily:'NotoSans-Regular', fontSize:moderateScale(14), color:'black'}}>Birthday Cake</Text>
                <Text style={{fontFamily:'NotoSans-Bold', color:'#63a335', fontSize:moderateScale(17)}}>₹789</Text>
              </View>
              <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                <Text style={{color:'#f49913', fontFamily:'NotoSans-Regular'}}>
                  <Text style={{color:'#acacac'}}>
                    Paid By:
                  </Text> 
                   Vinayak Grover
                </Text>
                <Text style={{fontFamily:'NotoSans-Regular', color:'grey'}}>09/09/2020</Text>
              </View>
            </View>
  )
}

export function ExpenseCardUpdated(props) {
  return (
                <View style={{paddingVertical:10}}>
                  <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                      <Icon name={"creditcard"} size={17}/>
                      <Text style={{fontFamily:'NotoSans-Bold', fontSize:moderateScale(15), marginLeft:5}}>{props.single_expense.expense_name}</Text>
                    </View>
                    <View>
                      <Text style={{fontFamily:'NotoSans-Bold', fontSize:moderateScale(16), color:'#078D1D'}}>₹{props.single_expense.expense_price}</Text>
                    </View>
                  </View>
                  <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                    <View>
                      <Text style={{fontFamily:'NotoSans-Regular', color:'#e88533', fontSize:moderateScale(12)}}>{props.single_expense.expense_category}</Text>
                    </View>
                    <View>
                      <Text style={{fontFamily:'NotoSans-Regular', color:'grey'}}>{props.single_expense.expense_print_date}</Text>
                    </View>
                  </View>

                </View>
  )
}

