import { createRouter, createWebHashHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';

const validateToken = () => {
    const data = JSON.parse(localStorage.getItem('user'));
    return Date.now() < data.exp * 1000;
};

const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return token && user && validateToken();
};

const requireAuth = (to, from, next) => {
    if (!isAuthenticated()) {
        next('/login');
    } else {
        next();
    }
};

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'login', component: () => import('@/views/auth/Login.vue') },
    {
        path: '/',
        component: AppLayout,
        children: [
            { path: '/operacional/servicos', name: 'operational-services', beforeEnter: requireAuth, component: () => import('@/views/operational/Services/Services.vue') },
            { path: '/operacional/painel-de-controle', name: 'operational-control-panel', beforeEnter: requireAuth, component: () => import('@/views/operational/ControlPanel/ControlPanel.vue') },
            { path: '/operacional/agenda', name: 'operational-diary', beforeEnter: requireAuth, component: () => import('@/views/operational/Diary/Diary.vue') },
            { path: '/financeiro/painel-analitico', name: 'financial-analytical-panel', beforeEnter: requireAuth, component: () => import('@/views/financial/AnalyticalPanel/AnalyticalPanel.vue') },
            { path: '/financeiro/gerenciador', name: 'financial-manager', beforeEnter: requireAuth, component: () => import('@/views/financial/Manager/Manager.vue') },
            { path: '/definicoes/usuarios', name: 'definitions-users', beforeEnter: requireAuth, component: () => import('@/views/definitions/Users/Users.vue') },
            { path: '/definicoes/status-e-produtos', name: 'definitions-status-and-products', beforeEnter: requireAuth, component: () => import('@/views/definitions/StatusAndProducts/StatusAndProducts.vue') },
            { path: '/definicoes/funcionarios', name: 'definitions-employees', beforeEnter: requireAuth, component: () => import('@/views/definitions/Employees/Employees.vue') }
        ]
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

export default router;
