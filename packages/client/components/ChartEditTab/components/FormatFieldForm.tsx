import { FC } from "react";
import numeral from "numeral";

import { CreatableSelect } from "chakra-react-select";
import moment from "moment";
import { formatSecondToStr } from "../../../utils/formatSecondToStr";
import { ChartType } from "../../../generated/graphql";

const chartTypeToFormFieldMap = {
  [ChartType.FUNNEL]: "funnelConfig",
  [ChartType.LINE]: "lineConfig",
  [ChartType.BAR]: "barConfig",
  [ChartType.METRIC]: "metricConfig",
  [ChartType.PIE]: "pieConfig",
};

interface FormatFieldFormProps {
  form: any;
}

enum FormatType {
  NUMERAL = "NUMERAL",
  MOMENT = "MOMENT",
  DURATION = "DURATION",
}

const options = [
  { label: "无格式化", value: "" },
  { label: "10,000", value: "0,0", type: FormatType.NUMERAL },
  { label: "B,KB,MB...", value: "0b", type: FormatType.NUMERAL },
  { label: "B,KiB,MiB...", value: "0ib", type: FormatType.NUMERAL },
  { label: "秒", value: "seconds", type: FormatType.DURATION },
  { label: "百分比", value: "0%", type: FormatType.NUMERAL },
  { label: "百分比（保留两位小数）", value: "0.00%", type: FormatType.NUMERAL },
  { label: "年-月-日", value: "YYYY-MM-DD", type: FormatType.MOMENT },
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

    if (format === "seconds") {
      return formatSecondToStr(value);
    }

    return numeral(value).format(format) || value;
  }

  return numeral(value).value() || value;
};

export const FormatFieldForm: FC<FormatFieldFormProps> = ({ form }) => {
  const nameField = `${chartTypeToFormFieldMap[form.values.type]}`;

  return (
    <CreatableSelect
      instanceId="format-field-select"
      size="sm"
      value={
        options.find((option) => {
          return option.value === (form.values[nameField]?.format || "");
        }) || {
          label: form.values[nameField]?.format,
          value: form.values[nameField]?.format,
        }
      }
      onChange={(item) => {
        form.setFieldValue(`${nameField}.format`, item.value);
      }}
      options={options?.map(({ label, value }) => ({
        label,
        value,
      }))}
    />
  );
};
