import React, { Component, useEffect } from 'react';
import {connect} from "react-redux";
import {Text, View, StyleSheet, Button, Alert,TextInput, ScrollView, Image, TouchableOpacity, TouchableHighlight, Modal} from 'react-native';
import Icon from "react-native-vector-icons/AntDesign";
import CheckBox from '@react-native-community/checkbox';
import { scale, moderateScale, verticalScale, round, printDate, week_first_day, week_last_day, 
         week_document_name, week_first_date, week_last_date} from './Scaling';
import {Picker} from '@react-native-community/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import firestore from '@react-native-firebase/firestore';

import {ActivityMessage, ActivityLoader, ActivityError} from "./CommonComponents/ActivityCards";

import {checkActivityMessage, checkActivityLoader, checkActivityError, enteredActivityMessage} from "../Actions/activityActions";
import {getEventData} from "../Actions/appDataActions";
import {
  listWeekExpenses, getStartEndDate, thisMonthExpensesList, lastMonthExpensesList, emptyThisMonthExpenses
} from "../Actions/listWeekExpenses";

import { InterstitialAd, TestIds, AdEventType } from '@react-native-firebase/admob';

const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';

const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
  keywords: ['fashion', 'clothing'],
});

class AddNewExpense extends Component{
	constructor(props){
		super(props);
    const page_name = this.props.route.params.page_name;
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
		this.state={
			new_expense:{
				"expense_name":page_name === "Add" || page_name === "EventPage" ? "" : this.props.route.params.single_detail.expense_name,
				"expense_date":page_name === "Add" || page_name === "EventPage" ? new Date() : this.props.route.params.single_detail.expense_date.toDate() ,
				"expense_category":page_name === "Add" || page_name === "EventPage" ? "" : this.props.route.params.single_detail.expense_category,
        "expense_price":page_name === "Add" || page_name === "EventPage" ? "" : this.props.route.params.single_detail.expense_price,
        "added_in_event": false,
        "expense_print_date": printDate(new Date())
			},
			name_style:{
				marginTop:3,
				marginBottom:-7,
				paddingLeft:3,
				color:'#9E9E9E',
				"fontFamily":'Montserrat-Regular'
			},
			show_calendar:false,
			day_button:page_name === "Add" || page_name === "EventPage" ? "Today" : this.props.route.params.single_detail.expense_date.toDate().getDate()+"-"+
                 months[this.props.route.params.single_detail.expense_date.toDate().getMonth()],
			today_date:new Date(),
			add_category:false,
      error_message:""
		}
	}

	updateCategory(){
    this.props.checkActivityLoader(true);
		firestore().collection('Users').doc(this.props.userToken).update({
			[`categories.${this.state.new_expense.expense_category}`]:0
		}).then(res=>{
			console.log("Done");
      this.props.checkActivityMessage(true, "AddNewExpense");
      this.props.checkActivityLoader(false);
      setTimeout(()=>{
        this.props.checkActivityMessage(false, "AddNewExpense");
      }, 3000);
		})
	}




