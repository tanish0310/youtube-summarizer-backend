import { useState } from 'react';
import { Box, Container, Heading, Spinner, VStack } from '@chakra-ui/react';
import URLInput from '../components/URLInput';
import SummaryDisplay from '../components/SummaryDisplay';
import QuestionBox from '../components/QuestionBox';

const MainPage = () => {
  const [videoId, setVideoId] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (url) => {
    setLoading(true);
    setSummary('');
    try {
      const res = await fetch('http://localhost:5000/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();
      setSummary(data.summary);
      setVideoId(data.videoId);
    } catch (error) {
      setSummary('Failed to summarize the video. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="3xl" py={10}>
      <VStack spacing={6} align="stretch">
        <Heading textAlign="center">YouTube Summarizer + Q&A</Heading>
        <URLInput onSubmit={handleSubmit} />
        {loading ? (
          <Box textAlign="center">
            <Spinner size="xl" color="teal.500" />
          </Box>
        ) : (
          <>
            {summary && <SummaryCard summary={summary} />}
            {summary && <QuestionBox videoId={videoId} />}
          </>
        )}
      </VStack>
    </Container>
  );
};

export default MainPage;
