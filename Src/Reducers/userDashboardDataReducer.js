import {ACTION_CONSTANTS, SIGNIN_STATUS}
 from "../Utils/Constants";
import {CONSTANT_TYPES} from "../Core/ActionConstants";

export default function reducer(state = {
	user_data:{
		"user_name":"",
        "phone_number":"",
        "user_salary":null,
        "last_month_expenses":0,
        "current_expenses":0,
        "last_month_savings":0,
        "current_savings":0,
        "last_logged_in":"",
        "country_code":"",
        "categories":{}
	},

	user_contacts: [],
	event_users:[],
	event_contacts:[]
}, action){
	switch(action.type){
		case ACTION_CONSTANTS.USER_DASHBOARD_DATA: {
			var user_data = action.user_data;
			if(action.user_data === null){
				user_data = {
		"user_name":"",
        "phone_number":"",
        "user_salary":null,
        "last_month_expenses":0,
        "current_expenses":0,
        "last_month_savings":0,
        "current_savings":0,
        "last_logged_in":"",
        "country_code":"",
        "categories":{}
	};
			}
			else{
				user_data = user_data._data;
			}
			return{...state, user_data:user_data}
		}

		case ACTION_CONSTANTS.USER_CONTACTS: {
			
			var user_contacts=[];
			var temp_contacts=[];
			var event_item = action.event_item;
			var country_code = state.user_data.country_code;
			action.contacts.forEach((contact, index)=>{
				var phone_number_1 = "";

				contact.phoneNumbers.forEach((single_number, index1)=>{

					
					if(!temp_contacts.includes(single_number.number.substring(single_number.number.length - 4))){
						var user_contact = {
							"user_name":contact.displayName,
							"phone_number":single_number.number.split(" ").join(""),
							"add_status":false
						};
						var ph_number = user_contact.phone_number;
						if(ph_number.substring(0,1)!=="+"){
							ph_number = country_code+ph_number;
						}
						if(event_item.event_users.includes(ph_number)){
							user_contact.add_status = true;
						}
						user_contacts.push(user_contact);
					}
					temp_contacts.push(single_number.number.substring(single_number.number.length - 4));
				})
			})

			user_contacts.sort( (x, y) => {
    			let a = x.user_name.toUpperCase(),
        		b = y.user_name.toUpperCase();
    			return a == b ? 0 : a > b ? 1 : -1;
			});

			return {...state, user_contacts: user_contacts}
		}

		case ACTION_CONSTANTS.ADD_USER_IN_EVENT: {
			var user_phone_number = action.user_contact.phone_number;
			if(user_phone_number.substring(0,1) !== "+"){
				user_phone_number = state.user_data.country_code + user_phone_number;
			}
			var user_contact = {
				"user_name":action.user_contact.user_name,
				"user_phone_number":user_phone_number,
				"user_expense":0,
				"user_share_status":"Added",
				"user_designation":""
			};
			var event_users = state.event_users;
			var event_contacts = state.event_contacts;
			const available_number = event_users.findIndex(({user_phone_number})=> user_phone_number === user_contact.user_phone_number);
			console.log(available_number);
			if(available_number === -1) {
				event_users.push(user_contact);
				event_contacts.push(user_phone_number);
			}
			else{
				event_users[available_number].user_share_status = "Added";
			}

			var user_contacts = state.user_contacts;
			const contact_index = user_contacts.findIndex(({phone_number})=> phone_number === action.user_contact.phone_number);
			user_contacts[contact_index].add_status= true;

			return {...state, event_users: event_users, user_contacts: user_contacts, event_contacts: event_contacts}
		}

		case ACTION_CONSTANTS.REMOVE_USER_IN_EVENT: {

		}
	}
	return state;
}
