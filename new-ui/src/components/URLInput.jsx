import React from 'react';
import { Input, Button, HStack } from '@chakra-ui/react';

const URLInput = ({ url, setUrl, handleSubmit }) => {
  return (
    <HStack spacing={4}>
      <Input
        placeholder="Enter YouTube URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <Button onClick={handleSubmit} colorScheme="teal">
        Summarize
      </Button>
    </HStack>
  );
};

export default URLInput;
