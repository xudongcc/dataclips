import {
  Button,
  ButtonProps as BaseButtonProps,
  Card as BaseCard,
  CardProps as BaseCardProps,
  Space,
} from "antd";
import { omit } from "lodash";
import { FC, ReactNode, useCallback } from "react";

interface ButtonProps extends BaseButtonProps {
  text?: ReactNode;
}

export interface CardProps extends BaseCardProps {
  description?: string;
  primaryAction?: ButtonProps;
  secondaryActions?: ButtonProps[];
}

export const Card: FC<CardProps> = (props) => {
  const {
    style,
    bodyStyle,
    headStyle,
    primaryAction,
    secondaryActions,
    extra,
    ...rest
  } = props;

  const getActionButtons = useCallback(() => {
    if (!extra && (primaryAction || secondaryActions)) {
      return (
        <Space wrap>
          {secondaryActions &&
            secondaryActions?.length &&
            secondaryActions.map((secondaryAction, index) => (
              <Button key={index} {...omit(secondaryAction, "text")}>
                {secondaryAction?.text}
              </Button>
            ))}

          {primaryAction && (
            <Button type="primary" {...omit(primaryAction, "text")}>
              {primaryAction?.text}
            </Button>
          )}
        </Space>
      );
    }

    return <></>;
  }, [extra, primaryAction, secondaryActions]);

  return (
    <BaseCard
      extra={extra ? extra : getActionButtons()}
      style={{ height: "inherit", ...style }}
      headStyle={{ borderBottom: 0, ...headStyle }}
      bodyStyle={{ height: "inherit", ...bodyStyle }}
      {...rest}
    />
  );
};
