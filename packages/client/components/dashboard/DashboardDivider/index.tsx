import { FC } from "react";
import { Typography } from "antd";
import styled from "styled-components";
import { DeleteOutlined } from "@ant-design/icons";

const DividerWrapper = styled.div`
  margin: 12px 0;
  font-weight: bold;
  font-size: 20px;
  display: flex;
  align-items: center;
  white-space: nowrap;
  user-select: none;
`;

const DividerBeforeLine = styled.div<{ widthPercent: string }>`
  border-top: 1px solid transparent;
  border-top-color: inherit;
  width: ${(props) => props.widthPercent};
`;

const DividerAfterLine = styled(DividerBeforeLine)``;

const { Text } = Typography;

interface DashboardDividerProps {
  orientation?: "left" | "center" | "right";
  hasDelete?: boolean;
  onDelete?: () => void;
}

export const DashboardDivider: FC<DashboardDividerProps> = ({
  orientation = "left",
  children,
  hasDelete,
  onDelete,
}) => {
  const orientationWidth = [
    { orientation: "left", beforeWidth: "5%", afterWidth: "95%" },
    { orientation: "center", beforeWidth: "50%", afterWidth: "50%" },
    { orientation: "right", beforeWidth: "95%", afterWidth: "5%" },
  ].find((item) => item.orientation === orientation);

  return (
    <DividerWrapper className="drag-item">
      <DividerBeforeLine widthPercent={orientationWidth.beforeWidth} />

      {children && (
        <Text style={{ marginLeft: 16, marginRight: 16 }}>{children}</Text>
      )}

      <DividerAfterLine widthPercent={orientationWidth.afterWidth} />

      {hasDelete && (
        <div style={{ marginLeft: 16, marginRight: 16 }}>
          <DeleteOutlined
            onClick={() => {
              onDelete?.();
            }}
            style={{ color: "#718096", cursor: "pointer" }}
          />
        </div>
      )}
    </DividerWrapper>
  );
};
