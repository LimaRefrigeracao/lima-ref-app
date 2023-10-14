<script setup>
import { onMounted, ref, reactive } from 'vue';

const lineData = reactive({
    labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    datasets: [
        {
            label: 'Solicitações',
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            backgroundColor: '#2f4860',
            borderColor: '#2f4860',
            tension: 0.4
        },
        {
            label: 'Conclusões',
            data: [28, 48, 40, 19, 86, 27, 90],
            fill: false,
            backgroundColor: '#00bb7e',
            borderColor: '#00bb7e',
            tension: 0.4
        }
    ]
});
const lineOptions = ref(null);

onMounted(() => {});
</script>
<template>
    <div class="card">
        <h5>Gráfico de Desempenho</h5>
        <Chart type="line" height="80" :data="lineData" :options="lineOptions" />
    </div>
</template>
