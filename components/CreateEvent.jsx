import { Box, Button, Container, Divider, Grid, Paper, Stack, TextField, Typography } from '@mui/material'
import PlaceIcon from '@mui/icons-material/Place';
import DeleteIcon from '@mui/icons-material/Delete';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import React, { useEffect, useState } from 'react'
import { useIsMobile } from '../hooks/useIsMobile'
import GoogleLocationPicker from './GoogleLocationPicker';
import GoogleMap from './GoogleMap';
import { useFormControl } from '../hooks/useFormControl';
import axios from 'axios';
import { useImageUpload } from '../hooks/useImageUpload';
import { useNavigate } from 'react-router-dom';

export default function CreateVenue() {

    const navigate = useNavigate()

    const isMobile = useIsMobile()

    return (
        <Container maxWidth='md'>
            <Paper sx={{ mt: 3 }}>
                <Box p={isMobile ? 3 : 1.5}>

                </Box>
            </Paper>
        </Container>
    )
}
