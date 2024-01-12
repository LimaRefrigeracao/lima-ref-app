<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AppMenuItem from './AppMenuItem.vue';

const router = useRouter();

const logout = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    const loginPath = '/';
    window.history.replaceState({}, 'Login', loginPath);
    router.push(loginPath);
};

const data = JSON.parse(localStorage.getItem('user'));

const modelAdmin = ref([
    {
        items: [
            {
                label: 'OPERACIONAL',
                icon: 'pi pi-fw pi-wrench',
                items: [
                    {
                        label: 'PAINEL DE CONTROLE',
                        icon: 'pi pi-fw pi-chart-bar',
                        to: '/operacional/painel-de-controle'
                    },
                    { label: 'SERVIÇOS', icon: 'pi pi-fw pi-ticket', to: '/operacional/servicos' },
                    { label: 'AGENDA', icon: 'pi pi-fw pi-calendar', to: '/operacional/agenda' }
                ]
            }
        ]
    },

    {
        items: [
            {
                label: 'FINANCEIRO',
                icon: 'pi pi-fw pi-dollar',
                items: [
                    {
                        label: 'PAINEL ANALÍTICO',
                        icon: 'pi pi-fw pi-chart-line',
                        to: '/financeiro/painel-analitico'
                    },
                    {
                        label: 'GERENCIADOR',
                        icon: 'pi pi-fw pi-calculator',
                        to: '/financeiro/gerenciador'
                    },
                    { label: 'NOTAS FISCAIS', icon: 'pi pi-fw pi-file-excel', url: 'https://www.nfse.gov.br/EmissorNacional', target: '_blank' }
                ]
            }
        ]
    },

    {
        items: [
            {
                label: 'DEFINIÇÕES',
                icon: 'pi pi-fw pi-cog',
                items: [
                    { label: 'USUÁRIOS', icon: 'pi pi-fw pi-verified', to: '/definicoes/usuarios' },
                    { label: 'FUNCIONÁRIOS', icon: 'pi pi-fw pi-users', to: '/definicoes/funcionarios' },
                    { label: 'STATUS E PRODUTOS', icon: 'pi pi-fw pi-sitemap', to: '/definicoes/status-e-produtos' }
                ]
            }
        ]
    }
]);

const model = ref([
    {
        items: [
            {
                label: 'OPERACIONAL',
                icon: 'pi pi-fw pi-wrench',
                items: [
                    {
                        label: 'PAINEL DE CONTROLE',
                        icon: 'pi pi-fw pi-chart-bar',
                        to: '/operacional/painel-de-controle'
                    },
                    { label: 'SERVIÇOS', icon: 'pi pi-fw pi-ticket', to: '/operacional/servicos' }
                ]
            }
        ]
    }
]);
</script>

<template>
    <div class="sidebar">
        <ul v-if="!data.admin" class="layout-menu">
            <template v-for="(item, i) in model" :key="item">
                <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
                <li v-if="item.separator" class="menu-separator"></li>
            </template>
        </ul>
        <ul v-if="data.admin" class="layout-menu">
            <template v-for="(item, i) in modelAdmin" :key="item">
                <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
                <li v-if="item.separator" class="menu-separator"></li>
            </template>
        </ul>
    </div>
    <div style="text-align: center">
        <i class="pi pi-power-off" v-tooltip.top="'Sair'" style="cursor: pointer; font-size: 30px; color: red" @click="logout()"> </i>
    </div>
</template>

<style scoped>
.sidebar {
    display: flex;
    flex-direction: column;
    height: 90%;
}
</style>
