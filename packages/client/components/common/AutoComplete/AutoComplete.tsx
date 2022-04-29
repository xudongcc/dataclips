import { AutoComplete as BaseAutoComplete, AutoCompleteProps } from "antd";
import { BaseOptionType } from "antd/lib/select";
import { FC, useMemo } from "react";

// 此 AutoComplete 的作用只是为了将选中项的 value 正确传递给 form，然后 input 的显示值为 label 的值
export const AutoComplete: FC<AutoCompleteProps<any, BaseOptionType>> = (
  props
) => {
  const { onChange, onSelect, options, value, ...rest } = props;

  // onChange 传递给 form 值后，会更新自己的 value，再将自己的 value 转成我们想要显示的值即可
  const mapValue = useMemo(() => {
    const existOptionLabel = options.find(
      (option) => option.value === value
    )?.label;

    return existOptionLabel || value;
  }, [options, value]);

  return (
    <BaseAutoComplete
      value={mapValue}
      options={options}
      onSelect={(val, _option) => {
        onChange(val, _option);
      }}
      onChange={(val, _option) => {
        if (!val) {
          onChange(undefined, _option);
        } else {
          onChange(val, _option);
        }
      }}
      {...rest}
    />
  );
};
