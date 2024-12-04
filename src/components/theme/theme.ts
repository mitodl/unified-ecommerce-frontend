import { createTheme } from "@mitodl/smoot-design";
import Link from "next/link";

const theme = createTheme({
  custom: {
    LinkAdapter: Link,
  },
});

// Add scroll prop to all components using LinkAdapter
declare module "@mitodl/smoot-design" {
  interface LinkAdapterPropsOverrides {
    scroll?: boolean;
  }
}

export default theme;
