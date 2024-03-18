import { TextField } from "@mui/material";

export function MyTextField({ value, setValue, label, ...props }) {
  return (
    <TextField
      label={label}
      value={value === null ? "" : value}
      onChange={(e) => setValue(e.target.value)}
      {...props}
      variant="standard"
    />
  );
}
