<script setup>
import { onBeforeMount } from 'vue';
import { useExpenses } from './composables/useExpenses';
import DialogAddExpenses from './components/DialogAddExpenses.vue';

const { visibleDialogAdd, dataGetExpenses, getExpenses, confirmDeleteExpense, formatData } = useExpenses();

onBeforeMount(() => {
    getExpenses();
});
</script>
<template>
    <Toast />
    <ConfirmPopup />
    <div class="card">
        <h5>DESPESAS</h5>

        <Toolbar class="mb-4">
            <template #start>
                <Button label="Cadastrar" icon="pi pi-sign-out" severity="warning" iconPos="left" @click="visibleDialogAdd = true" />
                <DialogAddExpenses />
            </template>
            <template #end> </template>
        </Toolbar>

        <DataTable :value="dataGetExpenses" :rowHover="true" paginator showGridlines :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 50rem">
            <Column field="id" header="#"></Column>
            <Column field="date" sortable header="Data">
                <template #body="{ data }">
                    {{ formatData(data.date) }}
                </template>
            </Column>
            <Column field="type" header="Tipo"></Column>
            <Column field="description" header="Descrição" style="width: 30%"></Column>
            <Column field="value" header="Valor">
                <template #body="{ data }"> R$ {{ parseFloat(data.value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }} </template>
            </Column>
            <Column style="width: 5%">
                <template #body="{ data }">
                    <Button @click="confirmDeleteExpense($event, data)" icon="pi pi-trash" class="ml-1 p-button-rounded p-button-danger" v-tooltip.top="'Excluir'" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>
