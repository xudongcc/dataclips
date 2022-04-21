import saveAs from "file-saver";
import { Button, Dropdown, Menu } from "antd";
import moment from "moment";
import { FC, useCallback } from "react";
import { ResultFragment } from "../../../../generated/graphql";
import { VerticalAlignBottomOutlined } from "@ant-design/icons";
import * as xlsx from "xlsx";

enum DownloadType {
  ALL = "all",
  FILTER = "filter",
}
export interface DownloadButtonGroupProps {
  token: string;
  result: ResultFragment;
}

export const DownloadButtonGroup: FC<DownloadButtonGroupProps> = ({
  token,
  result,
}) => {
  const handleDownload = useCallback(
    (extname: string, downloadType: DownloadType) => {
      if (downloadType === DownloadType.ALL) {
        saveAs(
          `/clips/${token}${extname}`,
          `${moment().format("YYYYMMDD-HHmmss")}${extname}`
        );
      }

      if (downloadType === DownloadType.FILTER) {
        if ([".json"].includes(extname)) {
          saveAs(
            new Blob([JSON.stringify(result)], {
              type: "application/json",
            }),
            `${moment().format("YYYYMMDD-HHmmss")}${extname}`
          );
        }

        if ([".csv", ".xlsx"].includes(extname)) {
          xlsx.writeFile(
            {
              Sheets: {
                Sheet1: xlsx.utils.aoa_to_sheet([
                  result.fields,
                  ...result.values,
                ]),
              },
              SheetNames: ["Sheet1"],
            },
            `${moment().format("YYYYMMDD-HHmmss")}${extname}`
          );
        }
      }
    },
    [token, result]
  );

  const getDownloadButton = useCallback(
    (btnText: string, extname: string) => {
      return (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item
                onClick={() => {
                  handleDownload(extname, DownloadType.ALL);
                }}
              >
                全部数据
              </Menu.Item>
              <Menu.Item
                disabled={!result?.fields?.length && !result?.values?.length}
                onClick={() => {
                  handleDownload(extname, DownloadType.FILTER);
                }}
              >
                过滤数据
              </Menu.Item>
            </Menu>
          }
          trigger={["click"]}
          placement="bottomRight"
        >
          <Button icon={<VerticalAlignBottomOutlined />}>{btnText}</Button>
        </Dropdown>
      );
    },
    [handleDownload, result?.fields?.length, result?.values?.length]
  );

  return (
    <Button.Group>
      {[
        { btnText: "CSV", extname: ".csv" },
        { btnText: "XLSX", extname: ".xlsx" },
        { btnText: "JSON", extname: ".json" },
      ].map((item) => getDownloadButton(item.btnText, item.extname))}
    </Button.Group>
  );
};
