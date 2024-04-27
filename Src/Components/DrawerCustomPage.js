import React, { Component, useEffect } from 'react';
import {Text, View, StyleSheet, Button, Alert,TextInput, ScrollView, Image, TouchableOpacity, TouchableHighlight} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { scale, moderateScale, verticalScale} from './Scaling';

export function DrawerCustomPage(props) {
  return (
    <DrawerContentScrollView {...props}>
    	<View style={{flexDirection:'row', justifyContent:'space-around'}}>
    		<Image source={{uri:'https://firebasestorage.googleapis.com/v0/b/gharkharch-74971.appspot.com/o/Ghar%20Kharch%20Logo%2FGHAR%20KHARCH.png?alt=media&token=b7836a95-9a77-44f0-8ac8-455c1eb1a814'}}
                   style={{ height: verticalScale(150), width:scale(200)}}>
            </Image>
    	</View>
        <View style={{backgroundColor:'#F6F6F6'}}>
      		<DrawerItemList {...props} />
      	</View>
      <View style={{flexDirection:'row', justifyContent:'space-around', marginTop:40}}>
      		<Text style={{fontFamily:'NotoSans-Regular'}}>Version 3.1</Text>
      </View>
    </DrawerContentScrollView>
  );
}