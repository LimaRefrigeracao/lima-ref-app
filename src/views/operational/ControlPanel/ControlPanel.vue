<script setup>
import CardProductsInfo from './components/CardProductsInfo.vue';
import CardServicesPaymentInfo from './components/CardServicesPaymentInfo.vue';
</script>

<template>
    <div class="grid">
        <div class="col-12 xl:col-6">
            <CardProductsInfo />
        </div>
        <div class="col-12 xl:col-6">
            <CardServicesPaymentInfo />
        </div>
    </div>
</template>
