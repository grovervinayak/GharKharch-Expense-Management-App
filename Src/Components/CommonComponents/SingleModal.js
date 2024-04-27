import React, { Component, useEffect } from 'react';
import {Text, View, StyleSheet, Button, Alert,TextInput, ScrollView, Image, TouchableOpacity, TouchableHighlight, Modal} from 'react-native';

import { scale, moderateScale, verticalScale} from '../Scaling';

export function MessageModal(props) {
	return (
		<Modal
          animationType="fade"
          transparent={true}
          visible={props.show_modal}
          onRequestClose={() => {
            props.requestCloseFunction();
          }}
        >
          <View style={{flex:1, justifyContent:'space-around', alignItems:'center', backgroundColor:'#ffffffdd'}}>
            <View style={{backgroundColor:'white', elevation:5, width:scale(300), alignItems:'center', paddingVertical:15, paddingHorizontal:10}}>
              <Text style={{fontFamily:'NotoSans-Bold', fontSize:moderateScale(15), paddingBottom:5}}>{props.message_header}</Text>
              <Text style={{fontFamily:'NotoSans-Regular', color:'grey', fontSize:moderateScale(13)}}>{props.message_description}</Text>
              <TouchableOpacity 
              activeOpacity={0.8}
              style={{width:moderateScale(225), backgroundColor:'#63A335', height:verticalScale(45), alignSelf:'center', marginTop:verticalScale(33), flexDirection:'row', justifyContent:'center', borderRadius:100, elevation: 3, marginBottom:10}}
              onPress={()=>{
                props.pressFunction();
                if(props.page_name === "AskAQuestion") {
                	props.navigation.navigate("Home");
                }
              }}>
              <Text style={{color:'white', alignSelf:'center', fontFamily:'Montserrat-SemiBold', fontSize:scale(14)}}>
                OK
              </Text>
          </TouchableOpacity>
            </View>
          </View>
        </Modal>)
}