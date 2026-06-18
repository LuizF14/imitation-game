import { Box, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { leaderboardStyles } from "../../../features/leaderboard/styles/Leaderboard.styles";
import type { LeaderboardColumn } from "../../../features/leaderboard/types/LeaderboardColumn";
import { LeaderboardSkeleton } from "./LeaderboardSkeletion";
import { useTranslation } from "react-i18next";

export interface LeaderboardProps<T> {
    columns: LeaderboardColumn<T>[];
    rows: T[];
    rowKey: (row: T) => string | number;
    loading?: boolean;
    emptyMessage?: string;
}

export function Leaderboard<T>({columns, rows, rowKey, loading, emptyMessage}: LeaderboardProps<T>) {
    const {t} = useTranslation();
    return (
         <Box>
            <TableContainer component={Paper} sx={leaderboardStyles.tableContainer} >
                <Table>
                    <TableHead>
                        <TableRow sx={leaderboardStyles.tableHeadRow} >
                            <TableCell sx={{ width: 60 }}>
                                <Typography variant="caption" sx={leaderboardStyles.columnTitle}>
                                    RANK
                                </Typography>
                            </TableCell>
 
                            {columns.map((col) => (
                                <TableCell key={String(col.key)} align={col.align ?? "left"}>
                                    <Typography variant="caption" sx={leaderboardStyles.columnTitle}>
                                        {t(col.label).toUpperCase()}
                                    </Typography>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
 
                    <TableBody>
                        {loading ? (<LeaderboardSkeleton columns={columns.length + 1} />) : rows.length === 0 ? 
                            (<TableRow>
                                <TableCell colSpan={columns.length + 1} align="center" sx={{ py: 6, borderColor: "divider" }}>
                                    <Typography variant="body2" sx={{ color: "text.disabled" }}>
                                        {emptyMessage}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            rows.map((row, index) => {
                                const globalRank = index + 1;
 
                                return (
                                    <TableRow key={rowKey(row)} sx={leaderboardStyles.tableRow} >
                                        <TableCell sx={{ width: 60 }}>
                                            <Stack direction="row" sx={{alignItems: "center"}} spacing={1}>
                                                <Typography variant="body2" sx={leaderboardStyles.rank}>
                                                    {String(globalRank).padStart(2, "0")}
                                                </Typography>
                                            </Stack>
                                        </TableCell>
 
                                        {columns.map((col) => (
                                            <TableCell key={String(col.key)} align={col.align ?? "left"}>
                                                {col.render ? col.render(row, globalRank) : (
                                                        <Typography variant="body2" sx={{ color: "text.primary", fontSize: "0.875rem" }}>
                                                            {String((row as any)[col.key] ?? "—")}
                                                        </Typography>
                                                    )
                                                }
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}