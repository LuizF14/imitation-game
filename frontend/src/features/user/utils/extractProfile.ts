import { APP_ROUTES } from "../../../app/router/appRoutes";

export function extractProfile(data: any, isLoading: any, isError: any) {
    return {
        name: data?.username ?? "",
        route: APP_ROUTES.USER_PROFILE,
        loading: isLoading,
        error: isError
    };
}