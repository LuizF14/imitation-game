import { Skeleton, TableCell, TableRow } from "@mui/material";

export function LeaderboardSkeleton({ columns, rows = 5 }: { columns: number; rows?: number }) {
    return (
        <>
            {Array.from({ length: rows }).map((_, i) => (
                <TableRow key={i}>
                    {Array.from({ length: columns }).map((_, j) => (
                        <TableCell key={j}>
                            <Skeleton variant="text" width={j === 0 ? 40 : "80%"} sx={{ bgcolor: "rgba(255,255,255,0.05)" }} />
                        </TableCell>
                    ))}
                </TableRow>
            ))}
        </>
    );
}