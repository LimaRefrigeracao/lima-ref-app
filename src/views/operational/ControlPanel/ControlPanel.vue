<script setup>
import CardsInfoServicesGeneral from './components/CardsInfoServicesGeneral.vue';
import CardInfoServiceByProducts from './components/CardInfoServiceByProducts.vue';
import CardInfoServiceByStatus from './components/CardInfoServiceByStatus.vue';
import CardInfoServicePerformance from './components/CardInfoServicePerformance.vue';
</script>

<template>
    <div class="grid">
        <CardsInfoServicesGeneral />

        <div class="col-12 xl:col-4">
            <CardInfoServiceByStatus />
        </div>

        <div class="col-12 xl:col-4">
            <CardInfoServiceByProducts />
        </div>

        <!-- <div class="col-12 xl:col-4">
            <CardInfoServiceByProducts />
        </div> -->

        <div class="col-12 xl:col-12">
            <CardInfoServicePerformance />
        </div>
    </div>
</template>
