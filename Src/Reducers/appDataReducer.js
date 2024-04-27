import {ACTION_CONSTANTS, SIGNIN_STATUS}
 from "../Utils/Constants";
import {CONSTANT_TYPES} from "../Core/ActionConstants";
import AsyncStorage from '@react-native-community/async-storage';

export default function reducer(state = {
	event_item: {},
	expected_category: []
}, action){
	switch(action.type){
		case ACTION_CONSTANTS.GET_EVENT_DATA: {
			return{...state, event_item: action.event_item}
		}

		case ACTION_CONSTANTS.GET_EXPECTED_CATEGORY_DATA: {
			var categories = action.user_data === undefined ? [] : Object.keys(action.user_data.categories);
    		var bud_categories = [];
    		categories.forEach((single_cat, index)=>{
      			var single_bud_cat = 0;
      			if(action.user_data.expected_categories !== undefined) {
        			if(action.user_data.expected_categories[single_cat] !== undefined) {
          				single_bud_cat = action.user_data.expected_categories[single_cat];
        			}
      			}
      			bud_categories.push(single_bud_cat);
    		})
			return{...state, expected_category: bud_categories}
		}
	}
	return state;
}
