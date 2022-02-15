export default [
  {
    path: '/',
    component: '@/layouts/BaseLayout',
    routes: [
      {
        path: '/projects/:projectId',
        component: '@/layouts/ProjectLayout',
        routes: [
          {
            path: '/projects/:projectId/sources',
            component: '@/pages/project/dataSource/DataSourceList',
            name: '数据源',
          },
          {
            path: '/projects/:projectId/clips',
            component: '@/pages/project/dataClip/DataClipList',
            name: '数据剪辑',
          },
          {
            path: '/projects/:projectId/clips/create',
            component: '@/pages/project/dataClip/DataClipEdit',
            name: '创建数据剪辑',
          },
          {
            path: '/projects/:projectId/clips/:dataClipId',
            component: '@/pages/project/dataClip/DataClipShow',
            name: '预览数据剪辑',
          },
          {
            path: '/projects/:projectId/clips/:dataClipId/edit',
            component: '@/pages/project/dataClip/DataClipEdit',
            name: '编辑数据剪辑',
          },
        ],
      },
    ],
  },
];
