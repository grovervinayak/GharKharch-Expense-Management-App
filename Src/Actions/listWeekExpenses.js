import {ACTION_CONSTANTS}
 from "../Utils/Constants";
import axios from "axios";
import {CONSTANT_TYPES} from "../Core/ActionConstants";

export function listWeekExpenses(week_expenses) {
  return {
    type: ACTION_CONSTANTS.LIST_WEEK_EXPENSES,
    week_expenses
  }
}

export function getWeekExpenses(all_expenses) {
	return {
		type: ACTION_CONSTANTS.GET_WEEK_EXPENSES,
		all_expenses
	}
}

export function getSwipingEnabled(swiping) {
	return {
		type: ACTION_CONSTANTS.GET_SWIPING_ENABLED,
		swiping
	}
}

export function getStartEndDate(week_expense_date) {
	return {
		type: ACTION_CONSTANTS.GET_START_END_DATE,
		week_expense_date
	}
}

export function recentExpensesList(recent_expenses, page_name) {
	return {
		type: ACTION_CONSTANTS.RECENT_EXPENSES_LIST,
		recent_expenses, page_name
	}
}

export function thisMonthExpensesList(this_month_expenses) {
	return {
		type: ACTION_CONSTANTS.THIS_MONTH_EXPENSES_LIST,
		this_month_expenses
	}
}

export function lastMonthExpensesList(last_month_expenses) {
	return {
		type: ACTION_CONSTANTS.LAST_MONTH_EXPENSES_LIST,
		last_month_expenses
	}
}

export function emptyThisMonthExpenses() {
	return {
		type: ACTION_CONSTANTS.EMPTY_THIS_MONTH_EXPENSES
	}
}

export function emptyLastMonthExpenses() {
	return {
		type: ACTION_CONSTANTS.EMPTY_LAST_MONTH_EXPENSES
	}
}

