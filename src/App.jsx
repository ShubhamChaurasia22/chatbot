import {
  ChakraProvider,
  Heading,
  Container,
  Input,
  Button,
  Wrap,
  Box,
  HStack,
  VStack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useState, useRef } from "react";

const App = () => {
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [userQuestion, setUserQuestion] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef();
  const toast = useToast();

  const handleGenerate = () => {
    // Check if a file is selected
    if (!fileInputRef.current.files || fileInputRef.current.files.length === 0) {
      showToast("Please upload a file.");
      return;
    }

    // Perform any file handling logic here

    // Show the chat container
    setIsChatVisible(true);

    // Initial bot message
    addBotMessage("Ask me now");
  };

  const handleSendQuestion = () => {
    if (!userQuestion) {
      showToast("Please enter a question.");
      return;
    }

    // Add the user's question to the chat
    addUserMessage(userQuestion);

    // Clear the input box after sending the question
    setUserQuestion("");
  };

  const showToast = (message, status = "error") => {
    toast({
      title: message,
      status,
      duration: 3000,
      isClosable: true,
    });
  };

  const handleVoiceRecognition = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setUserQuestion(transcript);
    };

    if (isListening) {
      // If currently listening, stop the recognition
      recognition.stop();
    } else {
      // If not currently listening, start the recognition
      recognition.start();
    }
  };

  const addUserMessage = (message) => {
    setChatMessages([...chatMessages, { author: "Me", text: message }]);
  };

  const addBotMessage = (message) => {
    setChatMessages([...chatMessages, { author: "Bot", text: message }]);
  };

  return (
    <ChakraProvider>
      <Container>
        <Heading marginBottom={"10px"}>Merkle Document Chatbot</Heading>

        {!isChatVisible ? (
          <Wrap marginBottom={"10px"}>
            <Input
              type="file"
              width={"350px"}
              accept=".pdf,.doc,.docx"
              paddingTop={"5px"}
              ref={fileInputRef}
            />
            <Button colorScheme={"yellow"} onClick={handleGenerate}>
              Submit
            </Button>
          </Wrap>
        ) : (
          <ChatContainer
            userQuestion={userQuestion}
            onSendQuestion={handleSendQuestion}
            onQuestionChange={(e) => setUserQuestion(e.target.value)}
            onVoiceRecognition={handleVoiceRecognition}
            isListening={isListening}
            chatMessages={chatMessages}
          />
        )}
      </Container>
    </ChakraProvider>
  );
};

const ChatContainer = ({
  userQuestion,
  onSendQuestion,
  onQuestionChange,
  onVoiceRecognition,
  isListening,
  chatMessages,
}) => {
  return (
    <Box mt={4} p={4} bg="gray.200" borderRadius="md">
      <VStack align="stretch" spacing={4}>
        {chatMessages.map((message, index) => (
          <ChatMessage key={index} author={message.author} text={message.text} />
        ))}
        <HStack>
          <Input
            placeholder="Type your question..."
            value={userQuestion}
            onChange={onQuestionChange}
          />
          <Button
            size="md"
            colorScheme="blue"
            onClick={onVoiceRecognition}
            disabled={isListening}
          >
            {isListening ? "Listening..." : "🎤"}
          </Button>
          <Button colorScheme="yellow" onClick={onSendQuestion}>
            Send
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

const ChatMessage = ({ author, text }) => {
  const isUser = author === "Me";
  const align = isUser ? "flex-end" : "flex-start";
  const bgColor = isUser ? "yellow.400" : "gray.300";
  const textColor = "black";

  return (
    <Box
      w="70%"
      alignSelf={align}
      bg={bgColor}
      color={textColor}
      p={2}
      borderRadius="md"
    >
      <Text fontWeight="bold">{author}:</Text>
      <Text>{text}</Text>
    </Box>
  );
};

export default App;
