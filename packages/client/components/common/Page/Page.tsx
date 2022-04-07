import { omit } from "lodash";
import { FC } from "react";
import {
  Layout,
  Row,
  Col,
  Typography,
  Button,
  ButtonProps as BaseButtonProps,
  Space,
} from "antd";

const { Title, Text } = Typography;

interface ButtonProps extends BaseButtonProps {
  text?: React.ReactNode;
}

interface PageProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  primaryAction?: ButtonProps;
  secondaryActions?: ButtonProps[];
}

export const Page: FC<PageProps> = ({
  children,
  title,
  description,
  primaryAction,
  secondaryActions,
}) => {
  return (
    <Layout>
      <Row
        justify="space-between"
        gutter={[8, 8]}
        align="middle"
        style={{ marginBottom: 24 }}
      >
        <Col>
          <Title style={{ marginBottom: 0 }} level={2}>
            {title}
          </Title>

          {description && <Text type="secondary">{description}</Text>}
        </Col>

        <Col>
          <Space wrap>
            {secondaryActions?.length &&
              secondaryActions.map((secondaryAction, index) => (
                <Button
                  key={index}
                  size="large"
                  {...omit(secondaryAction, "text")}
                >
                  {secondaryAction.text}
                </Button>
              ))}

            {primaryAction && (
              <Button
                size="large"
                type="primary"
                {...omit(primaryAction, "text")}
              >
                {primaryAction?.text}
              </Button>
            )}
          </Space>
        </Col>
      </Row>

      {children}
    </Layout>
  );
};
