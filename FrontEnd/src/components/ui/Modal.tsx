import { ModalProps } from "../../../lib/types/props/ModalProps";

const Modal: React.FC<ModalProps> = ({
  modalIsVisible,
  setModalVisibility,
  children,
}) => {
  return (
    <>
      {modalIsVisible && (
        <div className="fixed inset-0 z-50 flex justify-center items-center">
          <div
            onClick={() => {
              setModalVisibility(false);
            }}
            className="fixed inset-0 bg-black/20"
          ></div>
          <div
            onClick={(e) => e.stopPropagation()}
            className={`
              z-50 bg-white rounded-xl shadow p-6 pb-32 transition-all
              ${
                modalIsVisible ? "scale-100 opacity-100" : "scale-125 opacity-0"
              }
            `}
          >
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
