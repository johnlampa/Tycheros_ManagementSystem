import { ModalProps } from "../../../lib/types/ModalProps";

const Modal: React.FC<ModalProps> = ({
  productModalIsVisible,
  setProductModalVisibility,
  children,
  modalTitle,
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
                bg-white rounded-xl shadow p-6 transition-all
                ${
                  productModalIsVisible
                    ? "scale-100 opacity-100"
                    : "scale-125 opacity-0"
                }
                `}
      >
        <h1 className="text-black dark:text-black flex justify-center items-center">
          {modalTitle}
        </h1>
        <button
          onClick={() => {
            setProductModalVisibility(false);
          }}
          className="absolute bottom-2 right-2 px-2 py-1 rounded-lg border border-black text-gray-400 bg-white hover:bg-gray-50 hover:text-gray-600"
        >
          Cancel
        </button>
        {children}
      </div>
    </>
  );
};

export default Modal;
