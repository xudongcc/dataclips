import { Modal as InternalModal } from "antd";
import OriginModal from "antd/lib/modal";
import {
  ModalStaticFunctions,
  modalGlobalConfig,
} from "antd/lib/modal/confirm";

type ModalType = typeof OriginModal &
  ModalStaticFunctions & {
    destroyAll: () => void;
    config: typeof modalGlobalConfig;
  };

export const Modal: ModalType = ({
  children,
  maskClosable,
  okText,
  cancelText,
  ...props
}) => (
  <InternalModal
    okText={okText || "确定"}
    cancelText={cancelText || "取消"}
    {...props}
    maskClosable={maskClosable || false}
  >
    {children}
  </InternalModal>
);

Modal.confirm = InternalModal.confirm;
Modal.success = InternalModal.success;
Modal.warning = InternalModal.warning;
Modal.error = InternalModal.error;
Modal.info = InternalModal.info;
Modal.warn = InternalModal.warn;
Modal.destroyAll = InternalModal.destroyAll;
Modal.useModal = InternalModal.useModal;
Modal.config = InternalModal.config;
