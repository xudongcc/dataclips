import { SimpleColumnType } from "../../SimpleTable";

import { FilterType } from "../types/FilterType";

export interface GraphQLTableColumnType<T> extends SimpleColumnType<T> {
  filterType?: FilterType;
}
