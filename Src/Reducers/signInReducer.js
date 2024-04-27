import {ACTION_CONSTANTS, SIGNIN_STATUS}
 from "../Utils/Constants";
import {CONSTANT_TYPES} from "../Core/ActionConstants";
import AsyncStorage from '@react-native-community/async-storage';

export default function reducer(state = {
	userToken: null,
	isSignedOut: false,
	isLoading: true
}, action){
	switch(action.type){
		case ACTION_CONSTANTS.SIGNIN_STATUS: {
			return{...state, isLoading: false, userToken: action.user}
		}
		case ACTION_CONSTANTS.RESTORE_TOKEN: {
			return{...state, isLoading: false, userToken: action.user}
		}
	}
	return state;
}
