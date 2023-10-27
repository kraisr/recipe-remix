import React from "react";
import { Box, Container } from "@mui/material";
import ShoppingList1 from "./ShoppingList1";
import GroceryStores from "./GroceryStores";
import useMediaQuery from "@mui/material/useMediaQuery";

function ShoppingList() {
  const isSmallScreen = useMediaQuery('(max-width:1000px)');

  return (
    <Box 
      display="flex" 
      flexDirection={isSmallScreen ? 'column' : 'row'}
      gap={isSmallScreen ? '0px' : '20px'}
    >
      <Container 
        maxWidth="sm" 
        sx={{ marginRight: isSmallScreen ? 'auto' : 0 }} // Set marginRight to 0 only when isSmallScreen is false
      >
        <ShoppingList1 />
      </Container>
      <Container 
        maxWidth="sm" 
        sx={{ marginLeft: isSmallScreen ? 'auto' : 0 }} // Set marginLeft to 0 only when isSmallScreen is false
      >
        <GroceryStores />
      </Container>
    </Box>
  );
};

export default ShoppingList;
