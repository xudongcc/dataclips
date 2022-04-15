import { Card, CardProps } from "antd";
import { FC } from "react";

interface AntdCardProps extends CardProps {}

export const AntdCard: FC<AntdCardProps> = (props) => {
  const { ...rest } = props;
  return <Card headStyle={{ borderBottom: 0 }} size="small" {...rest}></Card>;
};
