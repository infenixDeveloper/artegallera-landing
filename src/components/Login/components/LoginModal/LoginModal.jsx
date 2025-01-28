import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginModal.css";
import userIMG from "@assets/images/user-input.png";
import userLogo from "@assets/images/user.png";
import pass from "@assets/images/pass-icon.png";
import Modal from "@components/Modal/Modal";
import { useDispatch } from "react-redux";
import { login } from "@redux/features/authSlice";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import LoadingButton from "@mui/lab/LoadingButton";
import { Link } from "react-router-dom";

const LoginModal = ({ open, close }) => {
  const dispatch = useDispatch();
  const { error, isAuthenticated, status, user } = useSelector(
    (state) => state.auth
  );

  const [showPass, setShowPass] = useState(false);
  const [forgotPass, setForgotPass] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState("");
  const navigate = useNavigate();

  const handleShow = (e) => {
    setShowPass((prev) => e.target.checked && !prev);
  };

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  const handleOpen = () => {
    setForgotPass(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(() => {
      return {
        ...formData,
        [name]: value,
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  useEffect(() => {
    if (status === "succeeded" && user?.data?.token) {
      Cookies.set("access_token", user.data.token);
      Cookies.set(
        "data",
        JSON.stringify({
          id: user.data.user.id,
          first_name: user.data.user.first_name,
          last_name: user.data.user.last_name,
          email: user.data.user.email,
          username: user.data.user.username,
          balance: user.data.user.initial_balance,
        })
      );
      navigate("/panel");
    } else if (status === "failed") {
      console.error("Error al iniciar sesión:", error);
    }
  }, [status, user]);

  return (
    <>
      <div
        className={`login-modal__overlay ${open ? "open" : ""} `}
        onClick={() => close(false)}
      >
        <div
          className={`login-modal__container ${open ? "open" : ""} `}
          onClick={handleModalClick}
        >
          <button
            className="login-modal__btn-close"
            onClick={() => close(false)}
          >
            X
          </button>
          <div className="login-modal__user-logo">
            <img src={userLogo} alt="" className="login-modal__user-img" />
          </div>
          <h3>INICIAR SESIÓN</h3>

          <form className="login-modal__form" onSubmit={handleSubmit}>
            <label className="login-modal__label">
              <img src={userIMG} alt="" className="input-logo" />
              <input
                name="username"
                className="login-modal__form-input"
                type="text"
                placeholder="Usuario"
                onChange={handleChange}
              />
            </label>
            <label className="login-modal__label">
              <img src={pass} alt="" className="input-logo" />
              <input
                name="password"
                className="login-modal__form-input"
                type={showPass ? "text" : "password"}
                placeholder="Contraseña"
                onChange={handleChange}
              />
            </label>
            <div className="login-modal__check-container">
              <label onChange={handleShow} className="login-modal__check">
                <input type="checkbox" />
                Mostrar Contraseña
              </label>

              <a href="#" className="login-modal__link" onClick={handleOpen}>
                Olvide mi contraseña
              </a>
            </div>
            {error && <p className="login-modal__error">{error}</p>}{" "}
            <LoadingButton
              sx={{
                marginTop: "2rem",
                padding: "0.5rem",
                background: "linear-gradient(90deg, #b5a817 0%, #4f490a 100%);",
                color: "white",
                borderRadius: "0",
              }}
              type="submit"
              loading={status === "loading"}
            >
              Iniciar sesión
            </LoadingButton>
          </form>
        </div>
      </div>

      <Modal
        title="Recuperar contraseña"
        link="https://wa.me/524591087015"
        open={forgotPass}
        close={setForgotPass}
      >
        Para recuperar tu contraseña comunícate al numero <Link
          sx={{ color: "#4362a5", textDecoration: "none" }}
          href="https://wa.me/524591087015"
        >
          +52 1 459 108 7015
        </Link>{" "} o dando
        clic en el siguiente enlace...
      </Modal>
    </>
  );
};

export default LoginModal;
