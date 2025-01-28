import React from "react";
import "./Modal2.css";

const Modal2 = ({ open, close, title, children, ...props }) => {
  const handleClose = () => {
    close(false);
  };

  return (
    <>
      <div
        className={`modal2__overlay ${open ? "active" : ""}`}
        onClick={handleClose}
      >
        <div className="modal2__container" onClick={(e) => e.stopPropagation()}>
          <button className="modal2__btn-close" onClick={() => close(false)}>
            X
          </button>
          <div className="modal2__header">
            <h2>{title}</h2>
          </div>
          <div className="modal2__body">
            <span className="modal2__content">{children}</span>
          </div>
          <div className="modal2__footer">
            <buton onClick={props.handleBet} className="modal2__btn-footer">
              Aceptar
            </buton>
            <buton onClick={handleClose} className="modal2__btn-footer">
              Cerrar
            </buton>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal2;
