export const getCorrectConstant = (suffix,type) => {
  if(type)
    return suffix+"_"+type;
  else
    return suffix;
};

export const CONSTANT_TYPES = {
  PENDING:"PENDING",
  REJECTED:"REJECTED",
  FULFILLED:"FULFILLED"
};