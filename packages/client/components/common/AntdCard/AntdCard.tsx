import { Card, CardProps } from "antd";
import { FC } from "react";

interface AntdCardProps extends CardProps {}

export const AntdCard: FC<AntdCardProps> = (props) => {
  const { style, bodyStyle, headStyle, ...rest } = props;
  return (
    <Card
      style={{ height: "inherit", ...style }}
      headStyle={{ borderBottom: 0, ...headStyle }}
      bodyStyle={{ height: "inherit", ...bodyStyle }}
      {...rest}
    />
  );
};
