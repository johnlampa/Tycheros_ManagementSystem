import { ModalProps } from "../../../lib/types/ModalProps";

const Modal: React.FC<ModalProps> = ({
  productModalIsVisible,
  setProductModalVisibility,
  children,
}) => {
  return (
    <>
      <div
        onClick={() => {
          setProductModalVisibility(false);
        }}
        className={`
                    fixed inset-0 flex justify-center items-center transition-colors
                    ${
                      productModalIsVisible
                        ? "visible bg-black/20"
                        : "invisible"
                    }
                `}
      ></div>
      <div
        onClick={(e) => e.stopPropagation()}
        className={`
                bg-white rounded-xl shadow p-6 pb-32 transition-all
                ${
                  productModalIsVisible
                    ? "scale-100 opacity-100"
                    : "scale-125 opacity-0"
                }
                `}
      >
        {children}
      </div>
    </>
  );
};

export default Modal;
