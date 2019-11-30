import AsyncCompnent from "../components/common/HighOrderComponents/AsyncComponent";

const SpotHome = AsyncCompnent(() => import("../modules/spot.jsx"));
// const PageList = AsyncCompnent(() => import("../pages/PageList.jsx"));
// const PageMarker = AsyncCompnent(() => import("../pages/PageMarker.jsx"));
// const PageLabel = AsyncCompnent(() => import("../pages/PageLabel.jsx"));
// const PageSetting = AsyncCompnent(() => import("../pages/PageSetting.jsx"));

const ROUTES = [
    {
        key: '1',
        link: '/spot',
        iconType: 'home',
        text: 'Home',
        component: SpotHome
    }
];

export { ROUTES };
