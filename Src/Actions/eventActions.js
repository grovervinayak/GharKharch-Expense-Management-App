import {ACTION_CONSTANTS}
 from "../Utils/Constants";
import axios from "axios";
import {CONSTANT_TYPES} from "../Core/ActionConstants";

export function getEventList(all_events) {
	return {
		type: ACTION_CONSTANTS.GET_EVENT_LIST,
		all_events
	}
}

export function getEventExpenses(event_expenses) {
	return {
		type: ACTION_CONSTANTS.GET_EVENT_EXPENSES,
		event_expenses
	}
}