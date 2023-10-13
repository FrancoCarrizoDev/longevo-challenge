import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  DrawerHeader,
  DrawerCloseButton,
  Flex,
  Icon,
} from "@chakra-ui/react";
import { AiOutlineStar } from "react-icons/ai";
import { FeedWithEpisodes } from "../interfaces/responses";
import { BiSolidStar } from "react-icons/bi";
import { useContext } from "react";
import { PodcastContext } from "../context";

interface CustomDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  feedWithEpisodes: FeedWithEpisodes;
}

export default function CustomDrawer({
  isOpen,
  onClose,
  children,
}: CustomDrawerProps) {
  const { favoritePodcasts, addFavorite, removeFavorite, selectedPodcast } =
    useContext(PodcastContext);

  const handleFavorite = (podcast: FeedWithEpisodes) => {
    const isFavorite = favoritePodcasts.find((item) => item.id === podcast.id);

    if (isFavorite) {
      removeFavorite(podcast);
    } else {
      addFavorite(podcast);
    }
  };

  const existsInFavorites = (podcast: FeedWithEpisodes) => {
    return favoritePodcasts.some((item) => item.id === podcast.id);
  };

  return (
    <>
      <Drawer size={"sm"} placement={"left"} onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent
          background="#0f0f2d"
          roundedTopEnd={"3xl"}
          roundedBottomEnd={"3xl"}
        >
          <DrawerCloseButton m="3" fontSize={"xl"} color="white" />
          <DrawerHeader>
            <Flex cursor={"pointer"}>
              <Icon
                as={
                  existsInFavorites(selectedPodcast!)
                    ? BiSolidStar
                    : AiOutlineStar
                }
                w={10}
                h={10}
                color={selectedPodcast?.isFavorite ? "yellow.400" : "white"}
                transition={"all 0.3s ease"}
                _hover={{
                  color: "yellow.400",
                  transition: "all 0.3s ease",
                }}
                zIndex={99}
                onClick={() => handleFavorite(selectedPodcast!)}
              />
            </Flex>
          </DrawerHeader>
          <DrawerBody>{children}</DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
