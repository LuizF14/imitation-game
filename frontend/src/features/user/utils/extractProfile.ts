import { APP_ROUTES } from "../../../app/router/appRoutes";

export function extractProfile(data: any, isLoading: any) {
    return {
        name: data?.data.username ?? "",
        route: APP_ROUTES.USER_PROFILE,
        loading: isLoading
    };
}