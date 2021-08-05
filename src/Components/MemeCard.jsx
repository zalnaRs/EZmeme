import React from "react";
import { Box, Image } from "@chakra-ui/react";

const MemeCard = (props) => {
  return (
    <Box
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      cursor="pointer"
      transition="all 0.2s ease-in-out"
      _hover={{
        boxShadow: "outline",
        textDecoration: "underline",
        color: "teal.300",
      }}
    >
      <Image src={props.img} alt={props.name} />

      <Box p="6">
        <Box
          mt="1"
          fontWeight="semibold"
          as="h4"
          lineHeight="tight"
          isTruncated
        >
          {props.name}
        </Box>
      </Box>
    </Box>
  );
};

export default MemeCard;
