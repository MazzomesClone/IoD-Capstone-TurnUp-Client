import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Link as LinkRouter, useNavigate } from 'react-router-dom'
import { useSignupPage } from '../context/UserContext';
import { useEffect, useMemo, useRef } from 'react';
import { useFormControl } from '../hooks/useFormControl';

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="/">
                TurnUp
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

export default function SignUp() {

    const navigate = useNavigate()
    const goBack = () => navigate(-1)

    const { handleSignup, signupMsg, resetSignupMsg } = useSignupPage()

    useEffect(() => {
        return resetSignupMsg
    }, [])

    let { current: submitDisable } = useRef(false)

    const { inputProps: pw1Props } = useFormControl('')
    const { inputProps: pw2Props } = useFormControl('')

    const pwError = useMemo(() => {
        if (pw2Props.value === '' || pw1Props.value === pw2Props.value) {
            submitDisable = false
            return false
        }
        submitDisable = true
        return true
    }, [pw1Props.value, pw2Props.value])

    return (
        <>
            <Button onClick={goBack}
                sx={{
                    position: 'absolute',
                    top: 15,
                    right: 15
                }}
                startIcon={<ArrowBackIcon />}
                variant='contained'
            >
                Back
            </Button>
            <Container component="main" maxWidth="xs">
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography fontFamily='Pacifico' component="h1" fontSize='2em'>
                        Sign up to TurnUp
                    </Typography>
                    <Box component="form" onSubmit={handleSignup} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="given-name"
                                    name="firstName"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    autoComplete="family-name"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    type='email'
                                    autoComplete="email"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                    {...pw1Props}
                                    error={pwError}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password2"
                                    label="Re-enter password"
                                    type="password"
                                    id="password2"
                                    autoComplete="new-password"
                                    {...pw2Props}
                                    error={pwError}
                                    helperText={pwError && "Passwords don't match"}
                                />
                            </Grid>
                        </Grid>
                        <Typography color={signupMsg.color} sx={{ mt: 2, mb: 1 }}>{signupMsg.msg}</Typography>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mb: 2 }}
                            disabled={submitDisable}
                        >
                            Sign Up
                        </Button>
                        <Grid container justifyContent="flex-start">
                            <Grid item>
                                <Link variant="body2" component={LinkRouter} to='/signin' replace>
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 5 }} />
            </Container>
        </>
    );
}