import AsyncCompnent from "../components/common/HighOrderComponents/AsyncComponent";

const Spot = AsyncCompnent(() => import("../modules/Spot.jsx"));
const Event = AsyncCompnent(() => import("../modules/Event.jsx"));


const ROUTES = [{
  key: '0',
  link: '/event',
  iconType: 'table',
  text: '活动/赛事',
  component: Event
}, {
  key: '1',
  link: '/spot',
  iconType: 'star',
  text: '钓场管理',
  component: Spot
}];

export { ROUTES };
