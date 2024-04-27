import React, { Component, useEffect } from 'react';
import {Text, View, StyleSheet, Button, Alert,TextInput, ScrollView, Image, TouchableOpacity, TouchableHighlight} from 'react-native';

import { scale, moderateScale, verticalScale} from '../Scaling';

export function Divider(props){
	return(
		<View style={{borderBottomWidth:1, width:'100%', marginBottom:12, marginTop:12, borderColor:'#E0E0E0'}}>
        </View>
    )
}

export function DividerBorderLess(props){
	return(
		<View style={{borderBottomWidth:1, width:'100%', borderColor:'#E0E0E0'}}>
        </View>
    )
}