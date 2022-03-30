import { FC } from "react";
import numeral from "numeral";

import { CreatableSelect } from "chakra-react-select";
import moment from "moment";

interface FormatFieldFormProps {
  form: any;
}

const options = [
  { label: "无格式化", value: "" },
  { label: "10,000", value: "0,0", type: "numeral" },
  { label: "B,KB,MB...", value: "0b", type: "numeral" },
  { label: "B,KiB,MiB...", value: "0ib", type: "numeral" },
  { label: "percent", value: "0%", type: "numeral" },
  { label: "currency", value: "$0,0.00", type: "numeral" },
  { label: "秒", value: "ss", type: "moment" },
  { label: "分钟", value: "mm", type: "moment" },
  { label: "小时", value: "HH", type: "moment" },
];

const numeralList = options
  .filter((item) => item.type === "numeral")
  .map((item) => item.value);

const momentList = options
  .filter((item) => item.type === "moment")
  .map((item) => item.value);

export const getFormatValue = (value: any, format?: string) => {
  if (format) {
    if (numeralList.includes(format)) {
      return numeral(value).format(format);
    }

    if (momentList.includes(format)) {
      return moment(value).format(format);
    }
  }
  return numeral(value).value();
};

export const FormatFieldForm: FC<FormatFieldFormProps> = ({ form }) => {
  return (
    <CreatableSelect
      name="format"
      size="sm"
      value={form.values.format}
      onChange={(item) => {
        form.setFieldValue("format", { label: item.label, value: item.value });
      }}
      options={options?.map(({ label, value }) => ({
        label,
        value,
      }))}
    />
  );
};
