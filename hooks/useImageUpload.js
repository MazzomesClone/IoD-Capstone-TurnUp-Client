import { useState } from "react"

export function useImageUpload() {
    const [img, setImg] = useState({ preview: '', data: '' })

    function handleImgChange(e) {
        const file = e.target.files[0]
        const img = {
            preview: URL.createObjectURL(file),
            data: file
        }
        e.target.value = null
        setImg(img)
    }

    return { img, handleImgChange, setImg }
}