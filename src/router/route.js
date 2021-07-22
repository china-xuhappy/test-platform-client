/**

 */

import Layout from 'src/pages/layout/layout';

// 错误页面
export const errorRouter = {
  path: '/error/:code',
  name: 'error',
  meta: {
    title: 'error'
  },
  component: () =>
    import('src/pages/error/index')
};

export const reportDetailRouter = {
  path: '/reportDetail/:caseId', 
  name: 'reportDetail',
  meta: {
    title: '接口自动化测试报告明细',
  },
  component: () => import('src/pages/aotuTest/reportDetail')
};

export const uiReportDetailRouter = {
  path: '/uiReportDetail/:caseId', 
  name: 'uiReportDetail',
  meta: {
    title: 'UI自动化测试报告明细',
  },
  component: () => import('src/pages/aotuUITest/uiReportDetail')
};



export const loginRouter = {
  path: '/',
  name: 'login',
  meta: {
    title: '凹凸 -- 自动化平台'
  },
  component: () =>
    import('src/pages/user/Login')
};


export const aboutRouter = {
  path: '/about',
  name: 'about',
  meta: {
    title: '凹凸 -- 自动化平台'
  },
  component: () =>
    import('src/pages/user/about')
};



export const appRouter = [
  {
    path: '/aotuTest',
    name: 'aotuTest',
    title: '接口自动化测试',
    meta: {
      requireAuth: true
    },
    component: Layout,
    children: [
      {
        path: '/aotuTest/project', 
        title: '项目管理',
        name: 'project',
        component: () => import('src/pages/aotuTest/project')
      },
      {
        path: '/aotuTest/interface', 
        title: '接口维护',
        name: 'interface',
        component: () => import('src/pages/aotuTest/interface')
      },
      {
        path: '/aotuTest/caseGather', 
        title: '接口用例集',
        name: 'runFlow',
        component: () => import('src/pages/aotuTest/caseGather')
      },
      {
        path: '/aotuTest/reportList', 
        title: '自动化测试报告',
        name: 'reportList',
        component: () => import('src/pages/aotuTest/reportList')
      },
      {
        path: '/aotuTest/task', 
        title: '定时任务',
        name: 'templateParams',
        component: () => import('src/pages/aotuTest/task')
      },
      {
        path: '/aotuTest/interfaceHost', 
        title: '接口HOST配置',
        name: 'interfaceHost',
        component: () => import('src/pages/aotuTest/interfaceHost')
      }

      
    ]
  },
  {
    path: '/aotuTestTool',
    name: 'aotuTestTool',
    title: '接口自动化工具',
    meta: {
      requireAuth: true
    },
    component: Layout,
    children: [
      {
        path: '/aotuTestTool/templateParams', 
        title: '参数模板管理',
        name: 'templateParams',
        component: () => import('src/pages/aotuTestTool/templateParams')
      },
      {
        path: '/aotuTestTool/python', 
        title: 'Python代码',
        name: 'templateParams',
        component: () => import('src/pages/aotuTestTool/python')
      }
      ,
      {
        path: '/aotuTestTool/xmind', 
        title: 'xmind',
        name: 'templateParams',
        component: () => import('src/pages/aotuTestTool/xmind')
      }
      ,
      {
        path: '/aotuTestTool/permission', 
        title: 'permission',
        name: 'templateParams',
        component: () => import('src/pages/aotuTestTool/permission')
      }
    ]
  },
  {
    path: '/testUtils',
    name: 'testUtils',
    title: '测试工具',
    meta: {
      requireAuth: true
    },
    component: Layout,
    children: [
      {
        path: '/testUtils/orderEs', 
        title: '订单ES数据',
        name: 'orderEs',
        component: () => import('src/pages/testUtils/orderEs')
      },
      {
        path: '/testUtils/test', 
        title: '订单工具',
        name: 'test',
        component: () => import('src/pages/testUtils/test')
      }
    ]
  },
  {
    path: '/aotuUITest',
    name: 'aotuUITest',
    title: 'UI自动化',
    meta: {
      requireAuth: true
    },
    component: Layout,
    children: [
      {
        path: '/aotuUITest/devices', 
        title: '设备管理',
        name: 'devices',
        component: () => import('src/pages/aotuUITest/devices')
      },
      {
        path: '/aotuUITest/activitys', 
        title: '页面配置管理',
        name: 'activitys',
        component: () => import('src/pages/aotuUITest/activitys')
      },
      {
        path: '/aotuUITest/config', 
        title: '元素配置管理',
        name: 'config',
        component: () => import('src/pages/aotuUITest/element')
      },
      {
        path: '/aotuUITest/case', 
        title: '用例管理',
        name: 'case',
        component: () => import('src/pages/aotuUITest/case')
      },
      {
        path: '/aotuUITest/suite', 
        title: '套件管理',
        name: 'suite',
        component: () => import('src/pages/aotuUITest/suite')
      }
    ]
  }
 
];

export const routers = [
  loginRouter,
  reportDetailRouter,
  aboutRouter,
  uiReportDetailRouter,
  errorRouter,
  ...appRouter
];
