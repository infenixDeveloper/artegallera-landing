import { Box, Typography } from "@mui/material";
import Stream from "@components/Stream/Stream";
import "./UserPanel.css";

const UserPanel = ({ name }) => {
  return (
    <>
      <Box sx={{ display: "grid" }}>
        <Typography align="center" p={2}>
          {name}
        </Typography>
        <div className="user-panel-stream">
          <Stream />
        </div>
      </Box>
    </>
  );
};

export default UserPanel;
