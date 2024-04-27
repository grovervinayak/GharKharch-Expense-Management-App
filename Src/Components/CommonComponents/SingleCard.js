import React, { Component, useEffect } from 'react';
import {Text, View, StyleSheet, Button, Alert,TextInput, ScrollView, Image, TouchableOpacity, TouchableHighlight} from 'react-native';
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import AntIcon from "react-native-vector-icons/AntDesign";
import { scale, moderateScale, verticalScale} from '../Scaling';
import Icon from "react-native-vector-icons/MaterialIcons";
import IconMaterial from "react-native-vector-icons/MaterialCommunityIcons";
import {Divider} from "./OtherCommonComponents";
import Ripple from "react-native-material-ripple";

export function SingleCard(props){
  return(
      <View style={{width:scale(150), backgroundColor:'white', marginTop:verticalScale(-20), paddingTop:verticalScale(23), paddingBottom:verticalScale(16), alignItems:'center', borderRadius:10, elevation:24, border:0, }}>
        <View>
          <Text style={{fontFamily:'NotoSans-Regular', color:'grey',fontSize:scale(12), marginBottom:verticalScale(7)}}>{props.card_name}</Text>
        </View>
        <View>
          <Text style={{fontSize:scale(20), fontFamily:'NotoSans-Bold', color:'#63a335', marginBottom:verticalScale(7)}}>₹{props.card_value}</Text>
        </View>
      </View>
    )
}

export function SingleCardContainer(props){
  return(
    <View style={{flexDirection:'row', marginBottom:verticalScale(40), justifyContent:'space-around',paddingLeft:scale(8), paddingRight:8}}>
      {props.children}
    </View>
  )
}

export function SingleAboutCard(props){
  return(
          <View style={{marginHorizontal:15, marginTop:20}}>
            <View style={{marginHorizontal:10, alignItems:'center', backgroundColor:'white', borderWidth:1, borderColor:'#e1e4e86d', borderRadius:9}}>
              <View style={{paddingVertical:5}}>
                <Image source={{uri:`${props.single_feature.feature_image}`}}
                   style={{width: 150, height: 150}}>
                </Image>
              </View>
              <View style={{borderBottomWidth:1, borderTopWidth:1, borderColor:'#e1e4e86d', width:'100%', alignItems:'center'}}>
                <Text style={{fontFamily:'NotoSans-Bold', fontSize:scale(15), paddingVertical:5, color:'grey', textTransform:'uppercase'}}>
                  {props.single_feature.feature_title}
                </Text>
              </View>
              <View style={{padding:13}}>
                <Text style={{fontFamily:'NotoSans-Regular', color:'grey'}}>
                  {props.single_feature.feature_description}
                </Text>
              </View>
            </View>
          </View>
    )
}

export function EventCardOuter(props) {
  return(
          <View style={{backgroundColor:'white', elevation:1, borderRadius:8, paddingVertical:14, paddingHorizontal:12, marginBottom:15, marginHorizontal:15}}>
            {props.children}
          </View>
    )
}

export function WeeklyExpenseCardOuter(props) {
  return(
          <View style={{backgroundColor:'white', elevation:1, borderRadius:8, marginBottom:15, marginHorizontal:15}}>
            {props.children}
          </View>
    )
}

export function RecentExpensesCardOuter(props) {
  return(
          <View style={{backgroundColor:'white', elevation:1, borderRadius:8, marginBottom:15, marginHorizontal:15}}>
            {props.children}
          </View>
    )
}

export function EventCardHeadingUpper(props) {
  return (
              <TouchableOpacity style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}
                                onPress={()=>{
                                  props.navigation.navigate("EventsList");
                                }}>
                <View style={{width:'10%'}}>
                  <AntIcon name="calendar" color={'black'} size={moderateScale(25)}/>
                </View>
                <View style={{marginLeft:scale(7), width:'80%'}}>
                  <Text style={{fontFamily:'Montserrat-Bold', color:'black', fontSize:moderateScale(17), marginBottom:verticalScale(5)}}>Events</Text>
                  <Text style={{fontFamily:'Montserrat-Medium', color:'grey', fontSize:moderateScale(11), marginRight:scale(3)}}>Add events like Birthday Party, Marriage, etc. and manage them separately. Share with your friends easily.</Text>
                </View>
                <View style={{}}>
                  <AntIcon name="right" color={'black'} size={moderateScale(25)}/>
                </View>
              </TouchableOpacity>
  )
}

export function EventCardInnerUpper(props) {
  return (
            <View style={{borderBottomWidth:1, borderBottomColor:'#e1e4e84d'}}>
              <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                  <IconMaterial name={"lightbulb-outline"} size={18}/>
                  <Text style={{fontFamily:'NotoSans-Bold', fontSize:moderateScale(15), marginLeft:5}}>{props.event_item.event_name}</Text>
                </View>
                
                <Text style={{fontFamily:'NotoSans-Bold', fontSize:moderateScale(15), color:'#078D1D'}}>₹ {props.event_item.event_price}</Text>
              </View>
              <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:6, marginBottom:8}}>
                <Text style={{color:'grey', fontFamily:'NotoSans-Regular', fontSize:moderateScale(12)}}>Start Date: {props.event_item.start_print_date}</Text>
                <Text style={{color:'grey', fontFamily:'NotoSans-Regular', fontSize:moderateScale(12)}}>End Date: {props.event_item.end_print_date}</Text>
              </View>
            </View>
    )
}

