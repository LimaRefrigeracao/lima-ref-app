<script setup>
import { ref, onBeforeMount, Axios, loadingOpen, loadingClose, useToast } from '@/views/common';
const toast = useToast();

const dataInvoicing = ref({
    monthly: {
        label: '',
        entry: 0,
        exit: 0,
        totality: 0
    },
    yearly: {
        label: '',
        entry: 0,
        exit: 0,
        totality: 0
    }
});
const getInfoInvoicing = async () => {
    loadingOpen();
    try {
        const response = await Axios.get('/panel_analytical/info_invoicing_liquid');
        dataInvoicing.value = response.data;

        loadingClose();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao buscar informações das entrada!', life: 5000 });
        console.error(error);
        loadingClose();
    }
};

onBeforeMount(() => {
    getInfoInvoicing();
});
</script>
<template>
    <div class="grid">
        <div class="col-12 lg:col-6 xl:col-6">
            <Card style="padding: 0px">
                <template #header>
                    <Toolbar>
                        <template #start>
                            <span class="block text-700 font-medium mb-2 mt-2"> MENSAL </span>
                        </template>
                        <template #end>
                            <span class="text-700 font-medium" style="text-decoration: underline"> {{ dataInvoicing.monthly.label }} </span>
                        </template>
                    </Toolbar>
                </template>
                <template #content>
                    <div class="grid">
                        <div class="col-12 lg:col-6 xl:col-6" style="padding-top: 0%">
                            <Card>
                                <template #header>
                                    <Toolbar>
                                        <template #start>
                                            <span class="block text-700 font-medium mb-2 mt-2"> Entrada <i class="pi pi-sign-in" style="font-size: 14px; color: #16a704"></i> </span>
                                        </template>
                                    </Toolbar>
                                </template>
                                <template #content>
                                    <div class="flex justify-content-center align-items-center">
                                        <div class="text-green-500 font-medium text-xl">+ {{ dataInvoicing.monthly.entry.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</div>
                                    </div>
                                </template>
                            </Card>
                        </div>
                        <div class="col-12 lg:col-6 xl:col-6" style="padding-top: 0%">
                            <Card>
                                <template #header>
                                    <Toolbar>
                                        <template #start>
                                            <span class="block text-700 font-medium mb-2 mt-2"> Saída <i class="pi pi-sign-out" style="font-size: 14px; color: red"></i> </span>
                                        </template>
                                    </Toolbar>
                                </template>
                                <template #content>
                                    <div class="flex justify-content-center align-items-center">
                                        <div class="text-red-500 font-medium text-xl">- {{ dataInvoicing.monthly.exit.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</div>
                                    </div>
                                </template>
                            </Card>
                        </div>
                        <div class="col-12" style="padding-top: 0%; padding-bottom: 0%">
                            <Toolbar>
                                <template #center>
                                    <div class="block text-900 font-medium text-xl">R$ {{ dataInvoicing.monthly.totality.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</div>
                                </template>
                            </Toolbar>
                        </div>
                    </div>
                </template>
            </Card>
        </div>

        <div class="col-12 lg:col-6 xl:col-6">
            <Card style="padding: 0px">
                <template #header>
                    <Toolbar>
                        <template #start>
                            <span class="block text-700 font-medium mb-2 mt-2"> ANUAL </span>
                        </template>
                        <template #end>
                            <span class="text-700 font-medium" style="text-decoration: underline"> {{ dataInvoicing.yearly.label }} </span>
                        </template>
                    </Toolbar>
                </template>
                <template #content>
                    <div class="grid">
                        <div class="col-12 lg:col-6 xl:col-6" style="padding-top: 0%">
                            <Card>
                                <template #header>
                                    <Toolbar>
                                        <template #start>
                                            <span class="block text-700 font-medium mb-2 mt-2"> Entrada <i class="pi pi-sign-in" style="font-size: 14px; color: #16a704"></i> </span>
                                        </template>
                                    </Toolbar>
                                </template>
                                <template #content>
                                    <div class="flex justify-content-center align-items-center">
                                        <div class="text-green-500 font-medium text-xl">+ {{ dataInvoicing.yearly.entry.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</div>
                                    </div>
                                </template>
                            </Card>
                        </div>
                        <div class="col-12 lg:col-6 xl:col-6" style="padding-top: 0%">
                            <Card>
                                <template #header>
                                    <Toolbar>
                                        <template #start>
                                            <span class="block text-700 font-medium mb-2 mt-2"> Saída <i class="pi pi-sign-out" style="font-size: 14px; color: red"></i> </span>
                                        </template>
                                    </Toolbar>
                                </template>
                                <template #content>
                                    <div class="flex justify-content-center align-items-center">
                                        <div class="text-red-500 font-medium text-xl">- {{ dataInvoicing.yearly.exit.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</div>
                                    </div>
                                </template>
                            </Card>
                        </div>
                        <div class="col-12" style="padding-top: 0%; padding-bottom: 0%">
                            <Toolbar>
                                <template #center>
                                    <div class="block text-900 font-medium text-xl">R$ {{ dataInvoicing.yearly.totality.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</div>
                                </template>
                            </Toolbar>
                        </div>
                    </div>
                </template>
            </Card>
        </div>
    </div>
</template>
