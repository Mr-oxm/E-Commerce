import React, { useRef } from 'react';

const Modal = ({ title, content, className="" }) => {
  const modalRef = useRef(null);

  const openModal = () => {
    modalRef.current.showModal();
  };

  const closeModal = () => {
    modalRef.current.close();
  };

  return (
    <>
      <button onClick={openModal} className={className}>
        {title}
      </button>
      <dialog ref={modalRef} className="modal flex justify-center items-center">
        <div className="modal-box">
          <div
            onClick={closeModal}
            role="button"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          >
            ✕
          </div>
          <h3 className="font-bold text-lg">{title}</h3>
          <div className="py-4">{content}</div>
        </div>
        {/* <form method="dialog" className="modal-backdrop">
          <button onClick={closeModal}>Close</button>
        </form> */}
      </dialog>
    </>
  );
};

export default Modal;