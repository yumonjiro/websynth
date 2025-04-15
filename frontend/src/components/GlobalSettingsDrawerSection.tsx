import { useState } from "react";
import {
  Typography,
  Button,
  Drawer,
} from "@mui/material"; // Paper, Divider を追加

export default function GlobalSettingsDrawerSection() {
  const [open, setOpen] = useState<boolean>(false);
  const toggleDrawer = (newOpen: boolean)  => {
    setOpen(newOpen);
  };

  return (
    <div>
    <Button onClick={() => toggleDrawer(true)}>Open Settings</Button>
    <Drawer open={open} onClose={() => toggleDrawer(false)}>
      <Typography>Global Settings</Typography>
    </Drawer>
    </div>
  );
}
