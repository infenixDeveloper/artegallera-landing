import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { io } from "socket.io-client";
import { getLastEvent } from "@redux/features/eventsSlice";
import "./Betting.css";
import { getUser } from "@redux/features/userSlice";
import {
  Alert,
  Box,
  IconButton,
  Snackbar,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import Slide from "@mui/material/Slide";
import CloseIcon from "@mui/icons-material/Close";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import sound from "@assets/sounds/cashier.mp3";
import Cookies from "js-cookie";
import Modal2 from "@components/Modal2/Modal2";
import { useSnackbar, closeSnackbar } from 'notistack';

function Betting({ balance, user, event }) {
  const socketRef = useRef(null);
  const dispatch = useDispatch();
  const userId = JSON.parse(Cookies.get("data")).id;
  const { enqueueSnackbar } = useSnackbar();
  const [betAmount, setBetAmount] = useState(0);
  const [betStatus, setBetStatus] = useState("");
  const [team, setTeam] = useState("");
  const [redBet, setRedBet] = useState(0);
  const [greenBet, setGreenBet] = useState(0);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isBettingActive, setIsBettingActive] = useState(null);
  const [roundId, setRoundId] = useState();
  const [rounds, setRounds] = useState([]);
  const [selectedRound, setSelectedRound] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    vertical: "top",
    horizontal: "center",
    bgColor: "",
    icon: false,
  });
  const [openModal, setOpenModal] = useState(false);
  const [userRedAmount, setUserRedAmount] = useState(0)
  const [userGreenAmount, setUserGreenAmount] = useState(0)
  const [amoutnCount, setAmoutnCount] = useState(0)

  const { vertical, horizontal, open } = snackbar;

  const quickBetAmounts = [
    100, 200, 300, 500, 1000, 2000, 3000, 5000, 10000, 20000,
  ];

  const cashier = new Audio(sound);

  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_API_URL_BETS);

    socketRef.current.on("connect", () => {
    });

    dispatch(getLastEvent());

    socketRef.current.on("newBet", (newBet) => {
      if (newBet.team === "red") {
        setRedBet((prev) => prev + newBet.amount);
      } else if (newBet.team === "green") {
        setGreenBet((prev) => prev + newBet.amount);
      }
    });

    socketRef.current.on("winner", (response) => {
      if (response.success) {
        setSnackbar({
          ...snackbar,
          open: true,
          message: response.message,
          bgColor: response.team,
          icon: <EmojiEventsIcon fontSize="small" />,
        });
        dispatch(getUser(userId));
        cashier.play().catch((err) => {
          console.error("Error al reproducir el sonido:", err);
        });
      }
    });

    socketRef.current.on("Statusbetting", (response) => {
      if (response.status === "accepted") {
        setBetStatus(response.status);
        setStatusMessage("");

        if (response.redBet.id_user === userId) {
          enqueueSnackbar(response.message, {
            variant: "success",
            anchorOrigin: {
              vertical: "top",
              horizontal: "center",
            },
            action: (key) => (
              <IconButton onClick={() => closeSnackbar(key)} style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}>
                <CloseIcon />
              </IconButton>
            ),
          });

          // setSnackbar({
          //   ...snackbar,
          //   open: true,
          //   message: response.message,
          //   bgColor: "success",
          // });

          setStatusMessage(response.message)
        } else if (response.greenBet.id_user === userId) {
          enqueueSnackbar(response.message, {
            variant: "success",
            anchorOrigin: {
              vertical: "top",
              horizontal: "center",
            },
            action: (key) => (
              <IconButton onClick={() => closeSnackbar(key)} style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}>
                <CloseIcon />
              </IconButton>
            ),
          });

          // setSnackbar({
          //   ...snackbar,
          //   open: true,
          //   message: response.message,
          //   bgColor: "success",
          // });

          setStatusMessage(response.message)
        }
      } else if (response.status === "rejected") {
        setBetStatus(response.status);
        setStatusMessage("");

        const newAmount =
          (response.greenBet.id_user === userId ? response.greenBet.amount : 0) +
          (response.redBet.id_user === userId ? response.redBet.amount : 0);


        if (response.redBet.id_user === userId) {
          setAmoutnCount(prev => {
            const updatedAmount = prev + newAmount;

            setSnackbar({
              ...snackbar,
              open: true,
              message: `Su Apuesta por $${updatedAmount} fue declinada`,
              bgColor: "error",
            });

            setStatusMessage(`Su Apuesta por $${updatedAmount} fue declinada`)
            return updatedAmount;
          });
          setUserGreenAmount((prev) => prev - response.greenBet.amount);
          setUserRedAmount((prev) => prev - response.redBet.amount);

        } else if (response.greenBet.id_user === userId) {
          setAmoutnCount(prev => {
            const updatedAmount = prev + newAmount;

            setSnackbar({
              ...snackbar,
              open: true,
              message: `Su Apuesta por $${updatedAmount} fue declinada`,
              bgColor: "error",
            });

            setStatusMessage(`Su Apuesta por $${updatedAmount} fue declinada`)
            return updatedAmount;
          });

          setUserGreenAmount((prev) => prev - response.greenBet.amount);
          setUserRedAmount((prev) => prev - response.redBet.amount);
        }
        setTimeout(() => {
          setAmoutnCount(0)
        }, 3000);
        dispatch(getUser(userId));
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [dispatch]);

  useEffect(() => {
    const idRound = localStorage.getItem("roundId")

    socketRef.current.emit(
      "user-amount",
      { id_user: userId, id_round: idRound },
      (response) => {
        if (response.success) {
          setUserGreenAmount(response.green)
          setUserRedAmount(response.red)
        } else {

        }
      }
    );

    socketRef.current.emit(
      "getRoundStatus",
      { id: roundId, id_event: event?.id },
      (response) => {
        if (response.success) {
          setIsBettingActive(
            response.data.round?.filter((r) => r.id === roundId)[0]
              .is_betting_active
          );

        } else {
          console.error(
            "Error al obtener el estado del evento:",
            response.message
          );
        }
      }
    );
  }, [roundId, isBettingActive, statusMessage])


  useEffect(() => {
    socketRef.current.on("getActiveRounds", (response) => {
      if (response.success) {
        const fetchedRounds = response.data;

        // Ordenar las rondas por su ID
        const sortedRounds = fetchedRounds.sort((a, b) => a.id - b.id);

        const activeRounds = sortedRounds.filter(
          (r) => r.is_betting_active === true
        );

        // Establecer las rondas en el estado
        setRounds(activeRounds); // Actualiza las rondas
      } else {
        console.error("Error al obtener las rondas:", response.message);
      }
    });

    if (rounds.length > 0) {
      // Establece la última ronda al cargar o cuando cambien las rondas
      const lastRound = rounds[rounds?.length - 1];
      setSelectedRound(rounds.length - 1); // Índice de la última ronda
      setRoundId(lastRound.id); // ID de la última ronda
      localStorage.setItem("roundId", lastRound.id);
    }
  }, [rounds]);

  useEffect(() => {
    socketRef.current.emit(
      "getAllActiveRounds",
      { id_event: event?.id },
      (response) => {
        if (response.success) {
          const fetchedRounds = response.data;

          // Ordenar las rondas por su ID
          const sortedRounds = fetchedRounds.sort((a, b) => a.id - b.id);

          const activeRounds = sortedRounds.filter(
            (r) => r.is_betting_active === true
          );

          // Establecer las rondas en el estado
          setRounds(activeRounds); // Actualiza las rondas
        } else {
          console.error("Error al obtener las rondas:", response.message);
        }
      }
    );
  }, [event]);

  useEffect(() => {
    socketRef.current.on("isBettingActive", (response) => {
      if (response.success) {
        response.data.id === roundId &&
          setIsBettingActive(response.data.is_betting_active);

        dispatch(getUser(userId));
        setStatusMessage("");
      }
    });
  }, [event, isBettingActive]);


  useEffect(() => {
    const idRound = localStorage.getItem("roundId");
    socketRef.current.emit(
      "getRoundStatus",
      { id: idRound, id_event: event?.id },
      (response) => {

        if (response.success) {
          setIsBettingActive(
            response.data.round?.filter((r) => r.id === roundId)[0]
              .is_betting_active
          );

        } else {
          console.error(
            "Error al obtener el estado del evento:",
            response.message
          );
        }
      }
    );
  }, [rounds, event, isBettingActive]);


  useEffect(() => {
    const idRound = localStorage.getItem("roundId");

    if (idRound) {
      socketRef.current.emit(
        "getBetStats",
        { id_event: event?.id, team: "red", id_round: idRound },
        (response) => {
          if (response.success) {
            setRedBet(response.totalAmount || 0);
          }
        }
      );

      socketRef.current.emit(
        "getBetStats",
        { id_event: event?.id, team: "green", id_round: idRound },
        (response) => {
          if (response.success) {
            setGreenBet(response.totalAmount || 0);
          }
        }
      );
    }

    if (roundId && !isBettingActive) {
      // Forzar la actualización de las apuestas al cerrar
      socketRef.current.emit(
        "getBetStats",
        { id_event: event?.id, id_round: roundId, team: "red" },
        (response) => {
          if (response.success) setRedBet(response.totalAmount || 0);
        }
      );

      socketRef.current.emit(
        "getBetStats",
        { id_event: event?.id, id_round: roundId, team: "green" },
        (response) => {
          if (response.success) setGreenBet(response.totalAmount || 0);
        }
      );
    }

    socketRef.current.emit(
      "getAllActiveRounds",
      { id_event: event?.id },
      (response) => {
        if (response.success) {
          const fetchedRounds = response.data;

          // Ordenar las rondas por su ID
          const sortedRounds = fetchedRounds.sort((a, b) => a.id - b.id);

          const activeRounds = sortedRounds.filter(
            (r) => r.is_betting_active === true
          );

          // Establecer las rondas en el estado
          setRounds(activeRounds); // Actualiza las rondas
        } else {
          console.error("Error al obtener las rondas:", response.message);
        }
      }
    );

  }, [event, redBet, greenBet, isBettingActive, betStatus, statusMessage]);

  useEffect

  const handleQuickBet = (amount) => {
    if (amount > balance) {
      setError("El saldo es insuficiente para esta apuesta.");
    } else {
      setBetAmount(amount);
      setError("");
    }
  };

  const handleInputChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    if (value > balance) {
      setError("El saldo es insuficiente para esta apuesta.");
    } else {
      setBetAmount(value);
      setError("");
    }
  };

  const handleAllIn = () => {
    setBetAmount(balance);
    setError("");
  };

  const handleOpenModal = (team) => {
    setTeam(team);
    setOpenModal(true);
  };

  const handleBet = () => {
    if (!isBettingActive) {
      setOpenModal(false);
      setSnackbar({
        ...snackbar,
        open: true,
        message: "Tu apuesta no entro en juego. Las apuestas ya estan cerradas",
      });
      return;
    }

    if (betAmount <= 0 || betAmount > balance) {
      setError("El monto de apuesta no es válido o el saldo es insuficiente.");
      return;
    }

    if (betAmount < 100 && balance >= 100) {
      setError("El saldo mínimo para apostar es de $100.");
      return;
    }

    const betData = {
      id_user: user.id,
      id_event: event?.id,
      amount: betAmount,
      team,
      id_round: roundId,
    };

    socketRef.current.emit("placeBet", betData, (response) => {
      if (response.success) {
        dispatch(getUser(user.id));
        setStatusMessage("Apuesta en proceso...");

        if (team === "red") {
          setUserRedAmount((prev) => prev + betAmount);
        } else if (team === "green") {
          setUserGreenAmount((prev) => prev + betAmount);
        }

      } else {
        setStatusMessage("Error al realizar la apuesta: " + response.message);
      }
    });

    setError("");
    setStatusMessage("");
    setOpenModal(false);
  };

  const handleTabChange = (event, newValue) => {
    setSelectedRound(newValue);
    const selectedRound = rounds[newValue];
    if (selectedRound) {
      setRoundId(selectedRound.id);
      localStorage.setItem("roundId", selectedRound.id);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const closeButton = (
    <IconButton
      size="small"
      aria-label="close"
      color="inherit"
      onClick={handleSnackbarClose}
    >
      <CloseIcon />
    </IconButton>
  );

  return (
    <div className="betting-app">
      {rounds.length > 0 && (
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            marginBottom: 2,
            width: "100%",
          }}
        >
          <Tabs
            value={selectedRound}
            onChange={handleTabChange}
            aria-label="Rondas"
            variant="scrollable"
            scrollButtons="auto"
            sx={{ width: { lg: "300px" } }}
          >
            {rounds?.map((round, index) => (
              <Tab label={`PELEA ${round.round}`} key={round.id} />
            ))}
          </Tabs>
        </Box>
      )}
      <div
        className="bet-status"
        style={{ backgroundColor: isBettingActive ? "green" : "red" }}
      >
        {isBettingActive ? "APUESTAS ABIERTAS" : "APUESTAS CERRADAS"}
      </div>

      {(
        userRedAmount > 0 || userGreenAmount > 0
      ) && (
          <div className="playing-total-amount">Estas Jugando al
            {userRedAmount > 0 && <p ><span className="total-red">ROJO: </span>{userRedAmount} </p>}
            {userGreenAmount > 0 && <p><span className="total-green">VERDE: </span>{userGreenAmount} </p>}
          </div>
        )}


      <div className="bets-container">
        <div className="bet-box red-bet">
          <h3>Apuesta al Rojo</h3>
          <p>${redBet}</p>
          <button
            onClick={() => handleOpenModal("red")}
            disabled={!isBettingActive}
          >
            Apostar al Rojo
          </button>
        </div>

        <div className="bet-box green-bet">
          <h3>Apuesta al Verde</h3>
          <p>${greenBet}</p>
          <button
            onClick={() => handleOpenModal("green")}
            disabled={!isBettingActive}
          >
            Apostar al Verde
          </button>
        </div>
      </div>

      {error && (
        <Typography sx={{ color: "white", mb: "1rem" }}>{error}</Typography>
      )}
      {statusMessage && (
        <Typography sx={{ color: "white", mb: "1rem" }}>
          {statusMessage}
        </Typography>
      )}

      <div className="playing-amount">
        <h3>JUGANDO</h3>
        <p>${betAmount.toFixed(2)}</p>
      </div>

      <div className="quick-bets-input-container">
        {/* <button onClick={() => setBetAmount(0)}>Reiniciar</button> */}
        <input
          type="text"
          value={betAmount === 0 ? "" : betAmount}
          onChange={handleInputChange}
          placeholder="Ingresa un monto"
          className="quick-bets-input"
        />
        <button className="btn__all-in" onClick={handleAllIn}>
          ALL-IN
        </button>
      </div>

      <div className="quick-bets">
        {quickBetAmounts.map((amount, index) => (
          <button key={index} onClick={() => handleQuickBet(amount)}>
            {amount}
          </button>
        ))}
      </div>

      <Modal2
        open={openModal}
        close={setOpenModal}
        title="Confirmar apuesta"
        handleBet={handleBet}
      >
        ¿Quieres apostar ${betAmount} al color{" "}
        {team === "red" ? "Rojo" : "Verde"}?
      </Modal2>

      <Snackbar
        open={open}
        onClose={handleSnackbarClose}
        autoHideDuration={5000}
        anchorOrigin={{ vertical, horizontal }}
        TransitionComponent={Slide}
      >
        <Alert
          onClose={handleSnackbarClose}
          // severity={snackbar.bgColor}
          variant="filled"
          severity={snackbar.bgColor}
          icon={snackbar.icon}
          sx={{
            color: snackbar.bgColor === "TABLA" ? "#000000" : "#ffffff",
            width: "100%",
            backgroundColor:
              snackbar.bgColor === "TABLA"
                ? "#ffffff"
                : snackbar.bgColor === "ROJO"
                  ? "#f44336"
                  : snackbar.bgColor === "VERDE"
                    ? "#4caf50"
                    : "",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Betting;
