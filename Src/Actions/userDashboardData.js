import {ACTION_CONSTANTS}
 from "../Utils/Constants";
import axios from "axios";
import {CONSTANT_TYPES} from "../Core/ActionConstants";

export function userDashboardData(user_data) {
  return {
    type: ACTION_CONSTANTS.USER_DASHBOARD_DATA,
    user_data
  }
}

export function userContacts(contacts, event_item) {
	return {
		type: ACTION_CONSTANTS.USER_CONTACTS,
		contacts, event_item
	}
}

export function addUserInEvent(user_contact) {
	return {
		type: ACTION_CONSTANTS.ADD_USER_IN_EVENT,
		user_contact
	}
}

export function removeUserInEvent(user_contact) {
	return {
		type: ACTION_CONSTANTS.REMOVE_USER_IN_EVENT,
		user_contact
	}
}