import { SyntheticEvent, useContext, useEffect, useRef, useState } from "react";
import { getEpisodesByFeed, getTrending } from "./api";
import {
  Box,
  Button,
  ChakraProvider,
  Divider,
  Flex,
  Grid,
  Heading,
  Icon,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Skeleton,
  Stack,
  Text,
  chakra,
  useDisclosure,
} from "@chakra-ui/react";
import { BiSolidStar } from "react-icons/bi";
import { Title } from "./components";
import {
  AiOutlineSearch,
  AiOutlineClose,
  AiOutlineStar,
  AiOutlineUser,
} from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import {
  EdpisodesByFeedResponse,
  Feed,
  TrendingPodcastResponse,
} from "./interfaces/responses";
import styles from "./app.module.css";
import CustomDrawer from "./components/CustomDrawer";
import { PodcastContext } from "./context";
import { AiOutlinePlayCircle } from "react-icons/ai";
import { useIntersectionObserver } from "./hooks/useIntersectionObserver";

const BiSolidStarChakra = chakra(BiSolidStar);

enum ViewsEnum {
  TRENDING = "TRENDING",
  FAVORITES = "FAVORITES",
}

function App() {
  const {
    favoritePodcasts,
    addFavorite,
    removeFavorite,
    selectPodcast,
    selectedPodcast,
    updateEpisodes,
  } = useContext(PodcastContext);

  const [maxPodcastsResults, setPodcastsMaxResults] = useState(20);
  const [maxEpisodesResults, setEpisodesMaxResults] = useState(20);
  const refElBottomPodcasts = useRef<HTMLDivElement>(null);
  const entryPodcasts = useIntersectionObserver(refElBottomPodcasts, {});
  const isVisibleBottomPodcast = !!entryPodcasts?.isIntersecting;

  const refElBottomEpisodes = useRef<HTMLDivElement>(null);
  const entryEpisodes = useIntersectionObserver(refElBottomEpisodes, {});
  const isVisibleBottomEpisodes = !!entryEpisodes?.isIntersecting;

  const { isOpen, onClose, onOpen } = useDisclosure();
  const [isHoveringSearch, setIsHoveringSearch] = useState(false);
  const [trendingPodcast, setTrendingPodcast] = useState<Feed[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<ViewsEnum>(ViewsEnum.TRENDING);

  useEffect(() => {
    getTrending({ maxResults: maxPodcastsResults })
      .then((response) => response.json())
      .then((data: TrendingPodcastResponse) => setTrendingPodcast(data.feeds))
      .finally(() => setIsLoading(false));
  }, [maxPodcastsResults]);

  const handleFavorite = (e: SyntheticEvent, podcast: Feed) => {
    e.stopPropagation();
    const isFavorite = favoritePodcasts.find((item) => item.id === podcast.id);

    if (isFavorite) {
      removeFavorite(podcast);
    } else {
      addFavorite(podcast);
    }
  };

  const existsInFavorites = (podcast: Feed) => {
    return favoritePodcasts.some((item) => item.id === podcast.id);
  };

  const handleClickFeed = (podcast: Feed) => {
    getEpisodesByFeed(podcast.id, maxEpisodesResults)
      .then((data) => data.json())
      .then((data: EdpisodesByFeedResponse) =>
        selectPodcast({
          ...podcast,
          episodes: data.items,
          isFavorite: existsInFavorites(podcast),
        })
      )
      .finally(() => onOpen());
  };

  const mapPodcastByView = () => {
    switch (view) {
      case ViewsEnum.TRENDING:
        return trendingPodcast;
      case ViewsEnum.FAVORITES:
        return favoritePodcasts;
      default:
        return trendingPodcast;
    }
  };

  useEffect(() => {
    if (isVisibleBottomPodcast) {
      setPodcastsMaxResults((prev) => prev + 10);
    }
  }, [isVisibleBottomPodcast]);

  useEffect(() => {
    if (isVisibleBottomEpisodes) {
      setEpisodesMaxResults((prev) => prev + 10);
    }
  }, [isVisibleBottomEpisodes]);

  useEffect(() => {
    if (selectedPodcast?.id) {
      getEpisodesByFeed(selectedPodcast.id, maxEpisodesResults)
        .then((data) => data.json())
        .then((data: EdpisodesByFeedResponse) => updateEpisodes(data.items));
    }
  }, [maxEpisodesResults, selectedPodcast?.id, updateEpisodes]);

  return (
    <ChakraProvider>
      {selectedPodcast && (
        <CustomDrawer
          isOpen={isOpen}
          onClose={onClose}
          feedWithEpisodes={selectedPodcast}
        >
          <Flex flexDir={"column"} px={3} py={1} color="white" gap="10">
            <Flex flexDir={"column"} alignItems={"center"} gap="5">
              <Image
                src={selectedPodcast.image}
                alt={selectedPodcast.title}
                w={"75%"}
                h={"100%"}
                objectFit={"cover"}
                borderRadius={"lg"}
              />
              <Heading as="h2" fontSize={"xl"} fontWeight={"extrabold"}>
                {selectedPodcast.title}
              </Heading>
              <Text>{selectedPodcast.description}</Text>
            </Flex>
            <Flex flexDir={"column"}>
              <Heading as="h5" fontSize={"lg"}>
                {selectedPodcast.episodes.length} episodios
              </Heading>
              <Flex flexDir={"column"} gap="5" pt="5">
                {selectedPodcast.episodes.map((episode) => (
                  <Box key={episode.id}>
                    <Flex gap="3" alignItems={"center"}>
                      <Image
                        src={episode.image || episode.feedImage}
                        alt={episode.title}
                        fallback={
                          <Skeleton w={"50px"} h={"50px"} borderRadius={"lg"} />
                        }
                        w={"50px"}
                        h={"50px"}
                        objectFit={"cover"}
                        borderRadius={"lg"}
                      />
                      <Flex flexDir={"column"} flex="1">
                        <Heading as="h5" fontSize={"md"}>
                          {episode.title}
                        </Heading>
                        <Text>{`${(
                          episode.duration / 60
                        ).toFixed()} mins`}</Text>
                      </Flex>
                      <Flex justifyContent={"center"} alignItems={"center"}>
                        <Icon
                          color={"white"}
                          cursor={"pointer"}
                          as={AiOutlinePlayCircle}
                          w={10}
                          h={10}
                        />
                      </Flex>
                      {/* <audio controls>
                        <source src={episode.enclosureUrl} type="audio/mpeg" />
                        Tu navegador no soporta el elemento de audio.
                      </audio> */}
                    </Flex>
                    <Divider pt="3" />
                  </Box>
                ))}
              </Flex>
            </Flex>
          </Flex>
          <Box ref={refElBottomEpisodes} />
        </CustomDrawer>
      )}
      <Box
        p="5"
        backgroundColor="white"
        maxWidth={{
          base: "100%",
          lg: "1200px",
        }}
        mx="auto"
      >
        <Flex justifyContent={"space-between"} w="100%" alignItems={"center"}>
          <Flex flexDir="column" gap="3">
            <Title title="Podcasts" />
            <Stack direction="row">
              <Button
                rounded={"full"}
                background="black"
                color="white"
                fontWeight={"bold"}
                _hover={{
                  background: "white",
                  color: "black",
                  border: "1px solid black",
                }}
                onClick={() => setView(ViewsEnum.TRENDING)}
              >
                Trending
              </Button>
              <Button
                rounded={"full"}
                leftIcon={<BiSolidStarChakra />}
                background={"white"}
                fontWeight={"bold"}
                border={"1px solid black"}
                onClick={() => setView(ViewsEnum.FAVORITES)}
              >
                Favoritos
                <Box
                  as="span"
                  ms={2}
                  background={"black"}
                  color="white"
                  rounded="full"
                  px="2"
                  py="0.5"
                >
                  {favoritePodcasts.length}
                </Box>
              </Button>
            </Stack>
          </Flex>
          <Flex>
            <AnimatePresence>
              {isHoveringSearch ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  key={"input-search"}
                >
                  <InputGroup>
                    <Input placeholder="Buscar podcast..." rounded={"full"} />
                    <InputRightElement
                      cursor={"pointer"}
                      onClick={() => setIsHoveringSearch(!isHoveringSearch)}
                    >
                      <Icon as={AiOutlineClose} w={5} h={5} />
                    </InputRightElement>
                  </InputGroup>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  key={"input-icon"}
                >
                  {" "}
                  <Icon
                    cursor={"pointer"}
                    as={AiOutlineSearch}
                    w={10}
                    h={10}
                    onClick={() => setIsHoveringSearch(!isHoveringSearch)}
                  />{" "}
                </motion.div>
              )}
            </AnimatePresence>
          </Flex>
        </Flex>
        <Flex>
          <Grid
            w={"100%"}
            mt="5"
            gap={6}
            templateColumns={"repeat(auto-fill, minmax(270px, 1fr))"}
          >
            {isLoading && (
              <>
                <Skeleton height="350px" />
                <Skeleton height="350px" />
                <Skeleton height="350px" />
                <Skeleton height="350px" />
                <Skeleton height="350px" />
                <Skeleton height="350px" />
                <Skeleton height="350px" />
                <Skeleton height="350px" />
              </>
            )}
            {mapPodcastByView().map((podcast) => (
              <Box key={podcast.id}>
                <Box
                  w="100%"
                  h="350px"
                  background={`url(${podcast.image})`}
                  backgroundSize="cover"
                  backgroundPosition="center"
                  backgroundRepeat="no-repeat"
                  position={"relative"}
                  borderRadius={"lg"}
                  transition="all 0.3s ease"
                  _hover={{
                    transform: "scale(1.1)",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                  }}
                  onClick={() => handleClickFeed(podcast)}
                >
                  <Flex
                    backgroundColor={"rgba(0,0,0,0.6)"}
                    w={"100%"}
                    h={"100%"}
                    borderRadius={"lg"}
                  >
                    <Flex
                      flexDir={"column"}
                      maxW={"100%"}
                      p="5"
                      justifyContent={"space-between"}
                      w={"100%"}
                    >
                      <Flex justifyContent={"flex-end"} cursor={"pointer"}>
                        <Icon
                          as={
                            existsInFavorites(podcast)
                              ? BiSolidStar
                              : AiOutlineStar
                          }
                          w={10}
                          h={10}
                          color={
                            existsInFavorites(podcast) ? "yellow.400" : "white"
                          }
                          transition={"all 0.3s ease"}
                          _hover={{
                            color: "yellow.400",
                            transition: "all 0.3s ease",
                          }}
                          zIndex={99}
                          onClick={(e) => handleFavorite(e, podcast)}
                        />
                      </Flex>
                      <Flex color="white" flexDir={"column"}>
                        <Heading
                          sx={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                          fontSize={"lg"}
                        >
                          {podcast.title}
                        </Heading>
                        <Text
                          pt={1}
                          fontWeight={"semibold"}
                          className={styles.lineClamp}
                          fontSize={"sm"}
                        >
                          {podcast.description}
                        </Text>
                        <Flex alignItems={"center"} gap={3} pt="3">
                          <Icon as={AiOutlineUser} />
                          <Text
                            sx={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            por {podcast.author}
                          </Text>
                        </Flex>
                      </Flex>
                    </Flex>
                  </Flex>
                </Box>
              </Box>
            ))}
            <Box ref={refElBottomPodcasts} />
          </Grid>
        </Flex>
      </Box>
    </ChakraProvider>
  );
}

export default App;
