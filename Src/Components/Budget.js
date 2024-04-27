import React, { Component, useEffect } from 'react';
import {Text, View, StyleSheet, Button, Alert,TextInput, ScrollView, Image, TouchableOpacity, TouchableHighlight, Modal, ActivityIndicator} from 'react-native';
import {connect} from "react-redux";
import firestore from '@react-native-firebase/firestore';
import { scale, moderateScale, verticalScale, round} from './Scaling';

import {ActivityMessage, ActivityLoader, ActivityError} from "./CommonComponents/ActivityCards";

import {checkActivityMessage, checkActivityLoader, checkActivityError} from "../Actions/activityActions";
import {getExpectedCategoryData} from "../Actions/appDataActions";
import { EventCardOuter } from './CommonComponents/SingleCard';
import {Divider} from "./CommonComponents/OtherCommonComponents";
import Icon from "react-native-vector-icons/AntDesign";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import {SingleCategory} from "./CommonComponents/SingleCategory";
import {Picker} from '@react-native-community/picker';
import Ripple from "react-native-material-ripple";
import { BannerAd, BannerAdSize, TestIds } from '@react-native-firebase/admob';

const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-9891251702854942/7694570617';

class Budget extends Component {
  constructor(props) {
    super(props);
    this.state = {
    	add_budget:false,
      name_style:{
        marginTop:3,
        marginBottom:-7,
        paddingLeft:3,
        color:'#9E9E9E',
        fontSize:scale(13),
        "fontFamily":'Montserrat-Regular'
      },
      user_salary:"",
      error_message:"",
      add_category: false,
      add_expected_category: false,
      category_name: "",
      sucess_message:""
     };
     this.props.getExpectedCategoryData(this.props.user_data);
  }

  updateSalary(){
    this.props.checkActivityLoader(true);
    firestore().collection('Users').doc(this.props.userToken).update({
      user_salary: this.state.user_salary
    }).then(res=>{
      this.props.checkActivityMessage(true, "Budget");
      this.setState({
        sucess_message:"Salary Updated Successfully"
      })
      this.props.checkActivityLoader(false);
      setTimeout(()=>{
        this.props.checkActivityMessage(false, "Budget");
      }, 3000);
    })
  }

  updateCategory() {
    this.props.checkActivityLoader(true);
    firestore().collection("Users").doc(this.props.userToken).update({
      [`expected_categories.${this.state.category_name}`]:round(parseFloat(this.state.category_value))
    }).then(res=>{
      this.props.checkActivityMessage(true, "Budget");
      this.props.getExpectedCategoryData(this.props.user_data);
      this.setState({
        sucess_message:"Expected Category is Updated Successfully"
      })
      this.props.checkActivityLoader(false);
      setTimeout(()=>{
        this.props.checkActivityMessage(false, "Budget");
      }, 3000);
    })
  }

  showErrorMessage(){
    this.props.checkActivityError(true, "Budget");
      setTimeout(()=>{
        this.props.checkActivityError(false, "Budget");
      }, 3000);
  }

