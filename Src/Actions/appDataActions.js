import {ACTION_CONSTANTS}
 from "../Utils/Constants";
import axios from "axios";
import {CONSTANT_TYPES} from "../Core/ActionConstants";

export function getEventData(event_item) {
  return {
    type: ACTION_CONSTANTS.GET_EVENT_DATA,
    event_item
  }
}

export function getExpectedCategoryData(user_data) {
  return {
    type: ACTION_CONSTANTS.GET_EXPECTED_CATEGORY_DATA,
    user_data
  }
}