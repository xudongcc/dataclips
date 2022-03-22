import {
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
        ></Input>
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
        ></Input>
        <FormErrorMessage>请输入主机名称</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!form.errors.dataSource?.port}>
        <NumberInput name="dataSource.port" value={form.values.dataSource.port}>
          <NumberInputField
            onChange={form.handleChange}
            type="number"
            placeholder="请输入端口号"
          />
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
        ></Input>
        <FormErrorMessage>请输入数据库名称</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!form.errors.dataSource?.username}>
        <Input
          name="dataSource.username"
          value={form.values.dataSource.username}
          onChange={form.handleChange}
          placeholder="请输入用户名"
        ></Input>
        <FormErrorMessage>请输入用户名</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!form.errors.dataSource?.password}>
        <Input
          type="password"
          name="dataSource.password"
          value={form.values.dataSource.password}
          onChange={form.handleChange}
          placeholder="请输入密码"
        ></Input>
        <FormErrorMessage>请输入密码</FormErrorMessage>
      </FormControl>
    </>
  );
};
