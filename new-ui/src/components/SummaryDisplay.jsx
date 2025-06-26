import { Box, Heading, Text } from '@chakra-ui/react';

const SummaryCard = ({ summary }) => {
  if (!summary) return null;

  return (
    <Box borderWidth={1} p={4} borderRadius="lg" boxShadow="md" mt={6}>
      <Heading size="md" mb={2}>
        Video Summary
      </Heading>
      <Text whiteSpace="pre-wrap">{summary}</Text>
    </Box>
  );
};

export default SummaryCard;
