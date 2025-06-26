import { useState } from 'react';
import {
  Box,
  Input,
  Button,
  FormControl,
  FormLabel,
  VStack,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';

const VideoUpload = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const toast = useToast();

  const handleSubmit = async () => {
    if (!videoUrl) {
      toast({
        title: 'Please enter a YouTube URL.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      // Call your backend API with the video URL
      const response = await axios.post('http://localhost:5000/api/upload', {
        url: videoUrl,
      });

      toast({
        title: 'Video processed successfully.',
        description: 'Transcript and summary will appear below.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      console.log(response.data);
      // Update global state/context here if needed
    } catch (error) {
      toast({
        title: 'Error processing video.',
        description: error.message || 'Try again later.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box borderWidth={1} p={4} borderRadius="lg" boxShadow="md">
      <VStack spacing={4}>
        <FormControl>
          <FormLabel>Enter YouTube Video URL</FormLabel>
          <Input
            placeholder="https://www.youtube.com/watch?v=example"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
        </FormControl>
        <Button colorScheme="blue" onClick={handleSubmit}>
          Submit
        </Button>
      </VStack>
    </Box>
  );
};

export default VideoUpload;
