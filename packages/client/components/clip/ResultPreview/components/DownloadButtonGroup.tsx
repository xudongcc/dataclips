import saveAs from "file-saver";
import { Button, Dropdown, Menu } from "antd";
import moment from "moment";
import { FC, useCallback } from "react";
import { ResultFragment } from "../../../../generated/graphql";
import { VerticalAlignBottomOutlined } from "@ant-design/icons";

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
      let content: any;

      if (downloadType === DownloadType.ALL) {
        content = `/clips/${token}${extname}`;
      }

      if (downloadType === DownloadType.FILTER) {
        content = new Blob([JSON.stringify(result)], {
          type: [
            { extname: ".csv", type: "text/csv" },
            {
              extname: ".xlsx",
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            },
            { extname: ".json", type: "application/json" },
          ].find((item) => item.extname === extname)?.type,
        });
      }

      saveAs(content, `${moment().format("YYYYMMDD-HHmmss")}${extname}`);
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
    [handleDownload]
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
