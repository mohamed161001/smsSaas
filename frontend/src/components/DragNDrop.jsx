import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AddRounded from '@mui/icons-material/AddRounded';
import Alert from '@mui/material/Alert';
import FileUploadRoundedIcon from '@mui/icons-material/FileUploadRounded';
import AttachFileRoundedIcon from '@mui/icons-material/AttachFileRounded';
import { styled } from '@mui/material/styles';

const DropzoneContainer = styled(Box)({
  border: '2px dashed #ccc',
  borderRadius: '5px',
  padding: '25px',
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'border 0.3s ease-in-out',
  '&:hover': {
    border: '2px dashed #6B7280',
  },
});

const Icon = styled(FileUploadRoundedIcon)({
  fontSize: '2rem',
  marginBottom: '8px',
  color: '#6B7280',
});

function DragNDrop({ setFile }) {
  const [fileName, setFileName] = useState(''); // State to store the file name

  const onDrop = useCallback((acceptedFiles) => {
    // Handle the dropped files here (e.g., upload or process the files)
    setFile(acceptedFiles[0]);
    setFileName(acceptedFiles[0].name); // Set the file name when a file is dropped
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: {
      // Only accept image files
      'image/*': ['.jpg', '.jpeg', '.png']
    },
    multiple: false, // Disable multiple file upload

  });

  return (
    <>
      <DropzoneContainer
        {...getRootProps()}
        bgcolor={
          isDragActive
            ? isDragAccept
              ? 'rgba(171, 243, 54, 0.2)'
              : isDragReject
              ? 'rgba(249, 87, 87, 0.2)'
              : 'transparent'
            : 'transparent'
        }
      >
        <input {...getInputProps()} />
        <Icon />
        <Typography variant="body1" sx={{ fontWeight: '600', fontSize: '0.75rem' }}>
          {isDragActive
            ? isDragAccept
              ? "Drop l'image ici"
              : "Ce type d'image n'est pas supporté"
            : 'Glissez ou cliquez pour sélectionner un fichier'}
        </Typography>
      </DropzoneContainer>
      {
        // Display the file name when a file is selected
        fileName &&
        <Box sx={{ 
          color: '#6B7280',
          fontSize: '0.8rem',
          fontWeight: '500',
          mt: '0.5rem',
          display: 'flex',

          }}>
          <AttachFileRoundedIcon sx={{ fontSize: '1rem', mr: '0.5rem' }} />
          <Typography
            variant="body1"
            sx={{ fontWeight: '600', fontSize: '0.75rem' }}
          >
            {fileName}
          </Typography>
        </Box>
      }
    </>
  );
}

export default DragNDrop;
