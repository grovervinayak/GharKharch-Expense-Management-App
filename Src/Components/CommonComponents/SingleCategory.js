import React, { Component, useEffect } from 'react';
import {Text, View, StyleSheet, Button, Alert,TextInput, ScrollView, Image, TouchableOpacity, TouchableHighlight} from 'react-native';

import { scale, moderateScale, verticalScale} from '../Scaling';

export function SingleCategory(props){
	return(
		<View style={{marginBottom:14, paddingBottom:5, borderColor:'#E0E0E0'}}>
            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                <Text style={{fontFamily:'NotoSans-Regular', color:'grey'}}>{props.category_name}</Text>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                    <Text style={{fontFamily:'NotoSans-Bold', marginBottom:-4, marginTop:0, color:'grey', fontSize:scale(12)}}>₹{props.expected_category_value}</Text>
                    {props.page_name!=="Budget" ?
                        <Text style={{fontFamily:'NotoSans-Bold', marginBottom:-4, marginTop:0, color:'#e89110', fontSize:scale(15), marginLeft:scale(10)}}>₹{props.category_value}</Text>
                    : null}
                </View>
            </View>
            {props.page_name!=="Budget" ? 
            <View style={{height:8, backgroundColor:'#e8e8e8', marginTop:3, borderRadius:10}}>
                <View style={{backgroundColor:'#f49913', height:8, width:`${props.category_width}%`, borderTopLeftRadius:10, borderBottomLeftRadius:10}}>
                </View>
            </View>
            : null }
            <View style={{height:8, backgroundColor:'#e8e8e8', marginTop:3, borderRadius:10}}>
                <View style={{backgroundColor:'grey', height:8, width:`${props.expected_category_width}%`, borderTopLeftRadius:10, borderBottomLeftRadius:10}}>
                </View>
            </View>
        </View>
    )
}