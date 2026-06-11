import { ThemeProvider } from "@emotion/react";
import { mainTheme } from "../../../app/themes/mainTheme";
import { Navbar } from "../../../shared/components/Navbar";
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