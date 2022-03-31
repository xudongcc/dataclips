import { FC } from "react";
import numeral from "numeral";

import { CreatableSelect } from "chakra-react-select";
import moment from "moment";

interface FormatFieldFormProps {
  form: any;
}

enum FormatType {
  NUMERAL = "NUMERAL",
  MOMENT = "MOMENT",
}

const options = [
  { label: "无格式化", value: "" },
  { label: "10,000", value: "0,0", type: FormatType.NUMERAL },
  { label: "B,KB,MB...", value: "0b", type: FormatType.NUMERAL },
  { label: "B,KiB,MiB...", value: "0ib", type: FormatType.NUMERAL },
  { label: "百分比", value: "0%", type: FormatType.NUMERAL },
  { label: "百分比（保留两位小数）", value: "0.00%", type: FormatType.NUMERAL },
  { label: "年-月-日", value: "YYYY-MM-DD", type: FormatType.MOMENT },
  { label: "时:分:秒", value: "HH:mm:ss", type: FormatType.MOMENT },
  {
    label: "年-月-日 时:分:秒",
    value: "YYYY-MM-DD HH:mm:ss",
    type: FormatType.MOMENT,
  },
];

const momentFormatList = options
  .filter((item) => item.type === FormatType.MOMENT)
  .map((item) => item.value);

export const getFormatValue = (value: any, format?: string) => {
  if (format) {
    if (momentFormatList.includes(format)) {
      return moment(value).format(format) || value;
    }

    return numeral(value).format(format) || value;
  }
  return numeral(value).value() || value;
};

export const FormatFieldForm: FC<FormatFieldFormProps> = ({ form }) => {
  return (
    <CreatableSelect
      name="format"
      size="sm"
      value={
        options.find(
          (option) => option.value === (form.values.format || "")
        ) || { label: form.values.format, value: form.values.format }
      }
      onChange={(item) => {
        form.setFieldValue("format", item.value);
      }}
      options={options?.map(({ label, value }) => ({
        label,
        value,
      }))}
    />
  );
};
