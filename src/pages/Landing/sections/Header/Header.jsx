import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import logo from "@assets/images/arte-gallera-logo.png";
import "./Header.css";
import Typography from "@components/Typography/Typography";
import LoginModal from "@components/Login/components/LoginModal/LoginModal";
import Modal from "@components/Modal/Modal";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PaidIcon from '@mui/icons-material/Paid';
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getPromotions } from "@redux/features/videosSlice";

const Header = ({ live }) => {
  const [scrolled, setScrolled] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openRecharge, setOpenRecharge] = useState(false);
  const [toggleMenu, setToggleMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // Inicialización

  const dispatch = useDispatch();
  const videos = useSelector(state => state.videos.videos);

  // Filtrar videos según si es móvil o no
  const filteredVideos = useMemo(() => {
    return videos.filter(video => video.is_event_video === true && video.is_movil_video === isMobile);
  }, [videos, isMobile]);

  // Detectar tamaño de ventana y actualizar el estado de isMobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Actualiza el estado según el tamaño de la ventana
    };

    // Añadir el event listener
    window.addEventListener("resize", handleResize);

    // Limpiar el event listener cuando el componente se desmonte
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Solo se ejecuta una vez al montar el componente

  useEffect(() => {
    dispatch(getPromotions());
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <header className="header">
        <nav className={scrolled ? "header__nav scrolled" : "header__nav"}>
          <button
            className={`header__nav-menu`}
            onClick={() => setToggleMenu((prev) => !prev)}
          >
            <MenuIcon sx={{ color: "white" }} /> Menu
          </button>

          <div className="header__nav-live desktop">
            <span className={live ? "circle-online" : "circle-offline"}></span>
            <p>{live ? "EN VIVO" : <span className="s1">Video <span className="2">Apagado</span></span>}</p>
          </div>

          <div
            className={`menu-overlay ${toggleMenu ? "open" : ""}`}
            onClick={() => setToggleMenu(false)}
          ></div>
          <ul className={toggleMenu ? "open" : ""}>
            <button
              onClick={() => setToggleMenu(false)}
              className="menu-btn-close"
            >
              <CloseIcon sx={{ color: "white" }} />
            </button>
            <li>
              <Link onClick={() => setOpenModal(true)}><AccountCircleIcon /> Iniciar Sesión</Link>
            </li>
            <li>
              <Link onClick={() => setOpenRecharge(true)}><PaidIcon /> Recargar Saldo</Link>
            </li>
            <li>
              <div className="header__nav-live mobile">
                <span className={live ? "circle-online" : "circle-offline"}></span>
                <p>{live ? "EN VIVO" : "Video Apagado"}</p>
              </div>
            </li>
          </ul>

          <picture className="header__logo-container">
            <img src={logo} alt="Arte Gallera Logo" />
            <p>arte gallera</p>
          </picture>
        </nav>

        <div className="header__content">
          {filteredVideos[0]?.file && (
            <video autoPlay loop muted playsInline >
              <source src={`/uploads/${filteredVideos[0]?.file}`} type="video/mp4" />
              Tu navegador no soporta videos.
            </video>
          )}
          <div className="header__overlay"></div>
          <div className="header__title"></div>

          <a href="#event">Proximos Eventos</a>
        </div>
      </header>

      <LoginModal open={openModal} close={setOpenModal} />

      <Modal
        title="Recarga ahora"
        link="https://wa.me/524591087015"
        open={openRecharge}
        close={setOpenRecharge}
      >
        Hola, Para recargar comunícate por WhatsApp al numero{" "}
        <a style={{ color: "#4362a5" }} href="https://wa.me/524591087015">
          +52 1 459 108 7015
        </a>{" "}
        o dando clic en el siguiente enlace donde recibiras tu recarga, usuario
        y contraseña
      </Modal>
    </>
  );
};

export default Header;
