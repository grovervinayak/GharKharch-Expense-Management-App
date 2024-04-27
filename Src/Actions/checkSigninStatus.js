import {ACTION_CONSTANTS}
 from "../Utils/Constants";
import axios from "axios";
import {CONSTANT_TYPES} from "../Core/ActionConstants";

export function checkSigninStatus(user) {
  return {
    type: ACTION_CONSTANTS.SIGNIN_STATUS,
    user
  }
}

export function checkRestoreToken(user) {
  return {
    type: ACTION_CONSTANTS.RESTORE_TOKEN,
    user
  }
}