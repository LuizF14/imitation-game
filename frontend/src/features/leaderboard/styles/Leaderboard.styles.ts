import type { SxProps, Theme } from "@mui/material";

export const leaderboardStyles: Record<string, SxProps<Theme>> = {
    mainTitle: { color: "primary.main", letterSpacing: "0.1em", fontSize: "0.72rem" },
    mainSubtitle: { color: "text.secondary", fontSize: "0.85rem" },

    tableContainer: {
        bgcolor: "background.paper",
        backgroundImage: "none",
        border: "0.5px solid",
        borderColor: "divider",
        borderRadius: 2,
        mb: 3,
    },

    tableHeadRow: {
        "& .MuiTableCell-root": {
            borderColor: "divider",
            py: 1.5,
            bgcolor: "rgba(255,255,255,0.02)",
        },
    },

    tableRow: {
        "&:last-child .MuiTableCell-root": { border: 0 },
        "& .MuiTableCell-root": { borderColor: "divider", py: 1.75 },
        bgcolor: "transparent",
        "&:hover": { bgcolor: "rgba(255,255,255,0.02)" },
        transition: "background-color 0.15s",
    },

    rank: { color: "text.disabled", fontFamily: "monospace", minWidth: 20 },
    columnTitle: { color: "text.disabled", fontSize: "0.7rem", letterSpacing: "0.08em" },
    
    pagination: {
        "& .MuiPaginationItem-root": {
            color: "text.secondary",
            borderColor: "divider",
            "&:hover": { bgcolor: "rgba(255,255,255,0.04)" },
            "&.Mui-selected": {
                bgcolor: "primary.dark",
                color: "primary.contrastText",
                borderColor: "primary.dark",
                "&:hover": { bgcolor: "primary.main" },
            },
        },
    },


}