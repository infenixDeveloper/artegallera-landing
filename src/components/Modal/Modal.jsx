import logo from "@assets/images/arte-gallera-logo.png";

import "./Modal.css";

const Modal = ({ open, close, title, children, link }) => {
  const handleClose = () => {
    close(false);
  };

  const handleContainerClick = (e) => {
    e.stopPropagation();
  };

  return (
    <>
      <div
        className={`modal__overlay ${open ? "open" : ""}`}
        onClick={handleClose}
      >
        <div
          className={`modal__container ${open ? "open" : ""}`}
          onClick={handleContainerClick}
        >
          <button className="modal__btn-close" onClick={handleClose}>
            X
          </button>
          <div className="modal__header">
            <div className="modal__img-container">
              <img src={logo} alt="Arte Gallera" />
            </div>
            <h2>{title}</h2>
          </div>
          <div className="modal__body">
            <span className="modal__content">{children}</span>
            {link && (
              <a className="modal__link" href={link} target="_blank">
                {link}
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