  render() {
    const message="Salary Added Successfully";
    var categories = this.props.user_data === undefined ? [] : Object.keys(this.props.user_data.categories);
    var total_expected_budget = 0;
    if(this.props.user_data.expected_categories !== undefined) {
      var total_b = 0;
      console.log("dsdsd");
      Object.values(this.props.user_data.expected_categories).forEach((cat, index)=> {
        total_b = total_b + cat;
      })
      total_expected_budget = total_b;
    }
    return (

      <View style={PhoneLoginStyles.phoneView}>
        <View style={{backgroundColor:'#078D1D', width:'100%', height:verticalScale(56), elevation:3, display:'flex', flexDirection:'row', alignItems:'center'}}>
        <MaterialIcon name="menu" size={25} color={"white"} style={{marginLeft:15}}
                        onPress={()=>{
                          this.props.navigation.toggleDrawer();
                        }}/>
          <Text style={{color:'white', fontSize:scale(18), paddingLeft:20, fontFamily:'Montserrat-Bold'}}>
            Budget
          </Text>
        </View>

        <ScrollView style={{height:'100%', width:'100%'}} keyboardShouldPersistTaps={'handled'}>
        <View style={{marginTop:15}}>
        <EventCardOuter>
          <View>
              <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                <Text style={{fontFamily:'NotoSans-Bold', fontSize:verticalScale(14), marginVertical:-2, color:'grey'}}>CURRENT SALARY</Text>
                <TouchableOpacity onPress={()=>{
                  this.setState({
                    add_budget: true
                  })
                }}
                style={{marginRight:10}}>
                  <Icon name="edit" size={20} color={"grey"}/>
                </TouchableOpacity>
              </View>
              <Divider/>
            <Text style={{color:'#03B721', fontFamily:'NotoSans-Bold', marginTop:7, fontSize:moderateScale(42), marginTop:-3}}>
              {this.props.user_data.user_salary === 0 || this.props.user_data.user_salary === null ? "N/A" : `₹${this.props.user_data.user_salary}`}</Text>
          </View>
        </EventCardOuter>
        </View>
        <EventCardOuter>
        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                <Text style={{fontFamily:'NotoSans-Bold', fontSize:verticalScale(14), marginVertical:-2, color:'grey'}}>CATEGORY BUDGET</Text>
                <TouchableOpacity onPress={()=>{
                  this.setState({
                    add_expected_category: true
                  })
                }}
                style={{marginRight:10}}>
                  <Icon name="edit" size={20} color={"grey"}/>
                </TouchableOpacity>
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
                                    page_name={"Budget"}
                                    category_name={single_category} 
                                    expected_category_value={this.props.expected_category[index]} 
                                    expected_category_width={total_expected_budget === 0 ? 0 : this.props.expected_category[index]/total_expected_budget * 100}/>
                    )
                  }
                </View>
              }
        </EventCardOuter>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.add_budget}
          onRequestClose={() => {
            this.setState({
              add_budget:false
            })
          }}
        >
          <TouchableOpacity style={{position:'absolute', width:'100%', height:'100%', backgroundColor:'#4141418f'}}
                            onPress={()=>{
                              this.setState({
                                add_budget:false
                              })
                            }}></TouchableOpacity>
          <View style={{backgroundColor:'white', position:'absolute', bottom:80, width:'100%', alignItems:'center', alignSelf:'center', elevation:10, padding:20}}>
            <View style={{width:'100%'}}>
              <Text style={this.state.name_style}>Change Salary</Text>
            <TextInput style={{borderBottomWidth:1, marginTop:0, borderColor:'#9E9E9E'}}
                       keyboardType={"numeric"}
                       onChangeText={(salary)=>{
                        this.setState({
                          user_salary:salary
                        })
                       }}/>
            </View>
            <Ripple 
            activeOpacity={0.8}
            style={{width:moderateScale(225), backgroundColor:'#63A335', height:verticalScale(45), alignSelf:'center', marginTop:verticalScale(33), flexDirection:'row', justifyContent:'center', borderRadius:100, elevation: 3, marginBottom:10}}
            onPressIn={()=>{
              console.log(isNaN(this.state.user_salary));
              if(this.state.user_salary === "" || this.state.user_salary === "0" || isNaN(this.state.user_salary)){
                console.log(this.state.user_salary);
                this.setState({
                  error_message:"Please Enter a Valid Salary"
                })
                this.showErrorMessage();
              }
              else {
                this.updateSalary();
                this.setState({
                  add_budget:false
                })
              }
            }}>
              <Text style={{color:'white', alignSelf:'center', fontFamily:'Montserrat-SemiBold', fontSize:scale(14)}}>
                Change Salary
              </Text>
          </Ripple>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.add_expected_category}
          onRequestClose={() => {
            this.setState({
              add_expected_category:false
            })
          }}
        >
          <TouchableOpacity style={{position:'absolute', width:'100%', height:'100%', backgroundColor:'#4141418f'}}
                            onPress={()=>{
                              this.setState({
                                add_expected_category:false
                              })
                            }}></TouchableOpacity>
          <View style={{backgroundColor:'white', position:'absolute', bottom:80, width:'100%', alignItems:'center', alignSelf:'center', elevation:10, padding:20}}>
            <View style={{width:'100%'}}>
            <View>
        		<Picker
        			style={{ height: 50, width: scale(330), marginTop:20, fontFamily:'Montserrat-Regular' }}
        			mode={'dropdown'}
        			selectedValue={this.state.category_name}
        			onValueChange={(itemValue, itemIndex) => {
        				if(itemValue === null){
        					this.setState({
        						add_category:true
        					})
        				}
        				else if(itemValue !== "Select Category"){
        					this.setState({
        						category_name: itemValue
        					})
        				}
        			}}

      			>
      					<Picker.Item label="Select Category" value={"Select Category"}/>
      					{categories.map((single_category)=>
      						<Picker.Item label={single_category} value={single_category} key={single_category}/>)}
        				<Picker.Item label="Add New Category" value={null}/>
      			</Picker>
      		</View>
            <TextInput style={{borderBottomWidth:1, marginTop:0, borderColor:'#9E9E9E'}}
                       keyboardType={"numeric"}
                       onChangeText={(cat_value)=>{
                        this.setState({
                          category_value:cat_value
                        })
                       }}/>
            </View>
            <Ripple
            activeOpacity={0.8}
            style={{width:moderateScale(225), backgroundColor:'#63A335', height:verticalScale(45), alignSelf:'center', marginTop:verticalScale(33), flexDirection:'row', justifyContent:'center', borderRadius:100, elevation: 3, marginBottom:10}}
            onPressIn={()=>{
              console.log(isNaN(this.state.user_salary));
              if(this.state.category_name === "") {
                this.setState({
                  error_message:"Please Enter a Valid Category"
                })
                this.showErrorMessage();
              }
              if(this.state.category_value === "" || this.state.category_value === "0" || isNaN(this.state.category_value)){
                this.setState({
                  error_message:"Please Enter a Valid Expected Category Price"
                })
                this.showErrorMessage();
              }
              else {
                this.updateCategory();
                this.setState({
                  add_expected_category:false
                })
              }
            }}>
              <Text style={{color:'white', alignSelf:'center', fontFamily:'Montserrat-SemiBold', fontSize:scale(14)}}>
                Change Category
              </Text>
          </Ripple>
          </View>
        </Modal>
        <BannerAd
      unitId={adUnitId}
      size={BannerAdSize.ADAPTIVE_BANNER}
    />
        </ScrollView>
        {this.props.activity_message && this.props.message_page_name === "Budget" ? <ActivityMessage message={this.state.sucess_message}/> : null}
        {this.props.activity_error && this.props.message_page_name === "Budget" ? <ActivityError error={this.state.error_message}/> : null}
        {this.props.activity_loader ? <ActivityLoader/> : null}
      </View>
    );
  }
}

const WrappedComponent = connect(({signInReducer, userDashboardDataReducer, activityReducer, appDataReducer}) => {
  return {
    userToken: signInReducer.userToken,
    user_data: userDashboardDataReducer.user_data,
    activity_message: activityReducer.activity_message,
    activity_error: activityReducer.activity_error,
    activity_loader: activityReducer.activity_loader,
    message_page_name: activityReducer.message_page_name,
    error_page_name: activityReducer.error_page_name,
    expected_category: appDataReducer.expected_category
  };
}, (dispatch) => {
  return {
    checkActivityMessage:(message_state, page_name) => dispatch(checkActivityMessage(message_state, page_name)),
    checkActivityError:(error_state, page_name) => dispatch(checkActivityError(error_state, page_name)),
    checkActivityLoader:(loader_state) => dispatch(checkActivityLoader(loader_state)),
    getExpectedCategoryData:(user_data) => dispatch(getExpectedCategoryData(user_data))
}})(Budget);

export default WrappedComponent;

const PhoneLoginStyles = StyleSheet.create({
  phoneView:{
    backgroundColor: '#F6F6F6',
    alignItems: 'center',
    flex:1,
    flexDirection:'column'
  },

})