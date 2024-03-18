import { MyTextField } from "./MyTextField";

export function MyDateField({ ...props }) {
  return <MyTextField type="date" InputLabelProps={{ shrink: true }} {...props} />;
}
