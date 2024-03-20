import { MyTextField } from "./MyTextField";

export function MyDateField({ ...props }) {
  return <MyTextField type="date" InputLabelProps={{ shrink: true }} style={{ width: "140px" }} {...props} />;
}
