import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import DashBoardIcon from "@mui/icons-material/DashBoard";
import VpnLockIcon from "@mui/icons-material/VpnLock";
import AddToDriveIcon from "@mui/icons-material/AddToDrive";
import BoltIcon from "@mui/icons-material/Bolt";
import FilterListIcon from "@mui/icons-material/FilterList";
import Button from "@mui/material/Button";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import { Tooltip } from "@mui/material";
function BoardBar() {
  const MENU_STYLE = {
    color: "white",
    bgcolor: "transparent",
    border: "none",
    paddingX: "5px",
    borderRadius: "4px",
    ".MuiSvgIcon-root": {
      color: "white",
    },
    "&:hover": {
      bgcolor: "primary.50",
    },
  };
  return (
    <Box
      sx={{
        height: (theme) => theme.trello.boardBarHeight,
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        paddingX: 2,
        overflowX: "auto",
        bgcolor: (theme) =>
          theme.palette.mode === "dark" ? "##34495e" : "#1565c0",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Chip
          sx={MENU_STYLE}
          icon={<DashBoardIcon />}
          clickable
          label="HuanLe MERN Stack Board"
        />
        <Chip
          sx={MENU_STYLE}
          icon={<VpnLockIcon />}
          clickable
          label="Public/Private Workspace"
        />

        <Chip
          sx={MENU_STYLE}
          icon={<AddToDriveIcon />}
          clickable
          label="Add To Google Drive"
        />
        <Chip
          sx={MENU_STYLE}
          icon={<BoltIcon />}
          clickable
          label="Automation"
        />
        <Chip
          sx={MENU_STYLE}
          icon={<FilterListIcon />}
          clickable
          label="Filters"
        />
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Button
          variant="outlined"
          sx={{
            color: "white",
            borderColor: "white",
            "&:hover": { borderColor: "white" },
          }}
          startIcon={<PersonAddIcon />}
        >
          Invite
        </Button>
        <AvatarGroup
          max={5}
          total={24}
          sx={{
            gap: "10px",
            "& .MuiAvatar-root": {
              width: "34px",
              height: "34px",
              fontSize: "16px",
              border: "none",
              color: "white",
              cursor: "pointer",
              "&:first-of-style": { bgcolor: "#a4b0be" },
            },
          }}
        >
          <Tooltip title="Mai Gà">
            <Avatar
              alt="Mai Gà"
              src="https://scontent.fhan17-1.fna.fbcdn.net/v/t39.30808-6/373731594_3688405991485300_4187828630390140678_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_ohc=C_b1XFd21IYAX_8ydqW&_nc_ht=scontent.fhan17-1.fna&oh=00_AfBrqmUpDuvk6kIr9HRHqKeq6G1Xhtyp1_UAENvhIG3Okw&oe=655A36EB"
            />
          </Tooltip>
          <Tooltip title="Xùy Linh">
            <Avatar
              alt="Xùy Linh"
              src="https://scontent.fhan17-1.fna.fbcdn.net/v/t39.30808-1/363346169_3577001739214576_2179931513939758883_n.jpg?stp=dst-jpg_p100x100&_nc_cat=102&ccb=1-7&_nc_sid=5f2048&_nc_ohc=3lZN7gPhFb4AX_9vf9N&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.fhan17-1.fna&oh=00_AfB0swuk4oesJ-uVs-QsGKn6PX7K-CKyXz649cxbll6LBg&oe=6559DF77"
            />
          </Tooltip>
          <Tooltip title="Nam Dụng">
            <Avatar
              alt="Nam Dụng"
              src="https://scontent.fhan17-1.fna.fbcdn.net/v/t39.30808-1/332170851_852550792482866_2770770854198064597_n.jpg?stp=dst-jpg_p100x100&_nc_cat=111&ccb=1-7&_nc_sid=5f2048&_nc_ohc=wwId5H4X_7EAX9tS6ks&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.fhan17-1.fna&oh=00_AfBF-uOXOkBoT6rbliviIJ1OZMhzq5mKdYq3DtjewQoU3w&oe=655A0F4E"
            />
          </Tooltip>
          <Tooltip title="Trang 4">
            <Avatar
              alt="Trang 4"
              src="https://scontent.fhan17-1.fna.fbcdn.net/v/t39.30808-1/367482041_1627995641055647_6980576298805520155_n.jpg?stp=dst-jpg_p100x100&_nc_cat=102&ccb=1-7&_nc_sid=5f2048&_nc_ohc=qVJcRa9GqP8AX8VXlj7&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.fhan17-1.fna&oh=00_AfDyEfZShOySXbhw0KSb6e2VfKqZblwPPqfXNh-bHq4d9A&oe=6559CAF6"
            />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  );
}

export default BoardBar;
