import { FC } from "react";
import { Form, Select, Input, Checkbox, InputNumber, Row } from "antd";

const { Option } = Select;

interface DataSourceFormProps {
  passwordHasRequired?: boolean;
  sshPasswordHasRequired?: boolean;
}

export const DataSourceForm: FC<DataSourceFormProps> = ({
  passwordHasRequired = true,
  sshPasswordHasRequired = true,
}) => {
  return (
    <>
      <Form.Item
        name={["dataSource", "name"]}
        rules={[{ required: true, message: "请输入数据源名称" }]}
      >
        <Input placeholder="请输入数据源名称" />
      </Form.Item>

      <Form.Item
        name={["dataSource", "type"]}
        rules={[{ required: true, message: "请选择数据类型" }]}
      >
        <Select
          optionFilterProp="children"
          showSearch
          placeholder="请选择数据类型"
        >
          <Option value="MYSQL">MYSQL</Option>
          <Option value="POSTGRESQL">POSTGRESQL</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name={["dataSource", "host"]}
        rules={[{ required: true, message: "请输入主机名称" }]}
      >
        <Input placeholder="请输入主机名称" />
      </Form.Item>

      <Form.Item
        name={["dataSource", "port"]}
        rules={[{ required: true, message: "请输入端口号" }]}
      >
        <InputNumber style={{ width: "100%" }} placeholder="请输入端口号" />
      </Form.Item>

      <Form.Item
        name={["dataSource", "database"]}
        rules={[{ required: true, message: "请输入数据库名称" }]}
      >
        <Input placeholder="请输入数据库名称" />
      </Form.Item>

      <Form.Item
        name={["dataSource", "username"]}
        rules={[{ required: true, message: "请输入用户名" }]}
      >
        <Input placeholder="请输入用户名" />
      </Form.Item>

      <Form.Item
        name={["dataSource", "password"]}
        rules={[
          {
            required: passwordHasRequired ? true : false,
            message: "请输入密码",
          },
        ]}
      >
        <Input.Password visibilityToggle placeholder="请输入密码" />
      </Form.Item>

      <Form.Item name={["dataSource", "tags"]}>
        <Select allowClear mode="tags" placeholder="使用标签" />
      </Form.Item>

      <Row justify="center">
        <Form.Item valuePropName="checked" name={["dataSource", "sshEnabled"]}>
          <Checkbox>启用 ssh</Checkbox>
        </Form.Item>
      </Row>

      <Form.Item noStyle shouldUpdate>
        {({ getFieldValue }) => {
          const sshEnabled = getFieldValue(["dataSource", "sshEnabled"]);

          if (sshEnabled) {
            return (
              <>
                <Form.Item
                  name={["dataSource", "sshHost"]}
                  rules={[{ required: true, message: "请输入 ssh 主机" }]}
                >
                  <Input placeholder="请输入 ssh 主机" />
                </Form.Item>

                <Form.Item
                  name={["dataSource", "sshPort"]}
                  rules={[{ required: true, message: "请输入 ssh 端口号" }]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="请输入 ssh 端口号"
                  />
                </Form.Item>

                <Form.Item
                  name={["dataSource", "sshUsername"]}
                  rules={[{ required: true, message: "请输入 ssh 用户名" }]}
                >
                  <Input placeholder="请输入 ssh 用户名" />
                </Form.Item>

                <Form.Item
                  rules={[
                    {
                      required: sshPasswordHasRequired ? true : false,
                      message: "请输入 ssh 密码",
                    },
                  ]}
                  name={["dataSource", "sshPassword"]}
                >
                  <Input.Password
                    visibilityToggle
                    name="dataSource.sshPassword"
                    placeholder="请输入 ssh 密码"
                  />
                </Form.Item>
              </>
            );
          }
        }}
      </Form.Item>
    </>
  );
};
