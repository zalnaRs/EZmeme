import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  SimpleGrid,
  Heading,
  Spinner,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Box,
  Flex,
  Image,
  Input,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import axios from "axios";
import MemeCard from "../Components/MemeCard";

const objectToQueryParams = (obj) => {
  const params = Object.entries(obj).map(([key, value]) => `${key}=${value}`);
  return "?" + params.join("&");
};

const App = () => {
  const [isLoaded, setLoaded] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFailed, setFailed] = useState(false);
  const onClose = () => location.reload();
  const cancelRef = useRef();

  const [templates, setTemplates] = useState([]);
  const [template, setTemplate] = useState();
  const [result, setResult] = useState();

  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");

  const toast = useToast();

  const generateMeme = () => {
    setIsGenerating(true);
    if (topText === "") {
      setIsGenerating(false);
      toast({
        title: "An error happened!",
        description: "Please write something into the top text.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } else if (bottomText === "") {
      setIsGenerating(false);
      toast({
        title: "An error happened!",
        description: "Please write something into the bottom text.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } else {
      setResult();
      const params = {
        template_id: template.id,
        username: import.meta.env.VITE_IMGFLIP_USERNAME,
        password: import.meta.env.VITE_IMGFLIP_PASSWORD,
        text0: topText,
        text1: bottomText,
      };
      axios({
        method: "post",
        url: `https://api.imgflip.com/caption_image${objectToQueryParams(
          params
        )}`,
      })
        .then((data) => {
          setIsGenerating(false);
          setResult(data.data);
        })
        .catch((err) => {
          setIsGenerating(false);
          toast({
            title: "An error happened!",
            description: err,
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        });
    }
  };

  useEffect(() => {
    axios
      .get("https://api.imgflip.com/get_memes")
      .then((data) => {
        setTemplates(data.data.data.memes);
        setLoaded(true);
      })
      .catch((err) => setFailed(true));
  }, []);

  return (
    <>
      <Box
        display="flex"
        flexDirection="row"
        padding="1%"
        background="blue.200"
      >
        <Heading
          marginRight="1%"
          as="h6"
          size="sm"
          transition="all 0.2s ease-in-out"
          _hover={{
            textDecoration: "underline",
            color: "white",
          }}
        >
          <a href="https://imgflip.com/api" target="_blank">
            Github
          </a>
        </Heading>

        <Heading
          as="h6"
          size="sm"
          transition="all 0.2s ease-in-out"
          _hover={{
            textDecoration: "underline",
            color: "white",
          }}
        >
          <a href="https://imgflip.com/api" target="_blank">
            Imgflip API
          </a>
        </Heading>
      </Box>
      {template && (
        <SimpleGrid columns={[1, null, 2]} spacing="1px">
          <Flex flexDirection="column">
            <Button
              onClick={() => {
                setTopText("");
                setBottomText("");
                setResult();
                setTemplate();
              }}
              margin="1%"
              size="sm"
              width="98%"
              marginBottom="1%"
              disabled={isGenerating}
            >
              <ArrowBackIcon /> Back
            </Button>
            <Image
              maxWidth="98%"
              width="min-content"
              minWidth="20%"
              margin="1%"
              border="1px"
              rounded="md"
              src={result ? result.data.url : template.url}
              alt={template.name}
            />
          </Flex>
          <Flex flexDirection="column" width="100%">
            <Input
              placeholder="Top Text"
              width="98%"
              marginTop="1%"
              marginBottom="1%"
              value={topText}
              disabled={isGenerating}
              onChange={(e) => {
                setTopText(e.target.value);
              }}
            />
            <Input
              placeholder="Bottom Text"
              width="98%"
              marginBottom="1%"
              value={bottomText}
              disabled={isGenerating}
              onChange={(e) => {
                setBottomText(e.target.value);
              }}
            />
            <Button
              width="98%"
              isLoading={isGenerating}
              onClick={() => generateMeme()}
            >
              Generate
            </Button>

            {result && (
              <Heading margin="1%">
                Meme available on{" "}
                <Heading
                  as="h6"
                  size="sm"
                  transition="all 0.2s ease-in-out"
                  _hover={{
                    textDecoration: "underline",
                    color: "teal.300",
                  }}
                >
                  <a href={result.data.url} target="_blank">
                    {result.data.url}
                  </a>
                </Heading>
              </Heading>
            )}
          </Flex>
        </SimpleGrid>
      )}
      {isLoaded && !template && (
        <SimpleGrid minChildWidth="220px" spacing="10px" margin="1%">
          {templates.map((meme) => (
            <a
              onClick={() => {
                setTemplate(meme);
              }}
            >
              <MemeCard key={meme.id} name={meme.name} img={meme.url} />
            </a>
          ))}
        </SimpleGrid>
      )}
      {!isLoaded && (
        <div className="center">
          <AlertDialog
            isOpen={isFailed}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  An error happend!
                </AlertDialogHeader>

                <AlertDialogBody>
                  We unfortunately can't get memes :(
                </AlertDialogBody>

                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={onClose}>
                    Ok
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
          <Spinner size="md" />
        </div>
      )}
    </>
  );
};

export default App;
