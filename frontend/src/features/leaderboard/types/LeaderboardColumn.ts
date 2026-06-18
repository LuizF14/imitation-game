export interface LeaderboardColumn<T> {
    key: keyof T | string;
    label: string;
    align?: "left" | "center" | "right";
    render?: (row: T, index: number) => React.ReactNode;
}