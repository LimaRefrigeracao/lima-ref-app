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
                        to: '/painel-de-controle'
                    },
                    { label: 'SERVIÇOS', icon: 'pi pi-fw pi-ticket', to: '/servicos' }
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
                        to: '/painel-analitico'
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
                items: [{ label: 'USUÁRIOS', icon: 'pi pi-fw pi-user', to: '/usuarios' }]
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
                        to: '/painel-de-controle'
                    },
                    { label: 'SERVIÇOS', icon: 'pi pi-fw pi-ticket', to: '/servicos' }
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
