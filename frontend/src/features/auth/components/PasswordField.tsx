import { useState } from "react";

import {TextField,IconButton,InputAdornment} from "@mui/material";
import type { TextFieldProps } from "@mui/material";

import {
    Visibility,
    VisibilityOff
} from "@mui/icons-material";

export function PasswordField(props: TextFieldProps) {
    const [visible, setVisible] = useState(false);

    return (
        <TextField
            {...props}
            autoComplete="current-password"
            type={visible ? "text" : "password"}
            slotProps={{
                input: {
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={() => setVisible(v => !v) } >
                                {visible ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    )
                }
            }}
        />
    );
}