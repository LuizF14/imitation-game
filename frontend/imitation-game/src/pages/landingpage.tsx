import { ThemeProvider } from "@emotion/react";
import { mainTheme } from "../theme/mainTheme";
import { Navbar } from "../components/Navbar";
import { HeroSection } from "../components/HeroSection";
import { HowItWorksSection } from "../components/HowItWorksSection";
import { AIProviderSection } from "../components/AIProviderSection";

export function LandingPage() {
    return (
        <ThemeProvider theme={mainTheme}>
            <Navbar></Navbar>
            <HeroSection></HeroSection>
            <HowItWorksSection></HowItWorksSection>
            <AIProviderSection></AIProviderSection>
        </ThemeProvider>
    );
}