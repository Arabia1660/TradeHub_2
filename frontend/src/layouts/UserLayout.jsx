import React from "react";
import { Box } from "@mui/material";
import Links from "../components/Links";
import Header from "../components/Header";

function UserLayout({ children }) {
  return (
    <Box display='flex' >
      <Box width="250px" sx={{
        position:"fixed"
      }} bgcolor="lightgreen" height="100vh" padding="1rem">
        <Links />
      </Box>
      <Box sx={{
        marginLeft:"250px"
      }} width='100%'>
        <Header></Header>
        <Box flexGrow={1} padding="1rem">
          {children}
        </Box>
      </Box>
    </Box>
  );
}

export default UserLayout;
