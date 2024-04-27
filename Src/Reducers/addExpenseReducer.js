import {ACTION_CONSTANTS, SIGNIN_STATUS}
 from "../Utils/Constants";
import {CONSTANT_TYPES} from "../Core/ActionConstants";
import {printDate} from "../Components/Scaling";

export default function reducer(state = {
	week_expenses_list:[],
	all_week_expenses:{
				"1":{
					"expense_day_price":0,
					"expense_details":[]
				},
				"2":{
					"expense_day_price":0,
					"expense_details":[]
				},
				"3":{
					"expense_day_price":0,
					"expense_details":[]
				},
				"4":{
					"expense_day_price":0,
					"expense_details":[]
				},
				"5":{
					"expense_day_price":0,
					"expense_details":[]
				},
				"6":{
					"expense_day_price":0,
					"expense_details":[]
				},
				"7":{
					"expense_day_price":0,
					"expense_details":[]
				}
			},
	swiping: false,
	start_week_date:new Date(),
	end_week_date:new Date(),
	recent_expenses:[],
	this_month_expenses:[],
	last_month_expenses:[]
}, action){
	switch(action.type){
		
		case ACTION_CONSTANTS.LIST_WEEK_EXPENSES: {
		var week_expenses_list = [];
		if(action.week_expenses !== null) {
			action.week_expenses.forEach((single_expense, index)=>{
				week_expenses_list.push({
          			...single_expense.data(),
          			key: single_expense.id,
        		});
			})
		}
			return{...state, week_expenses_list:week_expenses_list}
		}

		case ACTION_CONSTANTS.GET_WEEK_EXPENSES: {
			var all_week_expenses_detail = {
				"1":{
					"expense_day_price":0,
					"expense_details":[]
				},
				"2":{
					"expense_day_price":0,
					"expense_details":[]
				},
				"3":{
					"expense_day_price":0,
					"expense_details":[]
				},
				"4":{
					"expense_day_price":0,
					"expense_details":[]
				},
				"5":{
					"expense_day_price":0,
					"expense_details":[]
				},
				"6":{
					"expense_day_price":0,
					"expense_details":[]
				},
				"7":{
					"expense_day_price":0,
					"expense_details":[]
				}
			};
			if(action.all_expenses !== null) {
			action.all_expenses.forEach((single_expense, index)=>{
				const datee = single_expense.data().expense_date.toDate();
				var expense_day = "";
				if(datee.getDay() == 0){
					expense_day = 7;
				}
				else{
					expense_day = datee.getDay();
				};
				console.log(expense_day);
				all_week_expenses_detail[expense_day].expense_details.push({
					...single_expense.data(),
					key: single_expense.id,
					expense_print_date: printDate(single_expense.data().expense_date.toDate())
				});
				all_week_expenses_detail[expense_day].expense_day_price = all_week_expenses_detail[expense_day].expense_day_price + parseFloat(single_expense.data().expense_price);
				all_week_expenses_detail[expense_day].expense_print_date = printDate(single_expense.data().expense_date.toDate());
			})
			}
			return {...state, all_week_expenses: all_week_expenses_detail}
		}

		case ACTION_CONSTANTS.GET_SWIPING_ENABLED: {
		
			return{...state, swiping: action.swiping}
		}

		case ACTION_CONSTANTS.GET_START_END_DATE: {
			var day = action.week_expense_date.getDay();
    		if(day === 0){
      			day = 7;
    		}
			var first_day = new Date(action.week_expense_date).setDate(action.week_expense_date.getDate() - day+1);
			var last_day = new Date(first_day).setDate(new Date(first_day).getDate()+6);
			
			first_day = new Date(first_day);
			first_day.setHours(0);
			first_day.setMinutes(0);
			first_day.setSeconds(0);

			last_day = new Date(last_day);
			last_day.setHours(23);
			last_day.setMinutes(59);
			last_day.setSeconds(59);

			return {...state, start_week_date: first_day, end_week_date: last_day}
		}

		case ACTION_CONSTANTS.RECENT_EXPENSES_LIST: {
			var recent_expenses = [];
			action.recent_expenses.forEach((single_expense, index)=>{
				single_expense.key = single_expense.data.id;
				recent_expenses.push({
					...single_expense.data(),
					'key': single_expense.id,
					'expense_print_date': printDate(single_expense.data().expense_date.toDate())
				});
			})
			return{...state, recent_expenses: recent_expenses}
		}

		case ACTION_CONSTANTS.THIS_MONTH_EXPENSES_LIST: {
			var this_month_expenses = state.this_month_expenses;
			action.this_month_expenses.forEach((single_expense, index)=>{
				this_month_expenses.push({
					...single_expense.data(),
					'key': single_expense.id,
					'expense_print_date': printDate(single_expense.data().expense_date.toDate())
				});
			})
			return{...state, this_month_expenses: this_month_expenses}
		}

		case ACTION_CONSTANTS.LAST_MONTH_EXPENSES_LIST: {
			var last_month_expenses = state.last_month_expenses;
			action.last_month_expenses.forEach((single_expense, index)=>{
				single_expense.key = single_expense.data.id;
				last_month_expenses.push({
					...single_expense.data(),
					'key': single_expense.id,
					'expense_print_date': printDate(single_expense.data().expense_date.toDate())
				});
			})
			return{...state, last_month_expenses: last_month_expenses}
		}

		case ACTION_CONSTANTS.EMPTY_THIS_MONTH_EXPENSES: {
			return {...state, this_month_expenses: []}
		}

		case ACTION_CONSTANTS.EMPTY_LAST_MONTH_EXPENSES: {
			return {...state, last_month_expenses: []}
		}
	}
	return state;
}
