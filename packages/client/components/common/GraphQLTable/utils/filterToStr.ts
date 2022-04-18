import { FilterProps } from "../GraphQLTable";

// 待完善，现在只支持将 tags 进行 filter 转换
export const filterToStr = (filters: FilterProps) => {
  let filtersExpression = "";

  Object.entries(filters).forEach(([key, values]) => {
    if (key === "tags") {
      if (values.length) {
        values.forEach((value) => {
          if (!filtersExpression) {
            filtersExpression += `${key} = ${value}`;
          } else {
            filtersExpression += ` AND ${key} = ${value}`;
          }
        });
      }
    }
  });

  return filtersExpression;
};
