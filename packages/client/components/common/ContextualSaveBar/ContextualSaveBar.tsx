import React, { FC, useEffect } from "react";
import { useRouter } from "next/router";
import { Modal } from "../Modal";
import useContextualSaveBarState from "./useContextualSaveBarState";
import { Button, ButtonProps, Col, Row, Space, Typography } from "antd";
import styled from "styled-components";

const { Title } = Typography;

const SaveBar = styled.div`
  display: flex;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  padding: 0 18px;
  z-index: 9999;
  align-items: center;
  justify-content: space-between;
  background-color: rgb(32, 33, 35);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

interface confirmModalType {
  /** 取消的二次确认标题 */
  title?: string;
  /** 取消的二次确认内容 */
  content?: string;
  /** 取消的二次确认的 ok 按钮文字 */
  okText?: string;
  /** 取消的二次确认的 cancel 按钮文字 */
  cancelText?: string;
  /** 取消的二次确认的 ok 按钮 props */
  okButtonProps?: ButtonProps;
  /** 取消的二次确认的 cancel 按钮 props */
  cancelButtonProps?: ButtonProps;
}

export interface ContextualSaveBarProps {
  /** 左上角区域 */
  logo?: React.ReactNode;
  /** 保存条中间显示的文字 */
  title?: string;
  /** 保存按钮文字 */
  okText?: string;
  /** 保存按钮属性 */
  okButtonProps?: ButtonProps;
  /** 取消按钮属性 */
  cancelButtonProps?: ButtonProps;
  /** 取消按钮文字 */
  cancelText?: string;
  /** 取消保存的二次确认 Modal 的属性 */
  cancelConfirmModal?: confirmModalType;
  /** 离开页面的二次确认 Modal 的属性 */
  leaveConfirmModal?: confirmModalType;
  /** 保存回调 */
  onOK?: () => void;
  /** 取消回调 */
  onCancel?: () => void;
  /** 当 visible 为 true 时，离开页面的回调，参数 path 为要跳转的路由 */
  onLeave?: (path: string) => void;
}

export const ContextualSaveBar: FC<ContextualSaveBarProps> = ({
  title,
  okText = "保存",
  okButtonProps,
  cancelText = "取消",
  cancelButtonProps,
  cancelConfirmModal,
  leaveConfirmModal,
  onOK,
  onCancel,
  onLeave,
}) => {
  const router = useRouter();

  const [visible, setVisible] = useContextualSaveBarState();

  const handleLeaveConfirm = (pathname: string) =>
    Modal.confirm({
      title: leaveConfirmModal?.title || "放弃所有未保存的更改",
      content:
        leaveConfirmModal?.content ||
        "如果退出此页面，任何未保存的更改都将丢失。",
      okText: leaveConfirmModal?.okText || "退出页面",
      okButtonProps: {
        danger: true,
        ...leaveConfirmModal?.okButtonProps,
      },
      cancelText: "取消",
      cancelButtonProps: leaveConfirmModal?.cancelButtonProps,
      onOk: () => {
        setVisible(false);
        setTimeout(() => {
          if (onLeave) {
            onLeave(pathname);
          } else {
            router.push(pathname);
          }
        });
      },
    });

  const handleCancelConfirm = () =>
    Modal.confirm({
      title: cancelConfirmModal?.title || "放弃所有未保存的更改",
      content:
        cancelConfirmModal?.content ||
        "如果放弃更改，您将删除自上次保存以来所做的所有编辑。",
      okText: cancelConfirmModal?.okText || "放弃更改",
      cancelText: cancelConfirmModal?.cancelText || "继续编辑",
      okButtonProps: {
        danger: true,
        ...cancelConfirmModal?.okButtonProps,
      },
      cancelButtonProps: cancelConfirmModal?.cancelButtonProps,
      onOk: () => {
        setVisible(false);
        if (onCancel) {
          setTimeout(onCancel);
        }
      },
    });

  // 页面卸载监听
  useEffect(() => {
    const listener = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = leaveConfirmModal?.content;
    };

    if (visible) {
      window.addEventListener("beforeunload", listener);
    }

    return () => {
      window.removeEventListener("beforeunload", listener);
    };
  }, [leaveConfirmModal?.content, visible]);

  // 编辑后监听路径发生变化
  useEffect(() => {
    const handleRouteChangeStart = (url) => {
      console.log("url", url);
      if (url && visible) {
        router.events.emit("routeChangeError", url);
        throw "routeChange aborted.";
      }
    };

    const handleRouteChangeError = (url) => {
      handleLeaveConfirm(url);
    };

    router.events.on("routeChangeStart", handleRouteChangeStart);

    router.events.on("routeChangeError", handleRouteChangeError);

    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);

      router.events.off("routeChangeError", handleRouteChangeError);
    };
  }, [visible, router]);

  return visible ? (
    <SaveBar>
      <Row style={{ width: "100%" }}>
        <Col
          span={24}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Title level={4} style={{ color: "#fff", marginBottom: 0 }}>
            {title || "未保存的更改"}
          </Title>
          <Space size={12}>
            <Button
              size="large"
              {...cancelButtonProps}
              onClick={() => handleCancelConfirm()}
            >
              {cancelText}
            </Button>
            <Button
              size="large"
              type="primary"
              {...okButtonProps}
              onClick={() => onOK?.()}
            >
              {okText}
            </Button>
          </Space>
        </Col>
      </Row>
    </SaveBar>
  ) : null;
};