	addNewExpenseFunction(){
    
    this.props.checkActivityLoader(true);
		var day = this.state.new_expense.expense_date.getDay();
    if(day === 0){
      day = 7;
    }
		var first_day = week_first_day(this.state.new_expense.expense_date, day);
		var last_day = week_last_day(first_day);
		const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
		const document_name = week_document_name(first_day);
		var first_date = week_first_date(first_day);
		var last_date = week_last_date(last_day);
		const week_expense = {
			"week_name":first_date+" to "+last_date,
			"week_total_expense":0,
			"week_expense_date":new Date(first_day),
      "week_expense_month":months[new Date(last_day).getMonth()]
		};

    var expense_price = parseFloat(this.state.new_expense.expense_price);

    const new_expense = {
      "expense_name":this.state.new_expense.expense_name,
      "expense_date":this.state.new_expense.expense_date,
      "expense_category":this.state.new_expense.expense_category,
      "expense_price":round(expense_price),
      "expense_print_date":printDate(this.state.new_expense.expense_date)
    };

		var expense_store = firestore().collection('Users').doc(this.props.userToken).collection('WeekExpenses').doc(document_name);
		expense_store.get().then(snap=>{
			if(snap.exists){
				week_expense.week_total_expense = round(snap._data.week_total_expense + expense_price);
				expense_store.update({
					week_total_expense:round(week_expense.week_total_expense)
				});
			}
			else{
				week_expense.week_total_expense = round(expense_price);
				expense_store.set(week_expense);
        
			}
		});
		console.log(this.props.user_data.categories[this.state.new_expense.expense_category]);
    if(new Date(this.state.new_expense.expense_date).getMonth() < new Date().getMonth()){
      firestore().collection('Users').doc(this.props.userToken).update({
      last_month_expenses:round(this.props.user_data.last_month_expenses + expense_price),
      last_month_savings: round(this.props.user_data.last_month_savings - expense_price)
    }).then(res=>{

    })
    }
    else{
		firestore().collection('Users').doc(this.props.userToken).update({
			current_expenses:round(this.props.user_data.current_expenses + expense_price),
					[`categories.${this.state.new_expense.expense_category}`]:round(this.props.user_data.categories[this.state.new_expense.expense_category] + expense_price)
		}).then(res=>{

		})
    }
		firestore().collection("Users").doc(this.props.userToken).collection('DailyExpenses').add(new_expense).then(res=>{
      this.props.checkActivityMessage(true, "ExpenseList");
      this.props.enteredActivityMessage("Expense is Added Successfully");
      this.props.checkActivityLoader(false);
      console.log("dasasa", res);
      setTimeout(()=>{
        this.props.checkActivityMessage(false, "ExpenseList");
      }, 3000);
      this.props.navigation.popToTop();
      
    });
	}




  editExpenseFunction() {
    this.props.checkActivityLoader(true);
    var day = this.state.new_expense.expense_date.getDay();
    if(day === 0){
      day = 7;
    }
    var first_day = week_first_day(this.state.new_expense.expense_date, day);
		var last_day = week_last_day(first_day);
		const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
		const document_name = week_document_name(first_day);
		var first_date = week_first_date(first_day);
    var last_date = week_last_date(last_day);
    
    var single_detail = this.props.route.params.single_detail;
    single_detail.expense_date = single_detail.expense_date.toDate();
    var older_day = single_detail.expense_date.getDay();
    if(older_day === 0){
      older_day = 7;
    }
    var older_first_day = week_first_day(single_detail.expense_date, older_day);
		var older_last_day = week_last_day(older_first_day);
		const older_document_name = week_document_name(older_first_day);
		var older_first_date = week_first_date(older_first_day);
		var older_last_date = week_last_date(older_last_day);
    const week_expense = {
      "week_name":first_date+" to "+last_date,
      "week_total_expense":0,
      "week_expense_date":new Date(first_day),
      "week_expense_month":months[new Date(last_day).getMonth()]
    };
    var expense_price = parseFloat(this.state.new_expense.expense_price);
    var older_price = parseFloat(single_detail.expense_price);
    var edited_price = expense_price - older_price;
    edited_price = round(edited_price);


    var new_expense = this.state.new_expense;
    new_expense.expense_price = parseFloat(new_expense.expense_price);
    new_expense.expense_price = round(new_expense.expense_price);
    var user_data = this.props.user_data;

    var expense_store = firestore().collection('Users').doc(this.props.userToken).collection('WeekExpenses').doc(document_name);
    var older_expense_store = firestore().collection('Users').doc(this.props.userToken).collection('WeekExpenses').doc(older_document_name);
    
    var older_month = new Date(single_detail.expense_date).getMonth();
    var new_month = new Date(new_expense.expense_date).getMonth();
    var current_month = new Date().getMonth();

    console.log(this.props.user_data.categories[this.state.new_expense.expense_category]);

    if(older_month < current_month) {
      user_data.last_month_expenses = round(user_data.last_month_expenses - older_price);
      user_data.last_month_savings = round(user_data.last_month_savings + older_price);
    }
    if(older_month === current_month) {
      user_data.current_expenses = round(user_data.current_expenses - older_price);
      user_data.categories[single_detail.expense_category] = round(user_data.categories[single_detail.expense_category] - older_price);
    }
    if(new_month < current_month) {
      user_data.last_month_expenses = round(user_data.last_month_expenses + expense_price);
      user_data.last_month_savings = round(user_data.last_month_savings - expense_price);
    }
    if(new_month === current_month) {
      user_data.current_expenses = round(user_data.current_expenses + expense_price);
      user_data.categories[new_expense.expense_category] = round(user_data.categories[new_expense.expense_category] + expense_price);
    }

    firestore().collection('Users').doc(this.props.userToken).set(user_data).then(res=>{

    })

    older_expense_store.get().then(week_snap=>{
      if(week_snap.exists) {
        if(document_name === older_document_name){

          week_expense.week_total_expense = week_snap._data.week_total_expense + edited_price;
          expense_store.update({
            week_total_expense:round(week_expense.week_total_expense)
          });
    
          
        }
        else {
          week_expense.week_total_expense = week_snap._data.week_total_expense - older_price;
          older_expense_store.update({
            week_total_expense:round(week_expense.week_total_expense)
          })
    
          expense_store.get().then(snap=>{
            if(snap.exists){
              week_expense.week_total_expense = snap._data.week_total_expense + expense_price;
              expense_store.update({
                week_total_expense:round(week_expense.week_total_expense)
              });
            }
            else{
              week_expense.week_total_expense = round(expense_price);
              expense_store.set(week_expense);
            }
          });
        }
      }
    })
    
    
    var new_expense = this.state.new_expense;
    new_expense.expense_print_date = printDate(this.state.new_expense.expense_date);
    firestore().collection("Users").doc(this.props.userToken).collection('DailyExpenses').doc(this.props.route.params.single_detail.key).set(new_expense).then(res=>{
      this.props.checkActivityMessage(true, "ExpenseList");
      this.props.enteredActivityMessage("Expense is Edited Successfully");
    this.props.checkActivityLoader(false);
    setTimeout(()=>{
      this.props.checkActivityMessage(false, "ExpenseList");
    }, 3000);
    if(this.props.route.params.page_name === "Add" || this.props.route.params.page_name === "Edit") {
      this.props.navigation.popToTop();
    }
    }) 
  }



