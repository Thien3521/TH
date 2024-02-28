import React from "react";

const Modal = (props) => {
  const { title, onClose, children } = props;

  return (
    <div id="myModal" className="modal ">
      <div className="modal-content w-1/2">
        <div className="flex justify-between items-center">
          <p className="font-bold">{title}</p>
          <span onClick={onClose} className="close">
            &times;
          </span>
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
