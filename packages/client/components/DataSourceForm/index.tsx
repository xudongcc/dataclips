import {
  Checkbox,
  FormControl,
  FormErrorMessage,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
} from "@chakra-ui/react";
import { FC } from "react";

interface DataSourceFormProps {
  form: any;
}

export const DataSourceForm: FC<DataSourceFormProps> = ({ form }) => {
  return (
    <>
      <FormControl isInvalid={!!form.errors.dataSource?.name}>
        <Input
          name="dataSource.name"
          value={form.values.dataSource.name}
          onChange={form.handleChange}
          placeholder="请输入数据源名称"
        />
        <FormErrorMessage>请输入数据源名称</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!form.errors.dataSource?.type}>
        <Select
          name="dataSource.type"
          value={form.values.dataSource.type}
          onChange={form.handleChange}
          placeholder="请选择数据类型"
        >
          <option value="MYSQL">MYSQL</option>
          <option value="POSTGRESQL">POSTGRESQL</option>
        </Select>

        <FormErrorMessage>请选择数据类型</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!form.errors.dataSource?.host}>
        <Input
          name="dataSource.host"
          value={form.values.dataSource.host}
          onChange={form.handleChange}
          placeholder="请输入主机名称"
        />
        <FormErrorMessage>请输入主机名称</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!form.errors.dataSource?.port}>
        <NumberInput
          value={form.values.dataSource.port}
          onChange={(value) => {
            form.setFieldValue("dataSource.port", +value);
          }}
          name="dataSource.port"
        >
          <NumberInputField type="number" placeholder="请输入端口号" />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <FormErrorMessage>请输入端口号</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!form.errors.dataSource?.database}>
        <Input
          name="dataSource.database"
          value={form.values.dataSource.database}
          onChange={form.handleChange}
          placeholder="请输入数据库名称"
        />
        <FormErrorMessage>请输入数据库名称</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!form.errors.dataSource?.username}>
        <Input
          name="dataSource.username"
          value={form.values.dataSource.username}
          onChange={form.handleChange}
          placeholder="请输入用户名"
        />
        <FormErrorMessage>请输入用户名</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!form.errors.dataSource?.password}>
        <Input
          type="password"
          name="dataSource.password"
          value={form.values.dataSource.password}
          onChange={form.handleChange}
          placeholder="请输入密码"
        />
        <FormErrorMessage>请输入密码</FormErrorMessage>
      </FormControl>

      <Checkbox
        name="dataSource.sshEnabled"
        isChecked={form.values.dataSource.sshEnabled}
        onChange={form.handleChange}
      >
        启用 ssh
      </Checkbox>

      {form.values.dataSource.sshEnabled && (
        <>
          <FormControl isInvalid={!!form.errors.dataSource?.sshHost}>
            <Input
              name="dataSource.sshHost"
              value={form.values.dataSource.sshHost}
              onChange={form.handleChange}
              placeholder="请输入 ssh 主机"
            />
            <FormErrorMessage>请输入 ssh 主机</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!form.errors.dataSource?.sshPort}>
            <NumberInput
              w="100%"
              name="dataSource.sshPort"
              value={form.values.dataSource.sshPort}
              onChange={(value) => {
                form.setFieldValue("dataSource.sshPort", +value);
              }}
            >
              <NumberInputField type="number" placeholder="请输入 ssh 端口号" />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <FormErrorMessage>请输入 ssh 端口号</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!form.errors.dataSource?.sshUsername}>
            <Input
              name="dataSource.sshUsername"
              value={form.values.dataSource.sshUsername}
              onChange={form.handleChange}
              placeholder="请输入 ssh 用户名"
            />
            <FormErrorMessage>请输入 ssh 用户名</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!form.errors.dataSource?.sshPassword}>
            <Input
              type="password"
              name="dataSource.sshPassword"
              value={form.values.dataSource.sshPassword}
              onChange={form.handleChange}
              placeholder="请输入 ssh 密码"
            />
            <FormErrorMessage>请输入 ssh 密码</FormErrorMessage>
          </FormControl>
        </>
      )}
    </>
  );
};
