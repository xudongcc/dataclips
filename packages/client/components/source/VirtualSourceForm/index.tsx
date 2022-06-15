import { FC, useMemo } from "react";
import { useClipConnectionQuery } from "../../../generated/graphql";
import { Select, Form, Input, Button, Row, Col } from "antd";
import { MinusOutlined } from "@ant-design/icons";

const { Option } = Select;

export const VirtualSourceForm: FC = () => {
  const { data } = useClipConnectionQuery({
    variables: { first: 250 },
    fetchPolicy: "no-cache",
  });

  const clipIds = useMemo(() => {
    if (data?.clipConnection.edges?.length) {
      return data.clipConnection.edges.map((item) => ({
        id: item.node.id,
        name: item.node.name,
      }));
    }

    return [];
  }, [data]);

  return (
    <>
      <Form.Item
        name={["virtualSource", "name"]}
        rules={[{ required: true, message: "请输入数据源名字" }]}
      >
        <Input placeholder="请输入数据源名字" />
      </Form.Item>

      <Form.Item name={["virtualSource", "tags"]}>
        <Select allowClear mode="tags" placeholder="使用标签" />
      </Form.Item>

      <Form.List name={["virtualSource", "tables"]}>
        {(fields, { add, remove }) => {
          return (
            <>
              {fields.map(({ key, name, ...restField }) => {
                return (
                  <Row key={key} gutter={8} wrap={false}>
                    <Col span={12}>
                      <Form.Item
                        name={[name, "name"]}
                        rules={[{ required: true, message: "请输入名字" }]}
                      >
                        <Input placeholder="请输入名字" />
                      </Form.Item>
                    </Col>
                    <Col flex={1}>
                      <Form.Item
                        name={[name, "clipId"]}
                        rules={[{ required: true, message: "请选择数据集" }]}
                      >
                        <Select
                          optionFilterProp="children"
                          showSearch
                          placeholder="请选择数据集"
                        >
                          {clipIds.map(({ id, name }) => (
                            <Option key={id} value={id}>
                              {name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col>
                      <Button
                        onClick={() => remove(name)}
                        icon={<MinusOutlined />}
                      />
                    </Col>
                  </Row>
                );
              })}

              <Button type="primary" onClick={() => add()}>
                添加配置项
              </Button>
            </>
          );
        }}
      </Form.List>
    </>
  );
};
