import { Box, Image, Text, IconButton, Spinner } from "@chakra-ui/react";
import { MdDeleteForever } from "react-icons/md";
import useLocationImage from "../../services/useLocationImage";
import useDeleteFavorite from "../../hooks/useDeleteFavorite";

const Favorite = ({
  city,
  country,
  id,
  onChange, // NEW: callback to re-fetch after deletion
}: {
  city: string;
  country: string;
  id: string;
  onChange: () => void;
}) => {
  const locationImageResult = useLocationImage(country);
  const { deleteFavorite, loading } = useDeleteFavorite();

  if (locationImageResult.imageLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <Box
      h={{ base: "100px", sm: "200px" }}
      minW={{ base: "100px", sm: "200px" }}
      marginInline={2}
      position="relative"
      borderRadius="5px"
      overflowX="hidden"
    >
      <IconButton
        position="absolute"
        rounded={"full"}
        top={2}
        right={2}
        zIndex={1}
        onClick={async () => {
          await deleteFavorite(id);     // Fix: await this
          onChange();                   // Fix: tell parent to re-fetch
        }}
        bg="transparent"
        color="white"
        _hover={{ background: "red.500" }}
        aria-label="delete favorite"
      >
        {loading ? <Spinner size="sm" /> : <MdDeleteForever />}
      </IconButton>

      <Image
        src={locationImageResult.image?.urls?.regular || undefined}
        h="100%"
        w="100%"
        objectFit="cover"
      />

      <Box
        fontSize={{ base: "xl", sm: "2xl", lg: "3xl" }}
        position="absolute"
        top={0}
        left={0}
        w="100%"
        h="100%"
        display="flex"
        alignItems="end"
        justifyContent="left"
        color="white"
        textAlign="center"
        bg={"rgba(10, 33, 54, 0.36)"}
        p={5}
      >
        <Box fontWeight="bold" display="flex" flexDirection="column" justifyContent="end" w="100%" h="100%">
          <Box display="flex" flexDirection="column" alignItems="start" w="100%" fontSize={{ base: "12px", sm: "20px" }}>
            <Text>{city}</Text>
            <Text fontWeight={"normal"} display={{ base: "none", sm: "block" }}>{country}</Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Favorite;
