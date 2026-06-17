import { useNavigate } from "react-router-dom";

import { ResultModal } from "../components/ResultModal";
import { useChatSession } from "../hooks/useChatSession";
import { ChatSession } from "../components/ChatSession";
import { ShellLayout } from "../../../shared/layout/ShellLayout";
import { userTheme } from "../../../app/themes/userTheme";
import { userSidebarLinks } from "../../user/data/UserSideBarLinks";
import { APP_ROUTES } from "../../../app/router/appRoutes";

export function ChatSessionPage() {
    const navigate = useNavigate();
    const { messages, turingRate, setTuringRate, secondsLeft, sessionEnded, result, handleSend } = useChatSession();

    return (
        <ShellLayout theme={userTheme} sidebarLinks={userSidebarLinks} bottomPadding={false}>
            <ChatSession messages={messages} turingRate={turingRate} setTuringRate={setTuringRate} secondsLeft={secondsLeft} sessionEnded={sessionEnded} handleSend={handleSend} />
            
            {result && (
                <ResultModal
                    result={result}
                    turingRateGiven={turingRate}
                    onClose={() => navigate(APP_ROUTES.USER_HOME_PAGE)}
                />
            )}
        </ShellLayout>
    );
}


