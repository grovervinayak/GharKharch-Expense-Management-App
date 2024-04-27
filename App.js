/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React,{ Component, useEffect } from 'react';
import {connect} from "react-redux";
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import OneSignal from 'react-native-onesignal';
import { createStackNavigator, CardStyleInterpolators, TransitionPresets } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';

import Icon from "react-native-vector-icons/AntDesign";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {
  checkRestoreToken
} from "./Src/Actions/checkSigninStatus";

import PhoneLogin from "./Src/Components/PhoneLogin";
import VerifyOTP from "./Src/Components/VerifyOTP";
import Dashboard from "./Src/Components/Dashboard";
import ExpenseList from "./Src/Components/ExpenseList";
import ExpenseWeekList from "./Src/Components/ExpenseWeekList";
import RecentExpenses from "./Src/Components/RecentExpenses";
import AddNewExpense from "./Src/Components/AddNewExpense";
import Budget from "./Src/Components/Budget";
import Profile from "./Src/Components/Profile";
import SplashScreen from "./Src/Components/SplashScreen";
import {DrawerCustomPage} from "./Src/Components/DrawerCustomPage";
import { scale, moderateScale, verticalScale} from './Src/Components/Scaling';
import Feedback from "./Src/Components/Feedback";
import AskAQuestion from "./Src/Components/AskAQuestion";
import FAQs from "./Src/Components/FAQs";
import AboutUs from "./Src/Components/AboutUs";
import EventsList from "./Src/Components/EventsList";
import CreateEvent from "./Src/Components/CreateEvent";
import FriendsList from "./Src/Components/FriendsList";
import EventDetails from "./Src/Components/EventDetails";
import ExpenseDetails from './Src/Components/ExpenseDetails';

const LoginStack = createStackNavigator();
function Login()
{
  return(
      <LoginStack.Navigator initialRouteName="PhoneLogin"
                            headerMode="screen" screenOptions={{headerShown:false}}>
        <LoginStack.Screen name="PhoneLogin" component={PhoneLogin} />
        <LoginStack.Screen name="VerifyOTP" component={VerifyOTP} />
      </LoginStack.Navigator>
    );
}

const ExpenseStack = createStackNavigator();
function ExpensePage()
{
  return(
    <ExpenseStack.Navigator headerMode="screen" screenOptions={{
                                                  headerShown:false,
                                                  gestureEnabled:true,
                                                  gestureDirection:'horizontal',
                                                  cardStyleInterpolator:
                                                  CardStyleInterpolators.forHorizontalIOS
                                                }}>
      <ExpenseStack.Screen name="ExpenseList" component={ExpenseList}/>
      <ExpenseStack.Screen name="ExpenseWeekList" component={ExpenseWeekList}/>
      <ExpenseStack.Screen name="AddNewExpense" component={AddNewExpense}/>
      <ExpenseStack.Screen name="ExpenseDetails" component={ExpenseDetails}/>
    </ExpenseStack.Navigator>)
}

const DashboardStack = createStackNavigator();
function DashboardPage() {
  return (
    <DashboardStack.Navigator headerMode="screen" screenOptions={{
                                                  headerShown:false,
                                                  gestureEnabled:true,
                                                  gestureDirection:'horizontal',
                                                  cardStyleInterpolator:
                                                  CardStyleInterpolators.forHorizontalIOS
                                                }}>
      <DashboardStack.Screen name="DashboardInner" component={Dashboard}/>
      <DashboardStack.Screen name="EventsList" component={EventsList}/>
      <DashboardStack.Screen name="CreateEvent" component={CreateEvent}/>
      <DashboardStack.Screen name="FriendsList" component={FriendsList}/>
      <DashboardStack.Screen name="EventDetails" component={EventDetails}/>
      <DashboardStack.Screen name="AddNewExpense" component={AddNewExpense}/>
    </DashboardStack.Navigator>
    )
}

const Tab = createBottomTabNavigator();

function AppHomePage() {
  return(
    <Tab.Navigator tabBarOptions={{
                          activeTintColor: '#63a335',
                          activeBackgroundColor:'#FAFAFA',
                          tabStyle:{
                          },
                          style:{
                            height:57
                          },
                          labelStyle:{
                            paddingBottom:5,
                            paddingTop:5,
                            fontFamily:'NotoSans-Regular'
                          },

                         }}>
            <Tab.Screen name="Dashboard" component={DashboardPage}
                        options={{
                          tabBarLabel: 'Dashboard',
                          tabBarIcon: ({color, size}) => (
                            <Icon name="dashboard" color={color} size={18} style={{marginBottom:-9}}/>
                          ),
                        }}
                        tabBarOptions={{labelStyle:{paddingBottom:20}}}/>
            <Tab.Screen name="Expenses" component={ExpensePage}
                        options={{
                          tabBarLabel: 'Expenses',
                          tabBarIcon: ({color, size}) => (
                            <Icon name="creditcard" color={color} size={18} style={{marginBottom:-9}}/>
                          ),
                        }}
                        tabBarOptions={{labelStyle:{paddingBottom:20}}}/>
            <Tab.Screen name="Budget" component={Budget}
                        options={{
                          tabBarLabel: 'Budget',
                          tabBarIcon: ({color, size}) => (
                            <Icon name="profile" color={color} size={18} style={{marginBottom:-9}}/>
                          ),
                        }}
                        tabBarOptions={{labelStyle:{paddingBottom:20}}}/>
            <Tab.Screen name="Profile" component={Profile}
                        options={{
                          tabBarLabel: 'Profile',
                          tabBarIcon: ({color, size}) => (
                            <Icon name="user" color={color} size={18} style={{marginBottom:-9}}/>
                          ),
                        }}
                        tabBarOptions={{labelStyle:{paddingBottom:20}}}/>
          </Tab.Navigator>
    )
}
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
class App extends Component{
  constructor(props){
    super(props);
    console.log("Inside App");
    AsyncStorage.getItem('user').then(res=>{
      console.log("Get Item", res);
      this.props.checkRestoreToken(res);
    })
  }

  render(){
    if(this.props.isLoading === true){
    return(
      <SplashScreen/>)
  }
  else{
  if(this.props.userToken !== null){
    return (
      <View style={{ width:'100%', height:'100%'}}>
        <NavigationContainer style={{height:90}}>
          <StatusBar backgroundColor="#03B721" barStyle="light-content"/>
          <Drawer.Navigator drawerContent={(props) => <DrawerCustomPage {...props} />}
                            drawerContentOptions={{
                              activeBackgroundColor:'#03B721',
                              activeTintColor:'white',
                              itemStyle:{
                                marginLeft:0,
                                borderRadius:0,
                                marginRight:0,
                                paddingTop:3,
                                paddingBottom:3
                              }
                            }}
                            drawerStyle={{
                              width:scale(260)
                            }}>
      <Drawer.Screen name="Home" component={AppHomePage} 
                     options={{
                      drawerIcon:({color, size})=> (
                        <Icon name="home" color={color} size={20} style={{marginBottom:0, marginLeft:20, marginRight:0, paddingRight:0}}/>
                      ),
                      drawerLabel:({color, size}) => (
                        <Text style={{fontFamily:'NotoSans-Regular', color:`${color}`, fontSize:16, marginLeft:-20}}>Home</Text>
                      )
                     }}/>
      <Drawer.Screen name="Feedback" component={Feedback} 
                     options={{
                      drawerIcon:({color, size})=> (
                        <Icon name="solution1" color={color} size={20} style={{marginBottom:0, marginLeft:20, marginRight:0, paddingRight:0}}/>
                      ),
                      drawerLabel:({color, size}) => (
                        <Text style={{fontFamily:'NotoSans-Regular', color:`${color}`, fontSize:16, marginLeft:-20}}>Feedback</Text>)
                     }}/>
      <Drawer.Screen name="Ask A Question" component={AskAQuestion} 
                     options={{
                      drawerIcon:({color, size})=> (
                        <Icon name="form" color={color} size={20} style={{marginBottom:0, marginLeft:20, marginRight:0, paddingRight:0}}/>
                      ),
                      drawerLabel:({color, size}) => (
                        <Text style={{fontFamily:'NotoSans-Regular', color:`${color}`, fontSize:16, marginLeft:-20}}>Ask A Question</Text>)
                     }}/>
      <Drawer.Screen name="About Us" component={AboutUs} 
                     options={{
                      drawerIcon:({color, size})=> (
                        <Icon name="user" color={color} size={20} style={{marginBottom:0, marginLeft:20, marginRight:0, paddingRight:0}}/>
                      ),
                      drawerLabel:({color, size}) => (
                        <Text style={{fontFamily:'NotoSans-Regular', color:`${color}`, fontSize:16, marginLeft:-20}}>About Us</Text>)
                     }}/>              
    </Drawer.Navigator>
        </NavigationContainer>
      </View>);
  }
  else{
  return (
    <View style={{ width:'100%', height:'100%'}}>

    <NavigationContainer>
    <StatusBar backgroundColor="#03B721" barStyle="light-content"/>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} options={{headerShown:false}}/>
      </Stack.Navigator>
    </NavigationContainer>
    </View>
  );
  }}
  {/*return (
    <View style={{ width:'100%', height:'100%'}}>

    <NavigationContainer>
    <StatusBar backgroundColor="#03B721" barStyle="light-content"/>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} options={{headerShown:false}}/>
      </Stack.Navigator>
    </NavigationContainer>
    </View>
  );*/}
  }
}



const WrappedComponent = connect(({signInReducer}) => {
  return {
    userToken: signInReducer.userToken,
    isLoading: signInReducer.isLoading
  };
}, (dispatch) => {
  return {
    checkRestoreToken:(user) => dispatch(checkRestoreToken(user))
}})(App);

export default WrappedComponent;
