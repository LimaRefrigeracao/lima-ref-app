<script setup>
import TableStatusPayment from './components/TableStatusPayment.vue';
import TableStatusServices from './components/TableStatusServices.vue';
</script>

<template>
    <ConfirmPopup />
    <Toast />
    <div class="grid p-fluid">
        <div class="field col-12 md:col-6">
            <TableStatusServices />
        </div>
        <div class="field col-12 md:col-6">
            <TableStatusPayment />
        </div>
    </div>
</template>
