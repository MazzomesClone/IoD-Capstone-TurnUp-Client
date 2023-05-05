import Dialog from '@mui/material/Dialog'
import { useState } from 'react'

export default function useImageDialog() {
    const [imageDialogOpen, setImageDialogOpen] = useState(false)
    const handleImageDialogOpen = () => setImageDialogOpen(true)
    const handleImageDialogClose = () => setImageDialogOpen(false)

    function ImageDialog({ image }) {
        return (
            <Dialog maxWidth='lg' fullWidth onClose={handleImageDialogClose} open={imageDialogOpen}>
                <img onClick={handleImageDialogClose} src={image} alt="Primary event image" />
            </Dialog>
        )
    }

    return { ImageDialog, handleImageDialogOpen }
}