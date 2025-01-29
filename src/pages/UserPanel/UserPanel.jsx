import { Box, Typography } from "@mui/material";
import Stream from "@components/Stream/Stream";
import "./UserPanel.css";

const UserPanel = ({ name }) => {
  return (
    <>
      <Box sx={{ display: "grid" }}>
        <Typography align="center" p={2}>
        </Typography>
        <div className="user-panel-stream">
          <Stream title={name} />
        </div>
      </Box>
    </>
  );
};

export default UserPanel;
