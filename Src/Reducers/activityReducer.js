import {ACTION_CONSTANTS, SIGNIN_STATUS}
 from "../Utils/Constants";
import {CONSTANT_TYPES} from "../Core/ActionConstants";
import AsyncStorage from '@react-native-community/async-storage';

export default function reducer(state = {
	activity_loader: false,
	activity_message: false,
	activity_error: false,
	message_page_name: "",
	error_page_name: "",
	entered_activity_message:""
}, action){
	switch(action.type){
		case ACTION_CONSTANTS.CHECK_ACTIVITY_MESSAGE: {
			return{...state, activity_message: action.message_state, message_page_name: action.page_name}
		}

		case ACTION_CONSTANTS.CHECK_ACTIVITY_ERROR: {
			return{...state, activity_error: action.error_state, error_page_name: action.page_name}
		}

		case ACTION_CONSTANTS.CHECK_ACTIVITY_LOADER: {
			return{...state, activity_loader: action.loader_state}
		}

		case ACTION_CONSTANTS.ENTERED_ACTIVITY_MESSAGE: {
			return {...state, entered_activity_message: action.entered_activity_message}
		}
	}
	return state;
}