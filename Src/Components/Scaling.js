import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

//Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

const scale = size => width / guidelineBaseWidth * size;
const verticalScale = size => height / guidelineBaseHeight * size;
const moderateScale = (size, factor = 0.5) => size + ( scale(size) - size ) * factor;

const round = (number) => Math.round((number + Number.EPSILON) * 100) / 100;

const number_months=["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
const printDate = (actual_date) => actual_date.getDate()+"/"+number_months[actual_date.getMonth()]+"/"+actual_date.getFullYear();

const week_first_day = (expense_date, day) => new Date(expense_date).setDate(expense_date.getDate() - day+1);
const week_last_day = (first_day) => new Date(first_day).setDate(new Date(first_day).getDate()+6);
const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const week_document_name = (first_day) => new Date(first_day).getDate()+""+months[new Date(first_day).getMonth()]+""+new Date(first_day).getFullYear();
var week_first_date = (first_day) => new Date(first_day).getDate()+"-"+months[new Date(first_day).getMonth()];
var week_last_date = (last_day) => new Date(last_day).getDate()+"-"+months[new Date(last_day).getMonth()];

export {scale, verticalScale, moderateScale, round, printDate, week_first_day, week_last_day, week_document_name, week_first_date, week_last_date};