import { has } from "lodash";
import numeral from "numeral";

export const formatFields = (data: any, field?: string, format?: string) => {
  let _data = data;

  if (field && has(_data, field)) {
    const fieldValue = _data[field];
    let fileValueType = Object.prototype.toString.call(fieldValue);

    console.log("fileValueType", fileValueType);

    if (fileValueType === "[object Array]") {
        const newArr = [];
        for (let key in fieldValue ) {
            newArr[key] = 
        }
        // _data[field] = formatFields(_data[field])
    }
  } else {
    let fileValueType = Object.prototype.toString.call(_data);

    // if (fileValueType === "[object Array]") {
    //     _data = formatFields(_data)
    // }
  }

  return _data;
};
