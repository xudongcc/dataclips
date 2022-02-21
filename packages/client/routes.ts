export default [
  {
    path: '/',
    component: '@/layouts/BaseLayout',
    routes: [
      {
        path: '/clips/:slug',
        component: '@/pages/clipPreview',
      },
      {
        path: '/projects/:projectId',
        component: '@/layouts/ProjectLayout',
        routes: [],
      },
    ],
  },
];