  addNewEventExpense() {
    var event_item = this.props.route.params.event_item;
    console.log(event_item);
    
    firestore().collection("Events").doc(event_item.key).collection("EventExpenses").add(this.state.new_expense).then(res=>{
      console.log(res._documentPath._parts[3]);
      firestore().collection("Events").doc(event_item.key).update({
        event_price: round(event_item.event_price + parseFloat(this.state.new_expense.expense_price))
      })
      .then(res=>{
        console.log("Done");
        firestore().collection("Events").doc(event_item.key).get().then(res=>{
          var event_item_changed = res._data;
          event_item_changed.key = event_item.key;
          event_item_changed.start_print_date = event_item.start_print_date;
          event_item_changed.end_print_date = event_item.end_print_date;
          console.log(event_item_changed);
          this.props.getEventData(event_item_changed);
          this.props.navigation.goBack();
        })
        
      })
      if(this.state.new_expense.added_in_event === true) {
        this.addNewExpenseFunction();
      }
      
    });
  }




  showErrorMessage(){
    this.props.checkActivityError(true, "AddNewExpense");
      setTimeout(()=>{
        this.props.checkActivityError(false, "AddNewExpense");
      }, 3000);
  }




	render() {
		const categories = Object.keys(this.props.user_data.categories);
		const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const category_message = "Added New Category Successfully";
    const page_name = this.props.route.params.page_name;
    console.log(page_name);
    return (

        
      <View style={PhoneLoginStyles.phoneView}>
        <View style={{backgroundColor:'#078D1D', width:'100%', height:verticalScale(110)}}>
          <TouchableOpacity style={{position:'absolute', paddingTop:verticalScale(18), paddingLeft:10, zIndex:1, paddingRight:10}}
                            onPress={()=>{
                              this.props.navigation.goBack();
                            }}>
            <Icon name={"arrowleft"} color={'white'} size={20} style={{}}/>
          </TouchableOpacity>
          <Text style={{color:'white', paddingTop:verticalScale(14), fontSize:scale(18), paddingLeft:32, fontFamily:'Montserrat-Bold'}}>
            {page_name === "Add" || page_name === "EventPage" ? `Add New Expense` : `Edit Expense`}
          </Text>
            <TouchableOpacity 
            activeOpacity={0.8}
            style={{width:moderateScale(156), backgroundColor:'white', height:verticalScale(43), alignSelf:'center', marginTop:verticalScale(56), flexDirection:'row', justifyContent:'center', borderRadius:100, elevation: 3, position:'absolute', right:20}}
            onPress={()=>{
              this.setState({
              	show_calendar:true
              })
            }}>
            	<Icon name="calendar" color={'grey'} size={19} style={{paddingTop:12, paddingRight:8}}/>
              <Text style={{color:'grey', alignSelf:'center', fontFamily:'Montserrat-Bold', fontSize:scale(13)}}>
                {this.state.day_button}
              </Text>
          </TouchableOpacity>
        </View>
        <ScrollView keyboardShouldPersistTaps={'handled'}>
        <View style={{marginLeft:20, marginRight:20, marginTop:25}}>
        	<View>
        		<Text style={this.state.name_style}>Expense Name</Text>
        		<TextInput style={{borderBottomWidth:1, marginTop:0, borderColor:'#9E9E9E'}}
                       value={this.state.new_expense.expense_name}
        							 onChangeText={(name)=>{
        							 	this.setState({
        							 		new_expense:{
        							 			...this.state.new_expense,
        							 			"expense_name":name
        							 		}
        							 	})
        							 }}/>
        	</View>
        	<View>
        		<Picker
        			style={{ height: 50, width: scale(330), marginTop:20, fontFamily:'Montserrat-Regular' }}
        			mode={'dropdown'}
        			selectedValue={this.state.new_expense.expense_category}
        			onValueChange={(itemValue, itemIndex) => {
        				if(itemValue === null){
        					this.setState({
        						add_category:true
        					})
        				}
        				else if(itemValue !== "Select Category"){
        					this.setState({
        						new_expense:{
        							...this.state.new_expense,
        							expense_category:itemValue
        						}
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
      		<View style={{marginTop:10}}>
      			<Text style={this.state.name_style}>Expense Price</Text>
      			<TextInput style={{borderBottomWidth:1, marginTop:0, borderColor:'#9E9E9E'}}
      								 keyboardType="numeric"
                       value={String(this.state.new_expense.expense_price)}
      								 onChangeText={(price)=>{
      								 	this.setState({
      								 		new_expense:{
      								 			...this.state.new_expense,
      								 			expense_price:price
      								 		}
      								 	})
      								 }}/>
      		</View>
          {page_name === "EventPage" ? 
          <View style={{marginTop:10}}>
            <View style={{flexDirection:'row', alignItems:'center'}}>
              <CheckBox tintColors={true ? "#078D1D" : "#aaaaaa"}
                        value={this.state.new_expense.added_in_event}
                        onValueChange={(newValue) => {
                          this.setState({
                            new_expense:{
                              ...this.state.new_expense,
                              added_in_event: !this.state.new_expense.added_in_event
                            }
                          })
                        }}
              />
              <Text style={{fontFamily:'Montserrat-Regular'}}>Add In Monthly Expense</Text>
            </View>
          </View> : null }
      		<TouchableOpacity 
            activeOpacity={0.8}
            style={{width:moderateScale(225), backgroundColor:'#63A335', height:verticalScale(45), alignSelf:'center', marginTop:verticalScale(33), flexDirection:'row', justifyContent:'center', borderRadius:100, elevation: 3, marginBottom:10}}
            onPress={()=>{
              if(this.state.new_expense.expense_name === ""){
                this.setState({
                  error_message:"Please Enter a valid Expense Name"
                })
                this.showErrorMessage();
              }
              else if(this.state.new_expense.expense_category === ""){
                this.setState({
                  error_message:"Please Enter a valid Expense Category"
                })
                this.showErrorMessage();
              }
              else if(this.state.new_expense.expense_price === "" || this.state.new_expense.expense_price === "0" || isNaN(this.state.new_expense.expense_price)) {
                this.setState({
                  error_message:"Please Enter a valid Expense Price"
                })
                this.showErrorMessage();
              }
              else{
                if(page_name === "Add"){
                  this.addNewExpenseFunction();
                }
                else if(page_name === "EventPage"){
                  this.addNewEventExpense();
                }
                else {
                  this.editExpenseFunction();
                }
            	  
              }
            }}>
              <Text style={{color:'white', alignSelf:'center', fontFamily:'Montserrat-SemiBold', fontSize:scale(14)}}>
                {page_name === "Add" || page_name === "EventPage" ? `Add New Expense` : `Edit Expense`}
              </Text>
          </TouchableOpacity>
          {this.state.show_calendar ? (
        	<DateTimePicker testID="dateTimePicker"
        	value={this.state.new_expense.expense_date}
          timeZoneOffsetInMinutes={0}
          maximumDate={new Date()}
          minimumDate={new Date().setDate(new Date().getDate()-30)}
          display="default"
          onChange={(event, selectedDate)=>{
          	var day_button = this.state.day_button;
            if(selectedDate !== undefined){
          	  if(selectedDate.getDate() !== this.state.today_date.getDate()){
          		  day_button = selectedDate.getDate()+"-"+months[selectedDate.getMonth()];
          	  }
          	  else{
          		  day_button = "Today";
          	  }
          	
          	  this.setState({
          		  new_expense:{
          			  ...this.state.new_expense,
          			  "expense_date":new Date(selectedDate)
          		  },
          		  day_button:day_button
          	  })
          	  console.log(selectedDate);
            }
            this.setState({
              show_calendar:false
            })
          }}/>) : null}
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.add_category}
          onRequestClose={() => {
            this.setState({
              add_category:false
            })
          }}
        >
        	<TouchableOpacity style={{position:'absolute', width:'100%', height:'100%', backgroundColor:'#4141418f'}}
                            onPress={()=>{
                              this.setState({
                                add_category: false
                              })
                            }}></TouchableOpacity>
        	<View style={{backgroundColor:'white', position:'absolute', bottom:80, width:'100%', alignItems:'center', alignSelf:'center', elevation:10, padding:20}}>
        		<View style={{width:'100%'}}>
        			<Text style={this.state.name_style}>Add Category</Text>
        		<TextInput style={{borderBottomWidth:1, marginTop:0, borderColor:'#9E9E9E'}}
        							 onChangeText={(name)=>{
        							 	this.setState({
        							 		new_expense:{
        							 			...this.state.new_expense,
        							 			"expense_category":name
        							 		}
        							 	})
        							 }}/>
        		</View>
        		<TouchableOpacity 
            activeOpacity={0.8}
            style={{width:moderateScale(225), backgroundColor:'#63A335', height:verticalScale(45), alignSelf:'center', marginTop:verticalScale(33), flexDirection:'row', justifyContent:'center', borderRadius:100, elevation: 3, marginBottom:10}}
            onPress={()=>{
              if(this.state.new_expense.expense_category === ""){
                this.setState({
                  error_message:"Please Enter a valid Expense Category"
                })
                this.showErrorMessage();
              }
              else {
            		this.updateCategory();
            	  this.setState({
            		  add_category:false
            	  })
              }
            }}>
              <Text style={{color:'white', alignSelf:'center', fontFamily:'Montserrat-SemiBold', fontSize:scale(14)}}>
                Add New Category
              </Text>
          </TouchableOpacity>
        	</View>
        </Modal>
        </ScrollView>
        {this.props.activity_message && this.props.message_page_name === "AddNewExpense" ? <ActivityMessage message={category_message}/> : null}
        {this.props.activity_error && this.props.error_page_name === "AddNewExpense"? <ActivityError error={this.state.error_message}/> : null}
        {this.props.activity_loader ? <ActivityLoader/> : null}
      </View>
        
    );
  }
}

const WrappedComponent = connect(({signInReducer, userDashboardDataReducer, activityReducer}) => {
  return {
    userToken: signInReducer.userToken,
    user_data: userDashboardDataReducer.user_data,
    activity_message: activityReducer.activity_message,
    activity_error: activityReducer.activity_error,
    activity_loader: activityReducer.activity_loader,
    message_page_name: activityReducer.message_page_name,
    entered_activity_message: activityReducer.entered_activity_message,
    error_page_name: activityReducer.error_page_name
  };
}, (dispatch) => {
  return {
  	addExpenseAction:(new_expense, user_token) => dispatch(addExpenseAction(new_expense, user_token)),
    checkActivityMessage:(message_state, page_name) => dispatch(checkActivityMessage(message_state, page_name)),
    checkActivityError:(error_state, page_name) => dispatch(checkActivityError(error_state, page_name)),
    checkActivityLoader:(loader_state) => dispatch(checkActivityLoader(loader_state)),
    getEventData:(event_item) => dispatch(getEventData(event_item)),
    emptyThisMonthExpenses: () => dispatch(emptyThisMonthExpenses()),
    enteredActivityMessage: (entered_activity_message) => dispatch(enteredActivityMessage(entered_activity_message))
}})(AddNewExpense);

export default WrappedComponent;

const PhoneLoginStyles = StyleSheet.create({
  phoneView:{
    backgroundColor: '#F6F6F6',
    flex:1,
    flexDirection:'column'
  },

})
