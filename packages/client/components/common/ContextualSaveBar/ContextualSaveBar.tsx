import React, { FC, useEffect } from "react";
// import { Prompt, useHistory } from "react-router";
// import { useNavigate } from "react-router";
import { useRouter } from "next/router";
import { Modal } from "../Modal";
import { Box, FlexProps, Flex } from "@chakra-ui/react";
// import { ConfigContext } from "../config-provider";
import useContextualSaveBarState from "./useContextualSaveBarState";
import { Button, ButtonProps, Space } from "antd";
import ReactRouterPrompt from "../ReactRouterPrompt";

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

export interface ContextualSaveBarProps extends FlexProps {
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
  logo,
  title,
  okText,
  okButtonProps,
  cancelText,
  cancelButtonProps,
  cancelConfirmModal,
  leaveConfirmModal,
  onOK,
  onCancel,
  onLeave,
  ...rest
}) => {
  const router = useRouter();

  //   const {
  //     locale: { ContextualSaveBar: locale } = {
  //       ContextualSaveBar: defaultLocale.ContextualSaveBar,
  //     },
  //     logo: globalLogo,
  //   } = React.useContext(ConfigContext);

  const [visible, setVisible] = useContextualSaveBarState();

  console.log("visible", visible);

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

  const handleLeaveConfirm = (pathname: string) =>
    Modal.confirm({
      title: leaveConfirmModal?.title || "放弃所有未保存的更改",
      content:
        leaveConfirmModal?.content ||
        "如果放弃更改，您将删除自上次保存以来所做的所有编辑。",
      okText: leaveConfirmModal?.okText || "放弃更改",
      okButtonProps: {
        danger: true,
        ...leaveConfirmModal?.okButtonProps,
      },
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

  return visible ? (
    <Flex
      pos="fixed"
      top={0}
      left={0}
      zIndex={999999}
      align="center"
      justify="space-between"
      w="100%"
      h="56px"
      bg="rgb(32, 33, 35)"
      boxShadow="0 2px 4px rgba(0, 0, 0, 0.1)"
      {...rest}
    >
      <Box
        display={{ base: "none", md: "flex" }}
        p="0 16px"
        color="#fff"
        w={{ md: "240px" }}
      >
        {logo}
      </Box>
      <Flex
        flex="1 1 auto"
        align="center"
        justify="space-between"
        maxW="5xl"
        m="0 auto"
        px={{ base: 4, sm: 5, lg: 8 }}
      >
        <Box color="#fff" fontWeight={600} fontSize="16px">
          {title}
        </Box>
        {/* <Space size={12}>
          <Button {...cancelButtonProps} onClick={() => handleCancelConfirm()}>
            {cancelText}
          </Button>
          <Button type="primary" {...okButtonProps} onClick={() => onOK?.()}>
            {okText}
          </Button>
        </Space> */}
      </Flex>
      <ReactRouterPrompt
        when={visible}
        // message={({ pathname, query }: any) => {
        //   if (Object.keys(query).length > 0) {
        //     handleLeaveConfirm(
        //       `${pathname}?${new URLSearchParams(query).toString()}`
        //     );
        //   } else {
        //     handleLeaveConfirm(pathname);
        //   }
        //   return false;
        // }}
      >
        {() => Modal.confirm({ title: "123" })}
      </ReactRouterPrompt>
    </Flex>
  ) : null;
};
