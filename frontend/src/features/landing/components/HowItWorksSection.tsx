import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import ForumIcon from "@mui/icons-material/Forum";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import TuneIcon from "@mui/icons-material/Tune";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

import { Box, Container, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import { howItWorksStyles } from "./HowItWorksSection.styles";

const icons = [
    <PersonSearchIcon fontSize="small" />,
    <ForumIcon fontSize="small" />,
    <TuneIcon fontSize="small" />,
    <HourglassBottomIcon fontSize="small" />,
    <EmojiEventsIcon fontSize="small" />,
];

export function HowItWorksSection() {
    const {t} = useTranslation();
    
    const steps = (t("landingPage.howItWorks.steps", { returnObjects: true }) as {
        title: string;
        description: string;
    }[]).map((step, i) => ({ ...step, icon: icons[i] }));

    return (
        <Box component="section" sx={howItWorksStyles.section}>
            <Container maxWidth="lg">
                <Box sx={{ textAlign: "center", mb: { xs: 6, md: 8 } }}>
                    <Typography variant="overline" sx={howItWorksStyles.suptitle} >
                        {t("landingPage.howItWorks.suptitle")}
                    </Typography>
                    <Typography variant="h2" sx={howItWorksStyles.title} >
                        {t("landingPage.howItWorks.title")}
                    </Typography>
                </Box>

                {/* Steps */}
                <Box sx={howItWorksStyles.stepsBox} >
                    {steps.map((step, index) => (
                        <Box key={index} sx={{...howItWorksStyles.stepBox, pb: { xs: index < steps.length - 1 ? 6 : 0, md: 0 } }} >
                            {/* Mobile Decorative Line */}
                            {index < steps.length - 1 && (
                                <Box aria-hidden sx={howItWorksStyles.mobileDecorativeLine} />
                            )}

                            {/* Icon */}
                            <Stack sx={howItWorksStyles.iconStack} >
                                <Box sx={howItWorksStyles.stepIcon} >
                                    {step.icon}
                                </Box>

                                {index < steps.length - 1 && (
                                    <Box aria-hidden sx={howItWorksStyles.desktopConnectionLine} />
                                )}
                            </Stack>

                            {/* Text */}
                            <Box>
                                <Typography variant="caption" sx={howItWorksStyles.stepNumber} >
                                    {String(index + 1).padStart(2, "0")}
                                </Typography>
                                <Typography variant="subtitle2" sx={howItWorksStyles.stepTitle} >
                                    {step.title}
                                </Typography>
                                <Typography variant="body2" sx={howItWorksStyles.stepDescription} >
                                    {step.description}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Container>
        </Box>
    );
}