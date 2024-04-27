import {ACTION_CONSTANTS}
 from "../Utils/Constants";
import axios from "axios";
import {CONSTANT_TYPES} from "../Core/ActionConstants";

export function checkActivityLoader(loader_state) {
  return {
    type: ACTION_CONSTANTS.CHECK_ACTIVITY_LOADER,
    loader_state
  }
}

export function checkActivityMessage(message_state, page_name) {
	return {
		type: ACTION_CONSTANTS.CHECK_ACTIVITY_MESSAGE,
		message_state, page_name
	}
}

export function checkActivityError(error_state, page_name) {
	return {
		type: ACTION_CONSTANTS.CHECK_ACTIVITY_ERROR,
		error_state, page_name
	}
}

export function enteredActivityMessage(entered_activity_message) {
	return {
		type: ACTION_CONSTANTS.ENTERED_ACTIVITY_MESSAGE,
		entered_activity_message
	}
}