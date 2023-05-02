import { styled } from "@mui/material/styles";
import { Link as LinkRouter } from "react-router-dom";

export const StyledLinkRouter = styled(LinkRouter)(({ theme }) => ({
    all: 'unset',
    cursor: 'pointer',
    ":hover": {
        textDecoration: 'underline'
    }
}))

export const UnstyledLinkRouter = styled(LinkRouter)(({ theme }) => ({
    all: 'unset',
    cursor: 'pointer'
}))