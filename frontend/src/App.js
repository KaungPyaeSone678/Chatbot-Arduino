import React, { useState, useRef, useEffect } from 'react';
import Grid from '@mui/material/Grid2';
import { TextField, Typography, Box, IconButton } from '@mui/material';
import { Send as SendIcon } from "@mui/icons-material"; 
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "@fontsource/poppins"; // This loads the default weight of 400



const theme = createTheme({
  typography: {
    fontFamily: "Poppins, Arial, sans-serif"
  }
});

const Chatbot = () => {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  const handleSendMessage = async () => {
    if (message.trim()) {
      setConversation([...conversation, { sender: 'user', text: message }]);
      setMessage('');

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

      // setConversation([...conversation, { sender: 'user', text: message }, { sender: 'bot', text: data.answer }]);
    }
  };

  return (
    // {/* {conversation.map((msg, index) => (
    //           <Typography key={index} align={msg.sender === 'user' ? 'right' : 'left'} sx={{marginY: "1rem"}}>
    //             <strong>
    //               {msg.sender === 'user' ? (
    //                 <PersonIcon sx={{ verticalAlign: 'middle', marginRight: 1 }} />
    //               ) : (
    //                 <SmartToyIcon sx={{ verticalAlign: 'middle', marginRight: 1 }} />
    //               )}
    //             </strong> {msg.text}
    //           </Typography>
    //         ))} */}
    // <Box 
    // sx={{ 
    //   width: '98vw',
    //   height: '95vh',
    //   position: 'relative',
    //   // overflow: "hidden",
    //   // margin: '1em',
    //   // padding: '2em',
    //   // border: '1px solid #ccc',
    //   // borderRadius: '8px' 
    // }}>
      // <Typography variant="h5" gutterBottom
      // sx={{
      //   marginTop: "1rem",
      //   marginLeft: "1rem"
      // }}
      // >
      //   Arduino Chatbot
      // </Typography>
      // <Box sx={{ maxHeight: '80vh', overflowY: 'auto', marginBottom: '5rem', marginX: '2rem'}}>
      //   {conversation.map((msg, index) => (
      //     <Typography key={index} align={msg.sender === 'user' ? 'right' : 'left'}>
      //       <strong>
      //         {msg.sender === 'user' ? (
      //           <PersonIcon sx={{ verticalAlign: 'middle', marginRight: 1 }} />
      //         ) : (
      //           <SmartToyIcon sx={{ verticalAlign: 'middle', marginRight: 1 }} />
      //         )}
      //         {/* {msg.sender === 'user' ? 'You' : 'Bot'}: */}
      //       </strong> {msg.text}
      //     </Typography>
      //   ))}
      // </Box>
      // <TextField
      //   value={message}
      //   onChange={(e) => setMessage(e.target.value)}
      //   label="Ask me anything about Arduino"
      //   variant="outlined"
      //   fullWidth
      //   margin="normal"
      //   sx={{ position: "absolute", bottom: 1, right: 0, width: "60rem" }}
      //   InputProps={{
      //     endAdornment: (
      //       <IconButton
      //         sx={{
      //           borderRadius: "50%", // To make the button circular
      //           width: "36px", // Adjust the size of the button
      //           height: "36px", // Adjust the size of the button
      //           padding: 0,
      //           marginRight: 1, // Space from the right edge
      //         }}
      //       >
      //         <SendIcon onClick={handleSendMessage}/>
      //       </IconButton>
      //     ),
      //   }}
    //   />
    //   {/* <Button variant="contained" color="primary" fullWidth onClick={handleSendMessage}   >
    //     Send
    //   </Button> */}
    // </Box>
    // {/* <Grid size={3} sx={{backgroundColor: "black", height: "100vh"}}></Grid> */}
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
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                // border: "1px solid #000", // Border around the Box
                borderRadius: "12px", // Rounded corners
                padding: "0.7rem", // Padding to ensure space between border and content
                width: "auto", // Automatically adjust width based on content
                maxWidth: "200px", // Automatically adjust width based on content
                marginTop: "2rem",
                backgroundColor: "#F5F6F5",
                boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.1)",
                zIndex: 10
              }}
            >
            <Grid item xs={6}>
              <Typography variant="h5"
                sx={{
                  // marginTop: "0.7rem",
                  // marginLeft: "8rem",
                  color: "#00CECB"
                }}
              >
                Arduino
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h5"
                sx={{
                  // marginTop: "0.7rem",
                  marginLeft: "0.7rem",
                }}
              >
                Chatbot
              </Typography>
            </Grid>
            </Box>
          </Grid>
          <Box 
          sx={{ 
            maxHeight: '75vh', 
            overflowY: 'auto', 
            marginBottom: '5rem', 
            marginX: '4rem', 
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
                    backgroundColor: "#E0E0E0", // Light gray background
                    padding: "0.8rem 1.2rem", // Padding inside the bubble
                    borderRadius: "1.5rem", // Rounded corners
                    maxWidth: "60%", // Prevents the bubble from being too wide
                    wordBreak: "break-word", // Ensures text wraps properly
                  }}
                  >
                    {msg.text}
                  </Box>
                  <PersonIcon sx={{ marginX: "1rem",  marginTop: "0.7rem"}} />
                </Typography>
              ) : (
                <Typography
                  key={index}
                  align="left"
                  sx={{ marginY: "1rem", display: 'flex', justifyContent: 'flex-start' }}
                >
                  <SmartToyIcon sx={{ marginX: "1rem"}} />
                  {/* <span>{msg.text}</span> */}
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
          <Grid
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
              // bottom: 10,
              // // marginLeft: "3rem",
              // // marginRight: "3rem",
              // maxWidth: "80rem",
              // borderRadius: 50,
            }}
          >
          <TextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          label="Ask me anything about Arduino"
          variant="outlined"
          fullWidth
          // margin="normal"
          sx={{
            // position: "fixed",
            // bottom: 10,
            // marginLeft: "3rem",
            // marginRight: "3rem",
            maxWidth: {
              xs: "23rem",  // Phones
              sm: "30rem",  // Tablets
              md: "50rem",  // Small laptops
              lg: "60rem",  // Desktops
              xl: "70rem",  // Large screens
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
          // InputLabelProps={{
          //   style: {
          //     marginX: "12px",  // You can also adjust label border radius if needed
          //   },
          // }}
          InputProps={{
            style: {
              backgroundColor: "white",
              marginX: "3rem",
              borderRadius: "30px",  // Set border radius here
            },
            endAdornment: (
              <IconButton
              sx={{
                borderRadius: "50%", // To make the button circular
                width: "36px", // Adjust the size of the button
                height: "36px", // Adjust the size of the button
                padding: 0,
                marginRight: 1, // Space from the right 
              }}
              >
                <SendIcon sx={{color: "#00CECB"}} onClick={handleSendMessage}/>
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
