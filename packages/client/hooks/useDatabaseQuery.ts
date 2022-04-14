/* eslint-disable import/no-unresolved */
import { useCallback } from "react";
import initSqlJs from "sql.js";

export interface DatabaseQueryResult {
  fields: string[];
  values: (number | string | null)[][];
}

export const useDatabaseQuery = () => {
  return useCallback(
    async (
      fields: DatabaseQueryResult["fields"],
      values: DatabaseQueryResult["values"],
      sql: string
    ): Promise<DatabaseQueryResult> => {
      const SQL = await initSqlJs({
        locateFile: () => `/sql-wasm.wasm`,
      });
      const db = new SQL.Database();

      // 删除表
      db.run(/* SQL */ `DROP TABLE IF EXISTS preview;`);

      if (fields.length === 0 || values.length === 0) {
        return { fields, values };
      }

      // 创建表
      db.run(
        /* SQL */ `CREATE TABLE preview (${fields
          .map((field) => `\`${field}\``)
          .join(",")});`
      );

      // 插入数据
      db.run(
        `INSERT INTO preview VALUES ${values
          .map(
            (value) =>
              `(${value
                .map((val) => {
                  if (val === null) {
                    return "null";
                  }

                  switch (typeof val) {
                    case "number":
                      return val;
                    default:
                      return `'${val}'`;
                  }
                })
                .join(",")})`
          )
          .join(",")};`
      );

      const [queryExecResult] = db.exec(sql);

      if (!queryExecResult) {
        return {
          fields: [],
          values: [],
        };
      }

      return {
        fields: queryExecResult.columns,
        values: queryExecResult.values as DatabaseQueryResult["values"],
      };
    },
    []
  );
};
