import React, { Component, useEffect } from 'react';
import {Text, View, StyleSheet, Button, Alert,TextInput, ScrollView, Image, TouchableOpacity, TouchableHighlight} from 'react-native';

import { scale, moderateScale, verticalScale} from '../Scaling';

export function DrawerHeader(props){
	return(
		<View style={{backgroundColor:'#078D1D', height:verticalScale(57), elevation:5, flexDirection:'row', alignItems:'center'}}> 
            <Text style={{fontSize:scale(16), color:'white', fontFamily:'Montserrat-Bold', paddingLeft:20}}>{props.header_name}</Text>
        </View>
    )
}