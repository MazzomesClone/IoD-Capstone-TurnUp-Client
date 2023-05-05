import { matchPath, useLocation } from "react-router-dom"

export function useRouteMatch(TabPack) {
    const { pathname } = useLocation()
    const { pageRoute, routePathsAndComponents } = TabPack

    for (const route of routePathsAndComponents) {
        const match = matchPath(`${pageRoute}/${route.path}`, pathname)
        if (match) return route.path
    }

    return routePathsAndComponents[0].path
}