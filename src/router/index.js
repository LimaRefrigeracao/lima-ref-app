import { createRouter, createWebHashHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';

const validateToken = async () => {
    const data = JSON.parse(localStorage.getItem('user'));
    if (Date.now() >= data.exp * 1000) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return false;
    } else {
        return true;
    }
};

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        { path: '/', redirect: '/login' },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/auth/Login.vue')
        },
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/servicos',
                    name: 'services',
                    beforeEnter(to, from, next) {
                        const token = localStorage.getItem('token');
                        const user = localStorage.getItem('user');
                        const response = validateToken();
                        if (!token || !user || !response) {
                            next('/login');
                        } else {
                            next();
                        }
                    },
                    component: () => import('@/views/operational/Services.vue')
                },
                {
                    path: '/painel-de-controle',
                    name: 'control-panel',
                    beforeEnter(to, from, next) {
                        const token = localStorage.getItem('token');
                        const user = localStorage.getItem('user');
                        const response = validateToken();
                        if (!token || !user || !response) {
                            next('/login');
                        } else {
                            next();
                        }
                    },
                    component: () => import('@/views/operational/ControlPanel.vue')
                },

                {
                    path: '/nfse',
                    name: 'nfse',
                    beforeEnter() {
                        window.open('https://www.nfse.gov.br/EmissorNacional/Login', '_blank');
                    }
                },
                {
                    path: '/painel-analitico',
                    name: 'analytical-panel',
                    beforeEnter(to, from, next) {
                        const token = localStorage.getItem('token');
                        const user = localStorage.getItem('user');
                        const response = validateToken();
                        if (!token || !user || !response) {
                            next('/login');
                        } else {
                            next();
                        }
                    },
                    component: () => import('@/views/financial/AnalyticalPanel.vue')
                },
                {
                    path: '/usuarios',
                    name: 'users',
                    beforeEnter(to, from, next) {
                        const token = localStorage.getItem('token');
                        const user = localStorage.getItem('user');
                        const response = validateToken();
                        if (!token || !user || !response) {
                            next('/login');
                        } else {
                            next();
                        }
                    },
                    component: () => import('@/views/definitions/Users.vue')
                },
                {
                    path: '/status-e-produtos',
                    name: 'status-and-products',
                    beforeEnter(to, from, next) {
                        const token = localStorage.getItem('token');
                        const user = localStorage.getItem('user');
                        const response = validateToken();
                        if (!token || !user || !response) {
                            next('/login');
                        } else {
                            next();
                        }
                    },
                    component: () => import('@/views/definitions/StatusAndProducts/StatusAndProducts.vue')
                }
            ]
        }
    ]
});

export default router;
