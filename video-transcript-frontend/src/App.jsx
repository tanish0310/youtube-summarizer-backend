import React, { useState } from 'react';
import { Upload, Youtube, MessageCircle, FileText, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000';

export default function VideoTranscriptApp() {
  const [currentTab, setCurrentTab] = useState('upload');
  const [transcript, setTranscript] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [question, setQuestion] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');

  const resetState = () => {
    setTranscript('');
    setSummary('');
    setChatMessages([]);
    setError('');
    setSuccess('');
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    
    setLoading(true);
    setError('');
    resetState();
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        setTranscript(data.transcript);
        setSuccess('Video transcribed successfully!');
      }
    } catch (err) {
      setError('Failed to upload and transcribe video. Please check if your backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleYouTubeUpload = async () => {
    if (!youtubeUrl.trim()) return;
    
    setLoading(true);
    setError('');
    resetState();

    try {
      const response = await fetch(`${API_BASE_URL}/upload-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: youtubeUrl }),
      });
      
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        setTranscript(data.transcript);
        setSuccess('YouTube video transcribed successfully!');
      }
    } catch (err) {
      setError('Failed to process YouTube URL. Please check if your backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const generateSummary = async () => {
    if (!transcript) {
      setError('Please upload a video first to generate a summary.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/summary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transcript }),
      });
      
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        setSummary(data.summary);
        setSuccess('Summary generated successfully!');
      }
    } catch (err) {
      setError('Failed to generate summary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const askQuestion = async () => {
    if (!transcript) {
      setError('Please upload a video first before asking questions.');
      return;
    }
    
    if (!question.trim()) return;

    setLoading(true);
    setError('');

    // Add user question to chat
    const newMessages = [...chatMessages, { type: 'user', content: question }];
    setChatMessages(newMessages);

    try {
      const response = await fetch(`${API_BASE_URL}/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transcript, question }),
      });
      
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        setChatMessages([...newMessages, { type: 'assistant', content: data.answer }]);
        setQuestion('');
      }
    } catch (err) {
      setError('Failed to get answer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      askQuestion();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Video Transcript & Q&A
            </h1>
            <p className="text-gray-600">
              Upload videos or YouTube URLs, generate summaries, and ask questions using AI
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap justify-center mb-6 bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setCurrentTab('upload')}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                currentTab === 'upload'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              <Upload className="inline-block w-4 h-4 mr-2" />
              Upload Video
            </button>
            <button
              onClick={() => setCurrentTab('youtube')}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                currentTab === 'youtube'
                  ? 'bg-red-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-red-500'
              }`}
            >
              <Youtube className="inline-block w-4 h-4 mr-2" />
              YouTube URL
            </button>
            <button
              onClick={() => setCurrentTab('summary')}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                currentTab === 'summary'
                  ? 'bg-green-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-green-500'
              }`}
              disabled={!transcript}
            >
              <FileText className="inline-block w-4 h-4 mr-2" />
              Summary
            </button>
            <button
              onClick={() => setCurrentTab('chat')}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                currentTab === 'chat'
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-purple-500'
              }`}
              disabled={!transcript}
            >
              <MessageCircle className="inline-block w-4 h-4 mr-2" />
              Ask Questions
            </button>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <span className="text-green-700">{success}</span>
            </div>
          )}

          {/* Main Content Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            {/* Upload Video Tab */}
            {currentTab === 'upload' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Upload Video File</h2>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <label htmlFor="video-upload" className="cursor-pointer">
                    <span className="text-lg font-medium text-gray-700">
                      Click to upload or drag and drop
                    </span>
                    <p className="text-gray-500 mt-2">
                      MP4, AVI, MOV, WMV files supported
                    </p>
                    <input
                      id="video-upload"
                      type="file"
                      accept="video/*,audio/*"
                      onChange={(e) => handleFileUpload(e.target.files[0])}
                      className="hidden"
                      disabled={loading}
                    />
                  </label>
                </div>
              </div>
            )}

            {/* YouTube URL Tab */}
            {currentTab === 'youtube' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">YouTube URL</h2>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    disabled={loading}
                  />
                  <button
                    onClick={handleYouTubeUpload}
                    disabled={loading || !youtubeUrl.trim()}
                    className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Youtube className="w-5 h-5 mr-2" />
                        Process URL
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Summary Tab */}
            {currentTab === 'summary' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold text-gray-800">Summary</h2>
                  <button
                    onClick={generateSummary}
                    disabled={loading || !transcript}
                    className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    ) : (
                      <FileText className="w-5 h-5 mr-2" />
                    )}
                    Generate Summary
                  </button>
                </div>
                
                {summary ? (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-800 mb-3">Generated Summary:</h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{summary}</p>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    {transcript ? 'Click "Generate Summary" to create a summary of your video.' : 'Please upload a video first to generate a summary.'}
                  </div>
                )}
              </div>
            )}

            {/* Chat Tab */}
            {currentTab === 'chat' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800">Ask Questions</h2>
                
                {/* Chat Messages */}
                <div className="h-96 overflow-y-auto bg-gray-50 rounded-lg p-4 space-y-4">
                  {chatMessages.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      {transcript ? 'Ask any question about the video content!' : 'Please upload a video first to start asking questions.'}
                    </div>
                  ) : (
                    chatMessages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.type === 'user'
                              ? 'bg-blue-500 text-white'
                              : 'bg-white text-gray-800 shadow-sm'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{message.content}</p>
                        </div>
                      </div>
                    ))
                  )}
                  
                  {loading && (
                    <div className="flex justify-start">
                      <div className="bg-white text-gray-800 shadow-sm px-4 py-2 rounded-lg">
                        <Loader2 className="w-5 h-5 animate-spin" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Question Input */}
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="Ask a question about the video..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    disabled={loading || !transcript}
                  />
                  <button
                    onClick={askQuestion}
                    disabled={loading || !question.trim() || !transcript}
                    className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <MessageCircle className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Transcript Preview */}
            {transcript && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Transcript Preview</h3>
                <div className="bg-gray-50 rounded-lg p-4 max-h-32 overflow-y-auto">
                  <p className="text-sm text-gray-700">
                    {transcript.substring(0, 500)}
                    {transcript.length > 500 && '...'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
