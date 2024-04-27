import {ACTION_CONSTANTS, SIGNIN_STATUS}
 from "../Utils/Constants";
import {CONSTANT_TYPES} from "../Core/ActionConstants";

export default function reducer(state = {
	event_list:[],
	event_expenses: []
}, action){
	switch(action.type){
		case ACTION_CONSTANTS.GET_EVENT_LIST: {
			var event_list = [{
				title:"Ongoing",
				data:[]
			},
			{
				title: "Upcoming",
				data:[]
			},
			{
				title: "Completed",
				data:[]
			}];
			var number_months=["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
			action.all_events.forEach((single_event, index)=>{
				var start_date = single_event.data().start_date.toDate();
				start_date.setHours(0);
				start_date.setMinutes(0);
				start_date.setSeconds(0);
				var start_print_date = start_date.getDate()+"/"+number_months[start_date.getMonth()]+"/"+start_date.getFullYear();

				var end_date = single_event.data().end_date.toDate();
				end_date.setHours(23);
				end_date.setMinutes(59);
				end_date.setSeconds(59);
				var end_print_date = end_date.getDate()+"/"+number_months[end_date.getMonth()]+"/"+end_date.getFullYear();

				var event_status = "";
				var event_color = "";
				var event_number = "";
				var current_date = new Date();
				if(start_date > current_date) {
					event_status = "Upcoming";
					event_color = "#e1b92a";
					event_number = 1;
				}
				else
				if(start_date <= current_date && end_date >= current_date){
					event_status = "Ongoing";
					event_color = "#078D1D";
					event_number = 0;
				}
				else
				if(start_date < current_date && end_date < current_date){
					event_status = "Completed";
					event_color = "#f40e0e";
					event_number = 2;
				}

				event_list[event_number].data.push({
					...single_event.data(),
					key: single_event.id,
					start_print_date: start_print_date,
					end_print_date: end_print_date,
					event_status: event_status,
					event_color: event_color
				})
			})
			return{...state, event_list: event_list}
		}

		case ACTION_CONSTANTS.GET_EVENT_EXPENSES: {
			var event_expenses = [];
			action.event_expenses.forEach((single_event_expense, index)=>{
				var single_expense = single_event_expense.data();
				single_expense.key = single_event_expense.id;
				event_expenses.push(single_expense);
			})
			return {...state, event_expenses: event_expenses}
		}
	}
	return state;
}
