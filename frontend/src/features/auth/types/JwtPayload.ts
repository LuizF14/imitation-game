import type { Roles } from "../../../app/constants/rolesEnum";

export interface JwtPayload {
    id: string;
    role: Roles;
    exp: number;
}