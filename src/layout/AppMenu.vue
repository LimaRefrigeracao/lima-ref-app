<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

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
                    { label: 'SERVIÇOS', icon: 'pi pi-fw pi-ticket', to: '/operacional/servicos' }
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
                    { label: 'USUÁRIOS', icon: 'pi pi-fw pi-user', to: '/definicoes/usuarios' },
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
</template>

<style lang="scss" scoped></style>
