import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";

import { Avatar, Box, Stack, Typography } from "@mui/material";
import type { Message } from "../types/Message";
import { messageBubbleStyles } from "../styles/MessageBubble.styles";

interface Props {
    msg: Message;
}

function formatTimestamp(date: Date) {
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

export function MessageBubble({msg} : Props) {
    return (
        <Box key={msg.id} sx={msg.from === "me" ? messageBubbleStyles.containerMe : messageBubbleStyles.containerOpp} >
            <Stack direction={msg.from === "me" ? "row-reverse" : "row"} spacing={1} sx={messageBubbleStyles.mainStack} >
                <Avatar sx={msg.from === "me" ? messageBubbleStyles.avatarMe : messageBubbleStyles.avatarOpp} >
                    <PersonOutlinedIcon sx={{ fontSize: 14, color: msg.from === "me" ? "primary.contrastText" : "text.disabled" }} />
                </Avatar>

                <Box>
                    <Box sx={msg.from === "me" ? messageBubbleStyles.bubbleBoxMe : messageBubbleStyles.bubbleBoxOpp} >
                        <Typography variant="body2" sx={msg.from === "me" ? messageBubbleStyles.textMe : messageBubbleStyles.textOpp} >
                            {msg.text}
                        </Typography>
                    </Box>
                    <Typography variant="caption" sx={msg.from === "me" ? messageBubbleStyles.timestampMe : messageBubbleStyles.timestampOpp} >
                        {formatTimestamp(msg.timestamp)}
                    </Typography>
                </Box>
            </Stack>
        </Box>
    );
}