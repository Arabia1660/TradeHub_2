import React from "react";
import { Box } from "@mui/material";
import Header from "../components/Header";
import AdminLinks from "../components/AdminLinks";

function AdminLayout({ children }) {
  return (
    <Box display='flex' >
      <Box width="250px" sx={{
        position:"fixed"
      }} bgcolor="lightgreen" height="100vh" padding="1rem">
        <AdminLinks />
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

export default AdminLayout;
