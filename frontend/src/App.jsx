import React, { useState } from 'react';
import { Upload, Youtube, MessageCircle, FileText, Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [transcript, setTranscript] = useState('');
  const [summary, setSummary] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [loading, setLoading] = useState({
    transcript: false,
    summary: false,
    question: false
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // IMPORTANT: Change this to your FastAPI server URL
  const API_BASE_URL = 'http://127.0.0.1:8000';

  const setLoadingState = (key, value) => {
    setLoading(prev => ({ ...prev, [key]: value }));
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setLoadingState('transcript', true);
    setError('');
    setSummary('');
    setAnswer('');

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
      setError('Failed to upload and transcribe video: ' + err.message);
    } finally {
      setLoadingState('transcript', false);
    }
  };

  const handleYouTubeUpload = async () => {
    if (!youtubeUrl.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }

    setLoadingState('transcript', true);
    setError('');
    setSummary('');
    setAnswer('');

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
      setError('Failed to process YouTube URL: ' + err.message);
    } finally {
      setLoadingState('transcript', false);
    }
  };

  const generateSummary = async () => {
    if (!transcript) {
      setError('Please upload a video or enter a YouTube URL first');
      return;
    }

    setLoadingState('summary', true);
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
      setError('Failed to generate summary: ' + err.message);
    } finally {
      setLoadingState('summary', false);
    }
  };

  const askQuestion = async () => {
    if (!transcript) {
      setError('Please upload a video or enter a YouTube URL first');
      return;
    }
    if (!question.trim()) {
      setError('Please enter a question');
      return;
    }

    setLoadingState('question', true);
    setError('');

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
        setAnswer(data.answer);
        setSuccess('Question answered successfully!');
      }
    } catch (err) {
      setError('Failed to get answer: ' + err.message);
    } finally {
      setLoadingState('question', false);
    }
  };

  const clearAll = () => {
    setTranscript('');
    setSummary('');
    setAnswer('');
    setQuestion('');
    setYoutubeUrl('');
    setError('');
    setSuccess('');
  };

  // Styles object
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    innerContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem 1rem'
    },
    header: {
      textAlign: 'center',
      marginBottom: '3rem',
      color: 'white'
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      marginBottom: '1rem',
      textShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    subtitle: {
      fontSize: '1.1rem',
      opacity: 0.9,
      maxWidth: '600px',
      margin: '0 auto'
    },
    notification: {
      padding: '1rem',
      borderRadius: '8px',
      marginBottom: '1.5rem',
      display: 'flex',
      alignItems: 'center'
    },
    errorNotification: {
      backgroundColor: '#fee2e2',
      border: '1px solid #fecaca',
      color: '#dc2626'
    },
    successNotification: {
      backgroundColor: '#d1fae5',
      border: '1px solid #a7f3d0',
      color: '#059669'
    },
    gridContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
      gap: '2rem'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
      padding: '1.5rem'
    },
    tabContainer: {
      display: 'flex',
      backgroundColor: '#f3f4f6',
      borderRadius: '8px',
      padding: '4px',
      marginBottom: '1.5rem'
    },
    tab: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0.75rem 1rem',
      borderRadius: '6px',
      border: 'none',
      fontSize: '0.9rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    activeTab: {
      backgroundColor: 'white',
      color: '#4f46e5',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    inactiveTab: {
      color: '#6b7280',
      backgroundColor: 'transparent'
    },
    uploadArea: {
      border: '2px dashed #d1d5db',
      borderRadius: '8px',
      padding: '3rem 2rem',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'border-color 0.2s ease'
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '1rem',
      outline: 'none',
      transition: 'border-color 0.2s ease'
    },
    button: {
      width: '100%',
      padding: '0.75rem 1rem',
      borderRadius: '6px',
      border: 'none',
      fontSize: '1rem',
      fontWeight: '500',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background-color 0.2s ease'
    },
    primaryButton: {
      backgroundColor: '#4f46e5',
      color: 'white'
    },
    successButton: {
      backgroundColor: '#059669',
      color: 'white'
    },
    grayButton: {
      backgroundColor: '#6b7280',
      color: 'white'
    },
    disabledButton: {
      opacity: 0.5,
      cursor: 'not-allowed'
    },
    textArea: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '1rem',
      outline: 'none',
      resize: 'vertical',
      fontFamily: 'inherit'
    },
    resultBox: {
      backgroundColor: '#f9fafb',
      borderRadius: '6px',
      padding: '1rem',
      maxHeight: '300px',
      overflowY: 'auto',
      fontSize: '0.9rem',
      lineHeight: '1.6',
      whiteSpace: 'pre-wrap'
    },
    coloredBox: {
      borderRadius: '6px',
      padding: '1rem',
      fontSize: '0.9rem',
      lineHeight: '1.6'
    },
    greenBox: {
      backgroundColor: '#ecfdf5',
      border: '1px solid #a7f3d0'
    },
    blueBox: {
      backgroundColor: '#eff6ff',
      border: '1px solid #93c5fd'
    },
    emptyState: {
      textAlign: 'center',
      padding: '3rem 2rem',
      color: '#6b7280'
    },
    emptyStateIcon: {
      width: '64px',
      height: '64px',
      color: '#4f46e5',
      margin: '0 auto 1rem',
      backgroundColor: '#eef2ff',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    sectionTitle: {
      fontSize: '1.1rem',
      fontWeight: '600',
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'center'
    },
    iconMargin: {
      marginRight: '0.5rem'
    },
    loadingContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.innerContainer}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>
            Video Transcript & Q&A Assistant
          </h1>
          <p style={styles.subtitle}>
            Upload videos or paste YouTube URLs to generate transcripts, summaries, and get AI-powered answers to your questions
          </p>
        </div>

        {/* Notification Messages */}
        {error && (
          <div style={{...styles.notification, ...styles.errorNotification}}>
            <AlertCircle size={20} style={styles.iconMargin} />
            {error}
          </div>
        )}

        {success && (
          <div style={{...styles.notification, ...styles.successNotification}}>
            <CheckCircle size={20} style={styles.iconMargin} />
            {success}
          </div>
        )}

        {/* Main Content */}
        <div style={styles.gridContainer}>
          {/* Left Column - Input Section */}
          <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
            {/* Upload Tabs */}
            <div style={styles.card}>
              <div style={styles.tabContainer}>
                <button
                  onClick={() => setActiveTab('upload')}
                  style={{
                    ...styles.tab,
                    ...(activeTab === 'upload' ? styles.activeTab : styles.inactiveTab)
                  }}
                >
                  <Upload size={16} style={styles.iconMargin} />
                  Upload Video
                </button>
                <button
                  onClick={() => setActiveTab('youtube')}
                  style={{
                    ...styles.tab,
                    ...(activeTab === 'youtube' ? styles.activeTab : styles.inactiveTab)
                  }}
                >
                  <Youtube size={16} style={styles.iconMargin} />
                  YouTube URL
                </button>
              </div>

              {/* Upload Tab Content */}
              {activeTab === 'upload' && (
                <div>
                  <label>
                    <div style={styles.uploadArea}>
                      <Upload size={48} style={{color: '#9ca3af', margin: '0 auto 1rem'}} />
                      <p style={{fontSize: '1.1rem', fontWeight: '500', marginBottom: '0.5rem'}}>
                        Choose a video file
                      </p>
                      <p style={{fontSize: '0.9rem', color: '#6b7280'}}>
                        Supports MP4, AVI, MOV and other video formats
                      </p>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleFileUpload}
                        style={{display: 'none'}}
                        disabled={loading.transcript}
                      />
                    </div>
                  </label>
                  {loading.transcript && (
                    <div style={styles.loadingContainer}>
                      <Loader2 size={24} style={{...styles.iconMargin, animation: 'spin 1s linear infinite', color: '#4f46e5'}} />
                      <span style={{color: '#4f46e5'}}>Processing video...</span>
                    </div>
                  )}
                </div>
              )}

              {/* YouTube Tab Content */}
              {activeTab === 'youtube' && (
                <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                  <div>
                    <label style={{display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.5rem'}}>
                      YouTube URL
                    </label>
                    <input
                      type="url"
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      style={styles.input}
                      disabled={loading.transcript}
                    />
                  </div>
                  <button
                    onClick={handleYouTubeUpload}
                    disabled={loading.transcript || !youtubeUrl.trim()}
                    style={{
                      ...styles.button,
                      ...styles.primaryButton,
                      ...(loading.transcript || !youtubeUrl.trim() ? styles.disabledButton : {})
                    }}
                  >
                    {loading.transcript ? (
                      <>
                        <Loader2 size={20} style={{...styles.iconMargin, animation: 'spin 1s linear infinite'}} />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Youtube size={20} style={styles.iconMargin} />
                        Process YouTube Video
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Actions */}
            {transcript && (
              <div style={styles.card}>
                <h3 style={styles.sectionTitle}>Actions</h3>
                <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
                  <button
                    onClick={generateSummary}
                    disabled={loading.summary}
                    style={{
                      ...styles.button,
                      ...styles.successButton,
                      ...(loading.summary ? styles.disabledButton : {})
                    }}
                  >
                    {loading.summary ? (
                      <>
                        <Loader2 size={20} style={{...styles.iconMargin, animation: 'spin 1s linear infinite'}} />
                        Generating...
                      </>
                    ) : (
                      <>
                        <FileText size={20} style={styles.iconMargin} />
                        Generate Summary
                      </>
                    )}
                  </button>
                  <button
                    onClick={clearAll}
                    style={{
                      ...styles.button,
                      ...styles.grayButton
                    }}
                  >
                    Clear All
                  </button>
                </div>
              </div>
            )}

            {/* Q&A Section */}
            {transcript && (
              <div style={styles.card}>
                <h3 style={styles.sectionTitle}>
                  <MessageCircle size={20} style={{...styles.iconMargin, color: '#4f46e5'}} />
                  Ask a Question
                </h3>
                <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask anything about the video content..."
                    rows="3"
                    style={styles.textArea}
                    disabled={loading.question}
                  />
                  <button
                    onClick={askQuestion}
                    disabled={loading.question || !question.trim()}
                    style={{
                      ...styles.button,
                      ...styles.primaryButton,
                      ...(loading.question || !question.trim() ? styles.disabledButton : {})
                    }}
                  >
                    {loading.question ? (
                      <>
                        <Loader2 size={20} style={{...styles.iconMargin, animation: 'spin 1s linear infinite'}} />
                        Thinking...
                      </>
                    ) : (
                      <>
                        <Send size={20} style={styles.iconMargin} />
                        Ask Question
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Results Section */}
          <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
            {/* Transcript */}
            {transcript && (
              <div style={styles.card}>
                <h3 style={styles.sectionTitle}>Transcript</h3>
                <div style={styles.resultBox}>
                  {transcript}
                </div>
              </div>
            )}

            {/* Summary */}
            {summary && (
              <div style={styles.card}>
                <h3 style={styles.sectionTitle}>
                  <FileText size={20} style={{...styles.iconMargin, color: '#059669'}} />
                  Summary
                </h3>
                <div style={{...styles.coloredBox, ...styles.greenBox}}>
                  {summary}
                </div>
              </div>
            )}

            {/* Answer */}
            {answer && (
              <div style={styles.card}>
                <h3 style={styles.sectionTitle}>
                  <MessageCircle size={20} style={{...styles.iconMargin, color: '#4f46e5'}} />
                  Answer
                </h3>
                <div style={{...styles.coloredBox, ...styles.blueBox}}>
                  <p style={{fontSize: '0.9rem', fontWeight: '500', color: '#6b7280', marginBottom: '0.5rem'}}>
                    Q: {question}
                  </p>
                  <p>
                    {answer}
                  </p>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!transcript && !loading.transcript && (
              <div style={styles.card}>
                <div style={styles.emptyState}>
                  <div style={styles.emptyStateIcon}>
                    <FileText size={32} />
                  </div>
                  <h3 style={{fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151'}}>
                    No content yet
                  </h3>
                  <p>
                    Upload a video or paste a YouTube URL to get started
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          @media (max-width: 768px) {
            .grid-container {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default App;