import React, { Component, useEffect } from 'react';
import {Text, View, StyleSheet, Button, Alert,TextInput, ScrollView, Image, TouchableOpacity, TouchableHighlight, ActivityIndicator} from 'react-native';

export function ActivityMessage(props) {
	return (
		<View style={{position:'absolute', backgroundColor:'#078D1D', height:27, width:'100%', bottom:0, flexDirection:'row', justifyContent:'space-around', alignItems:'center'}}>
          <Text style={{color:'white', fontFamily:'Montserrat-Regular', fontSize:12}}>{props.message}</Text>
        </View>
    )
}

export function ActivityError(props) {
	return (
		<View style={{position:'absolute', backgroundColor:'#F34A30', height:27, width:'100%', bottom:0, flexDirection:'row', justifyContent:'space-around', alignItems:'center'}}>
          <Text style={{color:'white', fontFamily:'Montserrat-Regular', fontSize:12}}>{props.error}</Text>
        </View>
    )
}

export function ActivityLoader(props) {
	return(
		<ActivityIndicator size="large" color="#078D1D" style={{position:'absolute', flexDirection:'row', alignItems:'center', justifyContent:'space-around', height:'100%', width:'100%'}}/>
		)
}