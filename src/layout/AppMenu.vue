<script setup>
import { ref } from 'vue';
import AppMenuItem from './AppMenuItem.vue';


const data = JSON.parse(localStorage.getItem('user'));

const modelAdmin = ref([
    {
        items: [
            {
                label: 'Operacional',
                icon: 'pi pi-fw pi-wrench',
                items: [
                    { label: 'Serviços', icon: 'pi pi-fw pi-ticket', to: '/operacional/servicos' }
                ]
            }
        ]
    },

    {
        items: [
            {
                label: 'Financeiro',
                icon: 'pi pi-fw pi-dollar',
                items: [
                    {
                        label: 'Painel Analítico',
                        icon: 'pi pi-fw pi-chart-line',
                        to: '/financeiro/painel-analitico'
                    },
                    {
                        label: 'Gerenciador',
                        icon: 'pi pi-fw pi-calculator',
                        to: '/financeiro/gerenciador'
                    },
                    { label: 'Nota Fiscal', icon: 'pi pi-fw pi-file-excel', url: 'https://www.nfse.gov.br/EmissorNacional', target: '_blank' }
                ]
            }
        ]
    },

    {
        items: [
            {
                label: 'Definições',
                icon: 'pi pi-fw pi-cog',
                items: [
                    { label: 'Usuários', icon: 'pi pi-fw pi-user', to: '/definicoes/usuarios' },
                    { label: 'Status', icon: 'pi pi-fw pi-sitemap', to: '/definicoes/status' },
                    { label: 'Tipos de Produto', icon: 'pi pi-fw pi-box', to: '/definicoes/tipos-de-produto' }
                ]
            }
        ]
    }
]);

const model = ref([
    {
        items: [
            {
                label: 'Operacional',
                icon: 'pi pi-fw pi-wrench',
                items: [
                    { label: 'Serviços', icon: 'pi pi-fw pi-ticket', to: '/operacional/servicos' }
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
</template>

<style scoped>
.sidebar {
    display: flex;
    flex-direction: column;
    height: 90%;
}
</style>
