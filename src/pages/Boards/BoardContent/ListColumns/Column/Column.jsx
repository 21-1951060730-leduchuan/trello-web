import { useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import ContentCut from "@mui/icons-material/ContentCut";
import AddCardIcon from "@mui/icons-material/AddCard";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Cloud from "@mui/icons-material/Cloud";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ContentCopy from "@mui/icons-material/ContentCopy";
import ContentPaste from "@mui/icons-material/ContentPaste";
import { Button } from "@mui/material";
import ListCards from "./ListCards/ListCards";
import { mapOrder } from "~/utils/sorts";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
function Column({ column, createNewCard }) {
  //add card
  const [openNewCardForm, setOpenNewCardForm] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");

  const toggleOpenNewCardForm = () => setOpenNewCardForm(!openNewCardForm);
  const addNewCard = async () => {
    if (!newCardTitle) {
      toast.error("please enter card title");
      return;
      //goi api
    }
    const newCardData = { title: newCardTitle, columnId: column._id };
    await createNewCard(newCardData);

    toggleOpenNewCardForm();
    setNewCardTitle("");
  };

  const orderedCards = mapOrder(column?.cards, column?.cardOrderIds, "_id"); //sap xep keo tha theo _id cua column
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column._id, data: { ...column } });

  const dndKitColumnStyles = {
    // touchAction:'none',// danhcho sensor default dang Pointersensor
    transform: CSS.Translate.toString(transform), //Neu dung  transform: CSS.Transform.toString(transform) thi gap loi  stretch
    transition,
    height: "100%",
    opacity: isDragging ? 0.5 : undefined,
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div ref={setNodeRef} style={dndKitColumnStyles} {...attributes}>
      <Box
        {...listeners}
        sx={{
          minWidth: "300PX",
          maxWidth: "300px",
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "#333643" : "#ebecf0",
          ml: 2, //margin left 16px ,
          borderRadius: "6px",
          height: "fit-content",
          maxHeight: (theme) =>
            `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)}) `,
        }}
      >
        {/* box column header */}
        <Box
          sx={{
            height: (theme) => theme.trello.columnHeaderHeight,
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            sx={{ fontSize: "1rem", fontWeight: "bold", cursor: "pointer" }}
            variant="h6"
          >
            {column?.title}
          </Typography>
          <Box>
            <Box>
              <Tooltip title="More Options">
                <ExpandMoreIcon
                  id="basic-column-dropdown"
                  aria-controls={
                    open ? "basic-menu_column-dropdown" : undefined
                  }
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick}
                  sx={{ color: "text.primary", cursor: "pointer" }}
                />
              </Tooltip>
              <Menu
                id="basic-menu_column-dropdown"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button-workspaces",
                }}
              >
                <MenuItem>
                  <ListItemIcon>
                    <AddCardIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Add New Card</ListItemText>
                </MenuItem>
                <MenuItem>
                  <ListItemIcon>
                    <ContentCut fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Cut</ListItemText>
                </MenuItem>
                <MenuItem>
                  <ListItemIcon>
                    <ContentCopy fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Copy</ListItemText>
                </MenuItem>
                <MenuItem>
                  <ListItemIcon>
                    <ContentPaste fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Paste</ListItemText>
                </MenuItem>

                <Divider />
                <MenuItem>
                  <ListItemIcon>
                    <Cloud fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Archive this column</ListItemText>
                </MenuItem>
                <MenuItem>
                  <ListItemIcon>
                    <DeleteForeverIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Remove this column</ListItemText>
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        </Box>
        {/* box column list card */}
        <ListCards cards={orderedCards} />
        {/* box column footer */}

        <Box
          sx={{
            height: (theme) => theme.trello.columnFooterHeight,
            p: 2,
          }}
        >
          {!openNewCardForm ? (
            <Box
              sx={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Button
                startIcon={<AddCardIcon />}
                onClick={toggleOpenNewCardForm}
              >
                Add New Card
              </Button>
              <Tooltip title="Drag To Move">
                <DragHandleIcon sx={{ cursor: "pointer" }} />
              </Tooltip>
            </Box>
          ) : (
            <Box
              sx={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              {" "}
              <TextField
                onChange={(e) => setNewCardTitle(e.target.value)}
                label="Enter Card label..."
                // value={searchValue}
                variant="outlined"
                autoFocus
                // onChange={(e) => setSearchValue(e.target.value)}
                // type="search" dung de tao dau X khi nguoi dung muon xoa du lieu trong o input
                type="text"
                size="small"
                sx={{
                  "& label": { color: "text.primary" },
                  "& input": {
                    border: (theme) => theme.palette.primary.main,
                    bgcolor: (theme) =>
                      theme.palette.mode === "dard" ? "#333643" : "white",
                  },
                  "& label.Mui-focused": {
                    color: (theme) => theme.palette.primary.main,
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: {
                        borderColor: (theme) => theme.palette.primary.main,
                      },
                    },
                    "&:hover fieldset": {
                      borderColor: {
                        borderColor: (theme) => theme.palette.primary.main,
                      },
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: {
                        borderColor: (theme) => theme.palette.primary.main,
                      },
                    },
                    "& .MuiOutlinedInput-input": {
                      borderRadius: 1,
                    },
                  },
                }}
              />
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Button
                  onClick={addNewCard}
                  variant="contained"
                  color="success"
                  size="small"
                  sx={{
                    boxShadow: "none",
                    border: "0.5px solid",
                    borderColor: (theme) => theme.palette.success.main,
                    "&:hover": {
                      bgcolor: (theme) => theme.palette.success.main,
                    },
                  }}
                >
                  Add
                </Button>
                <CloseIcon
                  fontSize="small"
                  sx={{
                    color: (theme) => theme.palette.warning.light,
                    cursor: "pointer",
                  }}
                  onClick={toggleOpenNewCardForm}
                />
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </div>
  );
}

export default Column;
