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
      <dialog ref={modalRef} className="modal">
        <div className="modal-box">
          <button
            onClick={closeModal}
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          >
            ✕
          </button>
          <h3 className="font-bold text-lg">{title}</h3>
          <p className="py-4">{content}</p>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={closeModal}>Close</button>
        </form>
      </dialog>
    </>
  );
};

export default Modal;