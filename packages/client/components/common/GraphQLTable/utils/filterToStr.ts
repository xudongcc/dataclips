import { FilterProps } from "../GraphQLTable";

// 待完善
export const filterToStr = (filters: FilterProps) => {
  let filtersExpression = "";

  Object.entries(filters).forEach(([key, values]) => {
    if (key === "tags") {
      filtersExpression = `${key} = ${values[0]}`;
    }
  });

  return filtersExpression;
};
