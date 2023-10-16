<script setup>
import { onMounted, ref } from 'vue';
import Axios from '../../../../service/Axios';
import { loadingOpen, loadingClose } from '../../../components/computeds.js';
import { useToast } from 'primevue/usetoast';
const toast = useToast();

const data = ref([]);

const getValueCardsGeneral = async () => {
    loadingOpen();
    try {
        const response = await Axios.get('/panel_control/info_general_service');
        data.value = response.data;
        console.log(response.status);
        loadingClose();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao buscar dados', life: 5000 });
        console.error(error);
        loadingClose();
    }
};

onMounted(() => {
    getValueCardsGeneral();
});
</script>
<template>
    <Toast />
    <div class="col-12 lg:col-6 xl:col-6">
        <div class="card mb-0">
            <div class="flex justify-content-between mb-3">
                <div>
                    <span class="block text-500 font-medium mb-3">SERVIÇOS EM ANDAMENTO</span>
                    <div class="text-900 font-medium text-xl">{{ data.service_in_progress }}</div>
                </div>
                <div class="flex align-items-center justify-content-center bg-orange-100 border-round" style="width: 3rem; height: 3rem">
                    <i class="pi pi-ticket text-orange-500 text-xl"></i>
                </div>
            </div>
            <span class="text-500" style="font-size:10px">Todos os serviços que não estão com status "Concluído".</span>
        </div>
    </div>
    <div class="col-12 lg:col-6 xl:col-6">
        <div class="card mb-0">
            <div class="flex justify-content-between mb-3">
                <div>
                    <span class="block text-500 font-medium mb-3">PAGAMENTOS EM PROCESSAMENTO</span>
                    <div class="text-900 font-medium text-xl">{{ data.payment_in_processing }}</div>
                </div>
                <div class="flex align-items-center justify-content-center bg-orange-100 border-round" style="width: 3rem; height: 3rem">
                    <i class="pi pi-money-bill text-orange-500 text-xl"></i>
                </div>
            </div>
            <span class="text-500" style="font-size:10px">Todos os pagamentos que não estão com status "Pago".</span>
        </div>
    </div>
</template>
