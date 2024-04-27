import React, { Component, useEffect } from 'react';
import {Text, View, StyleSheet, Button, Alert,TextInput, ScrollView, Image, TouchableOpacity, TouchableHighlight} from 'react-native';
import { scale, moderateScale, verticalScale} from './Scaling';
import {SingleAboutCard} from "./CommonComponents/SingleCard";
import {DrawerHeader} from "./CommonComponents/PageHeader";

export default class AboutUs extends Component {
  constructor(props) {
    super(props);
    this.state = {
    	text: "",
      phone_number:"",
      feature_data:[{
        "feature_image":"https://firebasestorage.googleapis.com/v0/b/gharkharch-74971.appspot.com/o/Lottie%20Files%2Fanimation_200_keu9z2mj-0.jpg?alt=media&token=9ac26499-d7bb-48f8-9773-3d96117cfa56",
        "feature_title":"Organized Expenses",
        "feature_description":"Easy dashboard with current and last month expenses. Category wise separation to get a good understanding of your expenses"
      },
      {
        "feature_image":"https://firebasestorage.googleapis.com/v0/b/gharkharch-74971.appspot.com/o/Lottie%20Files%2Fanimation_200_kev1laj3-0.jpg?alt=media&token=2643c460-7b9b-4d9d-8a1f-4f2ffa2727ef",
        "feature_title":"Detailed Expenses",
        "feature_description":"Week wise expense list starting from Monday to Sunday. Detailed expenses with every expense name and category to get a detailed overview of the expenses."
      },
      {
        "feature_image":"https://firebasestorage.googleapis.com/v0/b/gharkharch-74971.appspot.com/o/Lottie%20Files%2Fanimation_200_kev1rbkq-0.jpg?alt=media&token=74a15e5a-c7f4-4399-a086-7a33f1e15c02",
        "feature_title":"Salary Budget",
        "feature_description":"Add or change your salary to get savings for your current and last month. Plan your budget for the whole month"
      }],

      stories_data:[{
        "feature_image":"https://firebasestorage.googleapis.com/v0/b/gharkharch-74971.appspot.com/o/Lottie%20Files%2Fanimation_300_kev2fth3-84.jpg?alt=media&token=a406fd10-231e-4415-8510-c3309c3f2ee4",
        "feature_title":"Our Mission",
        "feature_description":"Our mission is to deliver a diverse way to manage and reduce the irrelevant expenses. We want to make our user financially literate and strong"
      },
      {
        "feature_image":"https://firebasestorage.googleapis.com/v0/b/gharkharch-74971.appspot.com/o/Lottie%20Files%2Fanimation_300_kev2j5kl-1.jpg?alt=media&token=1b6ac890-f6c9-4aee-84f6-de03a0daa337",
        "feature_title":"Our Support",
        "feature_description":"We provide a top-notch support and we promise to solve each and every query of the user as clearing the doubts of our user is our main priority"
      }
      ]
   	};
  }

  render() {
    return (

      <View style={PhoneLoginStyles.phoneView}>
        <DrawerHeader header_name={"About Us"}/>

        <ScrollView>
          <View style={{alignItems:'center', marginTop:10}}>
            <Text style={{textTransform:'uppercase', fontFamily:'NotoSans-Bold', color:'#63a335', fontSize:scale(25)}}>
              Ghar kharch
            </Text>
            <Text style={{textTransform:'uppercase', fontFamily:'NotoSans-Regular', color:'#63a335', fontSize:scale(12)}}>
              Your personal expense manager
            </Text>
          </View>
          <View style={{backgroundColor:'white', marginHorizontal:15, marginTop:20, paddingHorizontal:10, paddingVertical:15, borderRadius:8, borderWidth:1, borderColor:'#e1e4e86d'}}>
            <Text style={{fontFamily:'NotoSans-Regular', color:'grey'}}>
              Ghar Kharch app is the personal expense manager through which expenses can be managed easily.
            </Text>
          </View>
          <View style={{marginHorizontal:15, marginTop:20}}>
            <Text style={{fontFamily:'Montserrat-Bold', fontSize:16, borderBottomWidth:1, borderColor:'lightgray', paddingBottom:5, color:'grey'}}>
              App Features
            </Text>
          </View>
          {this.state.feature_data.map((single_feature, index)=>
            <SingleAboutCard key={index}
                             single_feature={single_feature}/>
          )}

          <View style={{marginHorizontal:15, marginTop:20}}>
            <Text style={{fontFamily:'Montserrat-Bold', fontSize:16, borderBottomWidth:1, borderColor:'lightgray', paddingBottom:5, color:'grey'}}>
              Our Stories
            </Text>
          </View>
          {this.state.stories_data.map((single_feature, index)=>
            <SingleAboutCard key={index}
                             single_feature={single_feature}/>
          )}
          <View style={{height:20}}>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const PhoneLoginStyles = StyleSheet.create({
  phoneView:{
    backgroundColor: '#F6F6F6',
    flex:1
  },

})