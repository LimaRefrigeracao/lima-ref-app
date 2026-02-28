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
                    path: '/operacional/servicos',
                    name: 'operational-services',
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
                    component: () => import('@/views/operational/Services/Services.vue')
                },
                {
                    path: '/financeiro/painel-analitico',
                    name: 'financial-analytical-panel',
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
                    component: () => import('@/views/financial/AnalyticalPanel/AnalyticalPanel.vue')
                },
                {
                    path: '/financeiro/gerenciador',
                    name: 'financial-manager',
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
                    component: () => import('@/views/financial/Manager/Manager.vue')
                },

                {
                    path: '/definicoes/usuarios',
                    name: 'definitions-users',
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
                    component: () => import('@/views/definitions/Users/Users.vue')
                },
                {
                    path: '/definicoes/status',
                    name: 'definitions-status',
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
                    component: () => import('@/views/definitions/Status/Status.vue')
                },
                {
                    path: '/definicoes/tipos-de-produto',
                    name: 'definitions-types-products',
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
                    component: () => import('@/views/definitions/TypesProducts/TypesProducts.vue')
                }
            ]
        }
    ]
});

export default router;
