import { AppBar, Typography } from "@mui/material";
import {Container, Toolbar} from "@mui/material";
import PsychologyIcon from '@mui/icons-material/Psychology';

export function Navbar() {
    return (
        <AppBar position="static" elevation={0} sx={{
            backgroundColor: "background.paper", 
            borderBottom: "1px solid",
            borderColor: "divider"
        }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="#"
                        sx={{
                            mr: 4,
                            display: { xs: "none", md: "flex" },
                            alignItems: "center",       
                            gap: 1.2,                   
                            fontFamily: '"Ibarra Real Nova", serif',
                            fontWeight: 600,
                            color: "text.primary",
                            textDecoration: "none",
                        }}
                        >
                            <PsychologyIcon color="primary" sx={{ fontSize: "1.8rem" }} />
                            Imitation Game
                        </Typography>

                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="#"
                        sx={{
                            mr: 2,
                            display: { xs: "flex", md: "none" },
                            flexGrow: 1,
                            alignItems: "center",       
                            gap: 1.2,  
                            fontFamily: '"Ibarra Real Nova", serif',
                            fontWeight: 600,
                            color: "text.primary",
                            textDecoration: "none",
                        }}
                    >   
                        <PsychologyIcon color="primary" sx={{ fontSize: "1.8rem" }} />
                        Imitation Game
                    </Typography>
                </Toolbar>
            </Container>
        </AppBar>
    );
}