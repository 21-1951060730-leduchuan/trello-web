import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Box from '@mui/material/Box';
import { useColorScheme } from "@mui/material/styles";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness";
function ModeToogle() {
  const { mode, setMode } = useColorScheme();
  return (
    <Button
      onClick={() => {
        setMode(mode === "light" ? "dark" : "light");
      }}
    >
      {mode === "light" ? "Turn dark" : "Turn light"}
    </Button>
  );
}
function ModeSelect() {
  const { mode, setMode } = useColorScheme();

  const handleChange = (event) => {
    const selectedMode = event.target.value;
    setMode(selectedMode);
  };
  return (
    <>
      <FormControl sx={{ m: 1, minWidth: 80 }}>
        <InputLabel id="label-select-dark-light-mode">Mode</InputLabel>
        <Select
          labelId="label-select-dark-light-mode"
          id="label-select-dark-light-mode"
          value={mode}
          onChange={handleChange}
          autoWidth
          label="Mode"
        >
          <MenuItem value="light">
            <Box style={{ display: "flex", alignItems: "center",gap:1 }}>
              <LightModeIcon fontSize="small"/> Light
            </Box>
          </MenuItem>{" "}
          <MenuItem value="dark">
            <Box style={{ display: "flex", alignItems: "center",gap:1 }}>
              <DarkModeOutlinedIcon fontSize="small"/> Dark
            </Box>
          </MenuItem>{" "}
          <MenuItem value="system">
            <Box style={{ display: "flex", alignItems: "center",gap:1 }}>
              <SettingsBrightnessIcon fontSize="small"/> System
            </Box>
          </MenuItem>
        </Select>
      </FormControl>
    </>
  );
}
function App() {
  return (
    <>
      <ModeToogle />
      <hr />
      <ModeSelect />
    </>
  );
}

export default App;