export function EventCardInnerLower(props) {
  return (
            <View style={{marginTop:8, flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
              <View style={{flexDirection:'row', alignItems:'center'}}>
                <Icon name={"fiber-manual-record"} size={15} color={props.event_item.event_color}/>
                <Text style={{marginLeft:3, fontFamily:'NotoSans-Regular', color:'grey'}}>{props.event_item.event_status}</Text>
              </View>
              <TouchableOpacity style={{borderWidth:1, borderColor: '#e38c0d', borderRadius:5, paddingHorizontal:16, paddingVertical:6}}
                                onPress={()=>{
                                  props.getEventData(props.event_item);
                                  props.navigation.navigate('EventDetails', {
                                    event_item: props.event_item
                                  });
                                }}>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                  <Text style={{color:'#e38c0d', fontFamily:'NotoSans-Regular'}}>Details</Text>
                  <Icon name={"keyboard-arrow-right"} size={19} color={"#e38c0d"} style={{marginRight:-7}}/>
                </View>
              </TouchableOpacity>
            </View>
    )
}

export function ContactCard(props) {
  return (
          <View style={{paddingVertical:8, borderBottomWidth:1, borderColor:'#E0E0E0', marginHorizontal:15}}>
            <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
              <View style={{flexDirection:'row', alignItems:'center'}}>
                <MaterialIcon name={"account-circle"} size={45} color={"lightgrey"}/>
                <View style={{marginLeft:5}}>
                  <Text style={{fontFamily:'NotoSans-Bold', fontSize:moderateScale(14)}}>{props.single_contact.user_name}</Text>
                  <Text style={{fontFamily:'NotoSans-Regular', color:'grey', marginTop:5}}>{props.single_contact.phone_number}</Text>
                </View>
              </View>
              <View>
              {props.single_contact.add_status === false ? 
                  <TouchableOpacity style={{borderWidth:1, borderColor: '#e38c0d', borderRadius:5, paddingHorizontal:16, paddingVertical:6}}
                                    onPress={()=>{
                                      props.checkUserInCollection(props.single_contact);
                                    }}>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                      <Text style={{color:'#e38c0d', fontFamily:'NotoSans-Regular'}}>Share</Text>
                    </View>
                  </TouchableOpacity> :

                  <View style={{borderWidth:1, borderColor: '#078D1D', borderRadius:5, paddingHorizontal:16, paddingVertical:6}}
                                    >
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                      <Text style={{color:'#078D1D', fontFamily:'NotoSans-Regular'}}>Added</Text>
                    </View>
                  </View>
              }
              </View>
            </View>
          </View>
  );
}

export function FriendNames(props) {
  return (
                <View style={{marginBottom:14, paddingBottom:5, borderColor:'#E0E0E0'}}>
                  <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                    <Text style={{fontFamily:'Montserrat-Medium', color:'grey'}}>{props.single_user.user_name} {props.single_user.user_designation === "" ? null : `(${props.single_user.user_designation})`}</Text>
                    <Text style={{fontFamily:'NotoSans-Bold', marginBottom:-15, marginTop:0, color:'#63a335', fontSize:scale(13)}}>₹ {props.single_user.user_expense}</Text>
                  </View>
                  <View style={{height:8, backgroundColor:'#e8e8e8', marginTop:3, borderRadius:10}}>
                    <View style={{backgroundColor:'#f49913', height:8, width:`${props.friend_width}%`, borderTopLeftRadius:10, borderBottomLeftRadius:10}}>
                    </View>
                  </View>
                </View>
  )
}

export function DashboardExpenseAnalysis(props) {
  return (
              <View>
                <View style={{marginBottom:-7}}>
                  <Text style={{fontFamily:'NotoSans-Bold', color:'grey', fontSize:moderateScale(12)}}>{props.analysis_heading}</Text>
                </View>
                <Divider/>
                <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:-7}}>
                  <View>
                    <Text style={{fontFamily:'NotoSans-Regular', color:'grey', fontSize:moderateScale(12)}}>Spent</Text>
                    <Text style={{fontFamily:'NotoSans-Bold', fontSize:moderateScale(22), color:'#078D1D', marginTop:moderateScale(-6)}}>₹{props.expenses}</Text>
                  </View>
                  <View>
                    <Text style={{fontFamily:'NotoSans-Regular', color:'grey', fontSize:moderateScale(12)}}>Remaining</Text>
                    <Text style={{fontFamily:'NotoSans-Bold', fontSize:moderateScale(15), color:"#e89110"}}>₹{props.savings}</Text>
                  </View>
                </View>
              </View>
  )
}

export function ExploreCard(props) {
  return(
                <View>
                  <View style={{flexDirection:'row', alignItems:'center'}}>
                    <MaterialIcon name={props.heading_icon} color={'grey'} size={moderateScale(21)}/>
                    <Text style={{fontFamily:'NotoSans-Bold', fontSize:verticalScale(14), marginVertical:-2, color:'grey', marginLeft:5}}>{props.heading}</Text>
                  </View>
                  <Divider/>
                  <Text style={{fontFamily:'NotoSans-Regular'}}>{props.heading_data}</Text>   
                  <Ripple rippleOpacity={0.18} style={{alignSelf:'flex-end', borderWidth:1, borderColor:'#078D1D', paddingHorizontal:16, paddingVertical:6, marginTop:10}}
                                    onPress={()=>{
                                      props.navigation.navigate(props.heading_link);
                                    }}>
                    <Text style={{fontFamily:'NotoSans-Regular', color:'#078D1D'}}>Explore</Text>
                  </Ripple>
                </View>
  )
}
