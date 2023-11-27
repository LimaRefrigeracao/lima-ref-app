<script setup>
import { ref, onMounted, Axios, loadingOpen, loadingClose, useToast } from '@/views/common';
const toast = useToast();

const data = ref({
    labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    datasets: [
        {
            label: 'Solicitados',
            data: [],
            fill: false,
            backgroundColor: '#2f4860',
            borderColor: '#2f4860',
            tension: 0.4
        },
        {
            label: 'Concluídos',
            data: [],
            fill: false,
            backgroundColor: '#06B700',
            borderColor: '#06B700',
            tension: 0.4
        },
        {
            label: 'Pagos',
            data: [],
            fill: false,
            backgroundColor: '#0FE900',
            borderColor: '#0FE900',
            tension: 0.4
        }
    ]
});
const dataLoaded = ref(false);

const getValueChat = async () => {
    loadingOpen();
    try {
        const response = await Axios.get('/panel_control/info_performace_yearly');

        data.value.datasets[0].data = response.data.requested;
        data.value.datasets[1].data = response.data.concluded;
        data.value.datasets[2].data = response.data.paid;

        dataLoaded.value = true;
        console.log(response.status);
        loadingClose();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao buscar dados', life: 5000 });
        console.error(error);
        loadingClose();
    }
};

const lineOptions = ref(null);

onMounted(() => {
    getValueChat();
});
</script>
<template>
    <Toast />
    <div class="card">
        <h6>GRÁFICO DE DESEMPENHO</h6>
        <div v-if="dataLoaded">
            <Chart type="line" height="80" :data="data" :options="lineOptions" />
        </div>
    </div>
</template>
