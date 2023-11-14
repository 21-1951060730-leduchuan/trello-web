import Box from "@mui/material/Box";
import ModeSelect from "~/components/ModeSelect";
import AppsIcon from "@mui/icons-material/Apps";
import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as TrelloLogo } from "~/assets/trello.svg";
import Typography from "@mui/material/Typography";
import WorkSpaces from "./Menus/WorkSpaces";
import Recent from "./Menus/Recent";
import Template from "./Menus/Templates";
import Starred from "./Menus/Starred";
import Button from "@mui/material/Button";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import TextField from "@mui/material/TextField";
import Badge from "@mui/material/Badge";
import Tooltip from "@mui/material/Tooltip";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

import Profile from "./Menus/Profiles";
function AppBar() {
  return (
    <Box
      px={2}
      sx={{
        height: (theme) => theme.trello.appBarHeight,
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <AppsIcon sx={{ color: "primary.main" }} />
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <SvgIcon
            component={TrelloLogo}
            inheritViewBoxfontSize="small"
            sx={{ color: "primary.main" }}
          />
          <Typography
            variant="span"
            sx={{
              fontSize: "1.2rem",
              fontWeight: "bold",
              color: "primary.main",
            }}
          >
            Trello
          </Typography>
          <WorkSpaces />
          <Recent />
          <Starred />
          <Template />
          <Button variant="outlined">Create</Button>
        </Box>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <TextField
          id="outlined-search"
          label="Search..."
          type="search"
          size="small"
        />
        <ModeSelect />
        <Tooltip title="Notifications">
          <Badge
            badgeContent={100}
            color="secondary"
            variant="dot"
            sx={{ cursor: "pointer" }}
          >
            <NotificationsNoneIcon />
          </Badge>
        </Tooltip>
        <Tooltip title="Help">
          <HelpOutlineIcon sx={{ cursor: "pointer" }} />
        </Tooltip>

        <Profile />
      </Box>
    </Box>
  );
}

export default AppBar;
