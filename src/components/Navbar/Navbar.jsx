import React, { useState } from "react";
import {
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  AppBar,
  Container,
  Toolbar,
  Box,
  Button,
  Tooltip,
  TextField,
  Link,
} from "@mui/material";

import logo from "@assets/images/arte-gallera-logo.png";
import { useDispatch, useSelector } from "react-redux";
import Modal from "@components/Modal/Modal";
import { styled } from "@mui/material/styles";
import api from "@services/api";
import { useEffect } from "react";
import { getUser } from "@redux/features/userSlice";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const disabledStyles = {
  "& .MuiOutlinedInput-root": {
    "&.Mui-disabled": {
      backgroundColor: "#f5f5f5",
      color: "#333",
      "& fieldset": {
        borderColor: "#333",
      },
    },
  },
  "& .MuiInputLabel-root": {
    "&.Mui-disabled": {
      color: "#333",
    },
  },
  "& .MuiInputBase-input": {
    color: "#bbb !important",
    opacity: 1,
    WebkitTextFillColor: "rgb(51, 51, 51) !important",
  },
};

const Navbar = ({ balance, user }) => {
  const dispatch = useDispatch();
  const [anchorElUser, setAnchorElUser] = useState(null);

  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [formData, setFormData] = useState({
    id: user?.id,
    first_name: user?.first_name,
    last_name: user?.last_name,
    username: user?.username,
    email: user?.email,
    is_active: true,
    image: user?.image,
  });

  useEffect(() => {
    setFormData({
      id: user?.id,
      first_name: user?.first_name,
      last_name: user?.last_name,
      username: user?.username,
      email: user?.email,
      is_active: true,
      image: user?.image,
    });

    setPreview(user?.image);
  }, [user]);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
  };

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(user?.image);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64 = reader.result;
        setPreview(base64);
        setSelectedFile(base64);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formDataWithImage = {
      ...formData,
      image: preview,
    };

    try {
      const response = await api.put("/user", formDataWithImage);
      if (response.data.success) {
        dispatch(getUser(user?.id));
      }
    } catch (error) {
      console.error("Error al cargar la imagen:", error);
    }
  };

  const settings = [
    {
      name: "Mi Cuenta",
      fn: () => {
        handleCloseUserMenu();
        setOpenEditModal(true);
      },
    },
    {
      name: "Recargar Saldo",
      fn: () => {
        handleCloseUserMenu();
        setOpenModal(true);
      },
    },
    {
      name: "Cerrar Sesión",
      fn: () => {
        window.location.href = "/";
        handleCloseUserMenu();
      },
    },
  ];

  return (
    <>
      <AppBar position="sticky" sx={{ bgcolor: "#333" }}>
        <Container maxWidth="xl">
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <img src={logo} alt="" width={50} height={45} />
              <Typography
                sx={{
                  display: { xs: "none", md: "block" },
                  fontSize: { xs: "1rem", md: "1.8rem" },
                  background:
                    "linear-gradient(90deg, #FFCC00 0%, #997A00 100%)",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                ARTE GALLERA
              </Typography>
            </Box>
            <Typography
              variant="h6"
              noWrap
              component="a"
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                display: { xs: "none", md: "flex" },
                fontWeight: 700,
                fontSize: ".7rem",
                letterSpacing: ".1rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              SALDO
              <Typography
                sx={{
                  color: "#FFCC00",
                  fontSize: {
                    sx: "1rem",
                    md: "1.3rem",
                  },
                }}
              >
                $ {balance} MXN
              </Typography>
            </Typography>

            <Typography
              variant="h5"
              noWrap
              component="a"
              sx={{
                display: "flex",
                flexDirection: "column",
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontSize: ".7rem",
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              SALDO
              <Typography
                sx={{
                  color: "#FFCC00",
                  fontSize: {
                    sx: "1rem",
                    md: "1.3rem",
                  },
                }}
              >
                $ {balance} MXN
              </Typography>
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", flexGrow: 0 }}>
              <Typography
                sx={{ display: { xs: "none", md: "block" }, mr: 1.5 }}
              >
                Hola, {user?.first_name?.toUpperCase()}
              </Typography>
              <Tooltip title="Abrir Menu">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt={user?.name?.toUpperCase()} src={user?.image} />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting.name} onClick={setting.fn}>
                    <Typography sx={{ textAlign: "center" }}>
                      {setting.name}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Modal
        open={openModal}
        close={handleCloseModal}
        link="https://wa.me/524591087015"
      >
        {" "}
        Hola, Para recargar comunícate por WhatsApp al numero{" "}
        <Link
          sx={{ color: "#4362a5", textDecoration: "none" }}
          href="https://wa.me/524591087015"
        >
          +52 1 459 108 7015
        </Link>{" "}
        o dando clic en el siguiente enlace donde recibiras tu recarga, usuario
        y contraseña
      </Modal>

      <Modal open={openEditModal} close={handleCloseEditModal}>
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton component="label" variant="rounded" color="white">
            <Avatar
              src={preview}
              alt="Vista previa"
              sx={{ width: 100, height: 100, mb: 2 }}
            />
            <VisuallyHiddenInput type="file" onChange={handleFileChange} />
          </IconButton>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={2}
          >
            <TextField
              label="Nombre"
              variant="outlined"
              value={`${user?.first_name} ${user?.last_name}`}
              disabled
              sx={disabledStyles}
              size="small"
              fullWidth
              InputLabelProps={{
                shrink: true, // Hace que el label se mantenga activo incluso cuando el campo tiene valor
              }}
            />
            <TextField
              label="Usuario"
              variant="outlined"
              value={user?.username}
              disabled
              sx={disabledStyles}
              size="small"
              fullWidth
              InputLabelProps={{
                shrink: true, // Hace que el label se mantenga activo incluso cuando el campo tiene valor
              }}
            />
            <TextField
              label="Correo electrónico"
              variant="outlined"
              value={user?.email}
              disabled
              sx={disabledStyles}
              size="small"
              fullWidth
              InputLabelProps={{
                shrink: true, // Hace que el label se mantenga activo incluso cuando el campo tiene valor
              }}
            />
          </Box>
        </Box>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          fullWidth
          mt={3}
          gap={1}
        >
          <Button
            type="button"
            onClick={handleUpload}
            variant="outlined"
            color=""
          >
            Guardar
          </Button>
          <Button
            variant="outlined"
            color=""
            type="button"
            onClick={handleCloseEditModal}
          >
            Cerrar
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default Navbar;
