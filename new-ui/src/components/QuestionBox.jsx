import { useState } from 'react';
import {
  Box,
  Input,
  Button,
  VStack,
  Text,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import axios from 'axios';

const QuestionBox = ({ videoId }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/ask', {
        videoId,
        question,
      });
      setAnswer(res.data.answer);
    } catch (error) {
      setAnswer('Something went wrong while fetching the answer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box mt={8}>
      <FormControl>
        <FormLabel>Ask a question about the video</FormLabel>
        <VStack spacing={4} align="stretch">
          <Input
            placeholder="e.g., What is the main topic discussed?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <Button
            onClick={handleAsk}
            colorScheme="teal"
            isLoading={loading}
            isDisabled={!question.trim()}
          >
            Ask
          </Button>
          {answer && (
            <Box borderWidth={1} p={4} borderRadius="md">
              <Text fontWeight="bold">Answer:</Text>
              <Text mt={2} whiteSpace="pre-wrap">
                {answer}
              </Text>
            </Box>
          )}
        </VStack>
      </FormControl>
    </Box>
  );
};

export default QuestionBox;
