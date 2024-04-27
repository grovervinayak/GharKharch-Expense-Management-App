import React, { Component, useEffect } from 'react';
import {Text, View, StyleSheet, Button, Alert,TextInput, ScrollView, Image, TouchableOpacity, TouchableHighlight} from 'react-native';
import { scale, moderateScale, verticalScale, round, printDate} from './Scaling';
import Icon from "react-native-vector-icons/AntDesign";
import { EventCardOuter } from './CommonComponents/SingleCard';

export default class ExpenseDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
    	text: "",
      phone_number:""
   	};
  }

  render() {
    return (

      <View style={PhoneLoginStyles.phoneView}>
        
        <View style={{}}> 
            <View style={{backgroundColor:'#078D1D', width:'100%', height:verticalScale(53), elevation:5}}>
            <TouchableOpacity style={{position:'absolute', paddingTop:verticalScale(18), paddingLeft:10, zIndex:1, paddingRight:10}}
                            onPress={()=>{
                              this.props.navigation.goBack();
                            }}>
            <Icon name={"arrowleft"} color={'white'} size={20} style={{}}/>
          </TouchableOpacity>
          <Text style={{color:'white', paddingTop:15, fontSize:scale(18), paddingLeft:32, fontFamily:'Montserrat-Bold'}}>
            Expense Detail
          </Text>
        </View>
          </View>

        <ScrollView>
            <View style={{marginTop:15}}>
                <EventCardOuter>
                    <View>
                        <Text>Expense</Text>
                    </View>
                </EventCardOuter>
            </View>
        </ScrollView>
      </View>
    );
  }
}

const PhoneLoginStyles = StyleSheet.create({
  phoneView:{
    backgroundColor: '#F6F6F6',
    flex:1,
    flexDirection:'column'
  },

})