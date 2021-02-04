import { DyMenuItem } from "src/framework/theme/public_api";

export const MENU_ITEMS: DyMenuItem[] = [
  {
    title: 'TEST',
    icon: 'shopping-cart-outline',
    link: '/pages/test',
  },
  // {
  //   title: '电子商务数据展示面板',
  //   icon: 'home',
  //   link: '/pages/dashboard',
  //   home: true,
  // },
  {
    title: '物联网数据展示面板',
    icon: 'home-outline',
    link: '/pages/iot-dashboard',
    home: true,
  },
  {
    title: '特性模块',
    group: true,
  },
  {
    title: '布局',
    icon: 'layout-outline',
    children: [
      {
        title: '步进器',
        icon: 'bulb',
        link: '/pages/layout/stepper',
      },
      {
        title: '列表',
        icon: 'menu-outline',
        link: '/pages/layout/list',

      },
      {
        title: '无限下拉列表',
        icon: 'arrowhead-down',
        link: '/pages/layout/infinite-list',
      },
      {
        title: '手风琴',
        icon: 'award',
        link: '/pages/layout/accordion',
      },
      {
        title: '选项卡',
        icon: 'code',
        pathMatch: 'prefix',
        link: '/pages/layout/tabs',
      },
    ],
  },
  {
    title: '表单',
    icon: 'edit-2-outline',
    children: [
      {
        title: '输入型表单',
        icon: 'more-vertical',
        link: '/pages/forms/inputs',
      },
      {
        title: '表单布局',
        icon: 'plus-circle',
        link: '/pages/forms/layouts',
      },
      {
        title: '按钮',
        icon: 'layout',
        link: '/pages/forms/buttons',
      },
      {
        title: '日期选项卡',
        icon: 'calendar-outline',
        link: '/pages/forms/datepicker',
      },
    ],
  },
  {
    title: 'UI 特色',
    icon: 'keypad-outline',
    link: '/pages/ui-features',
    children: [
      {
        title: '网格',
        icon:'grid',
        link: '/pages/ui-features/grid',
      },
      {
        title: '图标',
        icon:'pricetags',
        link: '/pages/ui-features/icons',
      },
      {
        title: '字体',
        icon:'cube',
        link: '/pages/ui-features/typography',
      },
      {
        title: '动画版搜索展示',
        icon:'search',
        link: '/pages/ui-features/search-fields',
      },
    ],
  },
  {
    title: 'Modal & Overlays',
    icon: 'browser-outline',
    children: [
      {
        title: '对话框',
        icon: 'credit-card',
        link: '/pages/modal-overlays/dialog',
      },
      {
        title: '窗口',
        icon: 'checkmark-square',
        link: '/pages/modal-overlays/window',
      },
      {
        title: '小贴士',
        icon: 'done-all',
        link: '/pages/modal-overlays/popover',
      },
      {
        title: '提示',
        icon: 'droplet',
        link: '/pages/modal-overlays/toastr',
      },
      {
        title: '工具提示',
        icon: 'move',
        link: '/pages/modal-overlays/tooltip',
      },
    ],
  },
  {
    title: '通用模块',
    icon: 'keypad',
    children: [
      {
        title: '日历',
        link: '/pages/extra-components/calendar',
        icon:'calendar',
      },
      {
        title: '进度条展示',
        link: '/pages/extra-components/progress-bar',
        icon:'activity',
      },
      {
        title: '进度圈',
        link: '/pages/extra-components/spinner',
        icon:'alert-triangle',
      },
      {
        title: '警告框',
        link: '/pages/extra-components/alert',
        icon:'alert-circle',
      },
      {
        title: '历表',
        link: '/pages/extra-components/calendar-kit',
        icon:'browser',
      },
      {
        title: '聊天',
        link: '/pages/extra-components/chat',
        icon:'message-circle',
      },
    ],
  },
  {
    title: '地图',
    icon: 'map-outline',
    children: [
      {
        title: '世界图',
        icon: 'globe',
        link: '/pages/maps/leaflet',
      },
      {
        title: '人口分布图',
        icon: 'pie-chart-2',
        link: '/pages/maps/bubble',
      },
    ],
  },
  {
    title: '图表',
    icon: 'pie-chart-outline',
    children: [
      {
        title: 'Echarts 渲染图表',
        icon: 'bar-chart-outline',
        link: '/pages/charts/echarts',
      },
      {
        title: 'Charts.js 渲染图表',
        icon: 'bar-chart-outline',
        link: '/pages/charts/chartjs',
      },
      {
        title: 'D3 渲染图表',
        icon: 'bar-chart-outline',
        link: '/pages/charts/d3',
      },
    ],
  },
  {
    title: '富文本',
    icon: 'text-outline',
    children: [
      {
        title: 'TinyMCE 富文本',
        icon: 'shield',
        link: '/pages/editors/tinymce',
      },
      {
        title: 'CKEditor 富文本',
        icon: 'shake',
        link: '/pages/editors/ckeditor',
      },
    ],
  },
  {
    title: '数据和表格展示',
    icon: 'grid-outline',
    children: [
      {
        title: '智能化表格',
        icon: 'film',
        link: '/pages/tables/smart-table',
      },
      {
        title: '树形表格',
        icon: 'sun-outline',
        link: '/pages/tables/tree-grid',
      },
    ],
  },
  {
    title: '404',
    icon: 'shuffle-2-outline',
    children: [
      {
        title: '404',
        icon: 'shuffle',
        link: '/pages/miscellaneous/404',
      },
    ],
  },
  {
    title: '权限',
    icon: 'lock-outline',
    children: [
      {
        title: '登录',
        icon: 'power-outline',
        link: '/auth/login',
      },
      {
        title: '注册',
        icon: 'star',
        link: '/auth/register',
      },
      {
        title: '密码',
        icon: 'shopping-bag',
        link: '/auth/request-password',
      },
      {
        title: '重置密码',
        icon: 'shopping-bag-outline',
        link: '/auth/reset-password',
      },
    ],
  },
];
