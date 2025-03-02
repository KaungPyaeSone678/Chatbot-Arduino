import React, { useState, useRef, useEffect } from 'react';
import Grid from '@mui/material/Grid2';
import { TextField, Typography, Box, IconButton } from '@mui/material';
import { Send as SendIcon } from "@mui/icons-material"; 
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "@fontsource/poppins";
import PendingSharpIcon from '@mui/icons-material/PendingSharp';

const theme = createTheme({
  typography: {
    fontFamily: "Poppins, Arial, sans-serif"
  }
});


const Chatbot = () => {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  const handleSendMessage = async () => {
    if (message.trim()) {
      setConversation([...conversation, { sender: 'user', text: message }]);
      setMessage('');
      setLoading(true);

      // Call the Python backend
      const response = await fetch('http://127.0.0.1:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: message }),
      });
      console.log(response)

      const data = await response.json();
      console.log(data)

      const botResponse = data.answer.replace(/\n/g, '<br />');
      setConversation([...conversation, { sender: 'user', text: message }, { sender: 'bot', text: botResponse }]);
      setLoading(false);
    }
  };

  // Send message when pressed "Enter"
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <ThemeProvider theme={theme}>
    <Grid container >
        
        <Grid size={12} sx={{backgroundColor: "#FAFAFA", height: "100vh"}}>
          
          <Grid container
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            
            <Box // Head Logo of the page
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "12px",
                padding: "0.7rem",
                width: "auto",
                maxWidth: "200px",
                marginTop: "2rem",
                backgroundColor: "#F5F6F5",
                boxShadow: 10,
                zIndex: 10
              }}
            >

              <Grid item xs={6}>
                <Typography variant="h5"
                  sx={{
                    color: "#00CECB"
                  }}
                >
                  Arduino
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h5"
                  sx={{
                    marginLeft: "0.7rem",
                  }}
                >
                  Chatbot
                </Typography>
              </Grid>

            </Box>

          </Grid>

          <Box // Chatbox to display messages
            sx={{ 
              maxHeight: '75vh', 
              overflowY: 'auto', 
              marginBottom: '5rem', 
              marginX: {xs: '0.7rem', md: "4rem", lg: "4rem"}, 
              marginTop: "2rem",
              '&::-webkit-scrollbar': {
                display: 'none',  // Hide scrollbar in Chrome, Safari
              },
              scrollbarWidth: 'none',
            }}>
            {conversation.length === 0 ? (

              <Typography variant="h3"
                sx={{ color: "gray", textAlign: "center", marginTop: "3rem" }}
              >
                Hey, how can I help?
              </Typography>
            ) : (
            
            conversation.map((msg, index) => (
            <>
              {msg.sender === 'user' ? (

                <Typography
                  key={index}
                  align="right"
                  sx={{ marginY: "1rem", display: 'flex', justifyContent: 'flex-end' }}
                >
                  <Box
                    sx={{
                      backgroundColor: "#00CECB", 
                      padding: "0.8rem 1.2rem", 
                      borderRadius: "1.5rem", 
                      maxWidth: "60%", 
                      wordBreak: "break-word", 
                    }}  
                  >
                    {msg.text}
                  </Box>
                  <PersonIcon 
                    sx={{ 
                      marginX: "1rem", 
                      marginTop: "0.5rem",
                      borderRadius: "50%",
                      border: "4px solid #00CECB",
                      padding: "3px",
                    }} 
                  />
                </Typography>

              ) : (

                <Typography
                  key={index}
                  align="left"
                  sx={{ marginY: "1rem", display: 'flex', justifyContent: 'flex-start' }}
                >
                  <SmartToyIcon 
                    sx={{ 
                      marginX: "1rem",
                      color: "#00CECB",
                      borderRadius: "50%",
                      border: "2px solid #00CECB",
                      padding: "5px",
                      backgroundColor: "black"
                    }} 
                  />
                  <div
                    dangerouslySetInnerHTML={{
                      __html: msg.text, // This allows rendering HTML like <br />
                    }}
                  />
                </Typography>

              )}
            </>
            ))
            
            )}
            <div ref={messagesEndRef} />
          </Box>

          <Grid // Textfield to type in message and send
            container
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#FAFAFA",
              height: "90px",
              width: "100vw",
              position: "fixed",
              bottom: 0
            }}
          >

            <TextField
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              label="Ask me anything about Arduino"
              variant="outlined"
              fullWidth
              sx={{
                maxWidth: {
                  xs: "23rem",  
                  sm: "30rem",  
                  md: "50rem",  
                  lg: "60rem",  
                  xl: "70rem",  
                },
                borderRadius: 50,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "black",  // Default border color
                  },
                  "&:hover fieldset": {
                    borderColor: "black",  // Border color on hover
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#00CECB",  // Border color when focused
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "black", // Default label color
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#00CECB", // Label color when focused
                },
              }}
            
            InputProps={{
              style: {
                backgroundColor: "white",
                marginX: "3rem",
                borderRadius: "30px", 
              },
              endAdornment: (
                <IconButton
                  sx={{
                    borderRadius: "50%", 
                    width: "36px", 
                    height: "36px", 
                    padding: 0,
                    marginRight: 1, 
                  }}
                >
                  {loading ? <PendingSharpIcon  sx={{ color: "#00CECB", fontSize: 37 }} /> : <SendIcon sx={{ color: "#00CECB" }} onClick={handleSendMessage} />}
                </IconButton>
              ),
            }}
            />

          </Grid>

        </Grid>

    </Grid>
    </ThemeProvider>
  );
};

export default Chatbot;
