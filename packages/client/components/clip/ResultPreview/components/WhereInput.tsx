import { Input, InputGroup, InputLeftAddon } from "@chakra-ui/react";
import { FC, useState } from "react";

export interface WhereInputProps {
  value: string;
  onEnter: (value: string) => void;
}

export const WhereInput: FC<WhereInputProps> = ({ value, onEnter }) => {
  const [where, setWhere] = useState<string>(value);

  return (
    <InputGroup>
      <InputLeftAddon>WHERE</InputLeftAddon>
      <Input
        defaultValue={where}
        onChange={(event) => setWhere(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            onEnter(where);
          }
        }}
      />
    </InputGroup>
  );
};
