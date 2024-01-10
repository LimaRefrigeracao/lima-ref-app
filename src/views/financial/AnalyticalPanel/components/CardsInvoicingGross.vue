<script setup>
import Axios from '@/service/Axios';
import { ref, onBeforeMount } from 'vue';
import { loadingOpen, loadingClose } from '../../../utils/computeds';
import { useToast } from 'primevue/usetoast';
const toast = useToast();

const dataEarnings = ref({
    daily: {
        value: 0,
        day: ''
    },
    weekly: {
        value: 0,
        week: ''
    },
    monthly: {
        value: 0,
        month: ''
    },
    yearly: {
        value: 0,
        year: ''
    }
});
const getInfoEarnings = async () => {
    loadingOpen();
    try {
        const response = await Axios.get('/panel_analytical/info_values_os_paid');
        dataEarnings.value = response.data;

        loadingClose();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao buscar informações das entrada!', life: 5000 });
        console.error(error);
        loadingClose();
    }
};

onBeforeMount(() => {
    getInfoEarnings();
});
</script>
<template>
    <div class="grid">
        <div class="col-12 lg:col-6 xl:col-3">
            <Card v-if="dataEarnings.daily.value !== null">
                <template #header>
                    <Toolbar>
                        <template #start>
                            <span class="block text-700 font-medium mb-2 mt-2"> DIÁRIO <i class="pi pi-sign-in" style="font-size: 14px; color: #16a704"></i> </span>
                        </template>
                        <template #end>
                            <span class="text-green-500 font-medium"> {{ dataEarnings.daily.day }} </span>
                        </template>
                    </Toolbar>
                </template>
                <template #content>
                    <div class="flex justify-content-center align-items-center">
                        <div class="text-900 font-medium text-xl">R$ {{ dataEarnings.daily.value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</div>
                    </div>
                </template>
            </Card>
        </div>
        <div class="col-12 lg:col-6 xl:col-3">
            <Card v-if="dataEarnings.weekly.value !== null">
                <template #header>
                    <Toolbar>
                        <template #start>
                            <span class="block text-700 font-medium mb-2 mt-2"> SEMANAL <i class="pi pi-sign-in" style="font-size: 14px; color: #16a704"></i> </span>
                        </template>
                        <template #end>
                            <span class="text-green-500 font-medium"> {{ dataEarnings.weekly.week }}</span>
                        </template>
                    </Toolbar>
                </template>
                <template #content>
                    <div class="flex justify-content-center align-items-center">
                        <div class="text-900 font-medium text-xl">R$ {{ dataEarnings.weekly.value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</div>
                    </div>
                </template>
            </Card>
        </div>
        <div class="col-12 lg:col-6 xl:col-3">
            <Card v-if="dataEarnings.monthly.value !== null">
                <template #header>
                    <Toolbar>
                        <template #start>
                            <span class="block text-700 font-medium mb-2 mt-2"> MENSAL <i class="pi pi-sign-in" style="font-size: 14px; color: #16a704"></i> </span>
                        </template>
                        <template #end>
                            <span class="text-green-500 font-medium"> {{ dataEarnings.monthly.month }} </span>
                        </template>
                    </Toolbar>
                </template>
                <template #content>
                    <div class="flex justify-content-center align-items-center">
                        <div class="text-900 font-medium text-xl">R$ {{ dataEarnings.monthly.value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</div>
                    </div>
                </template>
            </Card>
        </div>
        <div class="col-12 lg:col-6 xl:col-3">
            <Card v-if="dataEarnings.yearly.value !== null">
                <template #header>
                    <Toolbar>
                        <template #start>
                            <span class="block text-700 font-medium mb-2 mt-2"> ANUAL <i class="pi pi-sign-in" style="font-size: 14px; color: #16a704"></i> </span>
                        </template>
                        <template #end>
                            <span class="text-green-500 font-medium"> {{ dataEarnings.yearly.year }} </span>
                        </template>
                    </Toolbar>
                </template>
                <template #content>
                    <div class="flex justify-content-center align-items-center">
                        <div class="text-900 font-medium text-xl">R$ {{ dataEarnings.yearly.value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</div>
                    </div>
                </template>
            </Card>
        </div>
    </div>
</template>
