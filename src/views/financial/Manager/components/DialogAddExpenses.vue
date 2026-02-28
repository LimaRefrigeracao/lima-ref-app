<script setup>
import { onMounted } from 'vue';
import { useDialogAddExpenses } from '../composables/useDialogAddExpenses';

const { visibleDialogAdd, expenseTypes, dataDialogAddExpenses, initDate, postAddExpenseValidate } = useDialogAddExpenses();

onMounted(() => {
    initDate();
});
</script>
<template>
    <Toast />
    <Dialog v-model:visible="visibleDialogAdd" header="Cadastrar Despesas" :style="{ width: '25rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" position="top" :modal="true" :draggable="false">
        <div class="grid p-fluid mt-1">
            <div class="field col-12 md:col-12">
                <span class="p-float-label block">
                    <InputText type="date" v-model="dataDialogAddExpenses.date" id="date" />
                    <label for="date"><span style="color: red">*</span> Data</label>
                </span>
            </div>
            <div class="field col-12 md:col-12">
                <div class="p-float-label">
                    <Dropdown v-model="dataDialogAddExpenses.type" inputId="type" :options="expenseTypes" optionLabel="name" />
                    <label for="type"><span style="color: red">*</span> Tipo</label>
                </div>
            </div>
            <div class="field col-12 md:col-12">
                <span class="p-float-label">
                    <InputText id="description" v-model="dataDialogAddExpenses.description" />
                    <label for="description"><span style="color: red">*</span> Descrição</label>
                </span>
            </div>
            <div class="field col-12 md:col-12">
                <span class="p-float-label">
                    <InputNumber id="value" v-model="dataDialogAddExpenses.value" />
                    <label for="value"><span style="color: red">*</span> Valor</label>
                </span>
            </div>
        </div>

        <template #footer>
            <Button label="Cancelar" icon="pi pi-times" class="p-button-danger" @click="visibleDialogAdd = false" />
            <Button label="Cadastrar" icon="pi pi-check" class="p-button-success" autofocus @click="postAddExpenseValidate()" />
        </template>
    </Dialog>
</template>
