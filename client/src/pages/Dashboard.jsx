import { Icon } from "@iconify/react";
import { Box, Container, LinearProgress, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import { uploadPDFAndExtractText } from "../api/uploadApi";
import { toast } from "../custom";

const Dashboard = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [uploadedChatId, setUploadedChatId] = useState(null);
  const navigate = useNavigate();

  const onDrop = (acceptedFiles) => {
    uploadPDF(acceptedFiles[0]);
  };

  const uploadPDF = async (file) => {
    setUploading(true);
    setProgress(0);

    try {
      const data = await uploadPDFAndExtractText(file, (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setProgress(percentCompleted);
      });

      setUploading(false);
      toast.success(data.message);
      setUploadedChatId(data.chatId);
      setShowOptionsModal(true);
    } catch (error) {
      toast.error(error.message);
      setUploading(false);
      setProgress(0);
    }
  };

  const handleChatOption = () => {
    navigate(`/chat/${uploadedChatId}`);
  };

  const handleInteractOption = () => {
    navigate(`/interact/${uploadedChatId}`);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
      "application/pdf": [".pdf"],
    },
    multiple: false,
  });
  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Typography component="h1" variant="h5">
            Upload PDF or Image to Extract Text
          </Typography>
        </Box>
        <Box
          {...getRootProps()}
          sx={{
            width: "100%",
            height: 320,
            display: "flex",
            borderRadius: "25px",
            cursor: "pointer",
            color: "#637381",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "rgba(145 158 171 / 0.04)",
            border: "1px dashed rgba(145 158 171 / 0.16)",
            ...(isDragActive && { opacity: 0.72 }),
            "&:hover": { opacity: 0.72 },
          }}
        >
          <input {...getInputProps()} />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              color: "#637381",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <Icon icon="eva:cloud-upload-fill" width={80} />
            <Typography variant="h4">Upload file</Typography>
          </Box>
        </Box>
        {uploading && (
          <Box sx={{ width: "100%", mt: 2 }}>
            <LinearProgress variant="determinate" value={progress} />
            <Typography variant="body2" color="textSecondary" align="center">
              {`Uploading: ${progress}%`}
            </Typography>
          </Box>
        )}
      </Box>
      
      <Dialog open={showOptionsModal} onClose={() => setShowOptionsModal(false)} sx={{ }}>
        <DialogTitle>Choose an action</DialogTitle>
        <DialogContent>
          What would you like to do with the uploaded image?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleChatOption}>Chat with Image</Button>
          <Button onClick={handleInteractOption}>Interact with Image</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard;