<script setup>
import { ref, inject, onMounted } from 'vue';
import Axios from '@/service/Axios';
import { loadingOpen, loadingClose, useToast } from '@/views/common';

const toast = useToast();
const visibleDialogAdd = inject('visibleDialogAdd');

const dataDialogAddExpenses = ref({});

const expenseTypes = ref([
    { name: 'Peça', code: 'P' },
    { name: 'Salário', code: 'S' },
    { name: 'Aluguel', code: 'A' },
    { name: 'Gasolina', code: 'G' },
    { name: 'Veículo', code: 'V' },
    { name: 'Feramenta', code: 'F' },
    { name: 'Pessoal', code: 'PS' },
    { name: 'Emergência', code: 'E' },
    { name: 'Outro', code: 'O' }
]);

const postAddExpenseValidate = () => {
    if (dataDialogAddExpenses.value.date && dataDialogAddExpenses.value.type && dataDialogAddExpenses.value.description && dataDialogAddExpenses.value.value) {
        visibleDialogAdd.value = false;
        console.log(dataDialogAddExpenses);
        postAddExpense();
    } else {
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Todos os campos são obrigatórios.', life: 8000 });
    }
};

const postAddExpense = async () => {
    loadingOpen();
    try {
        const response = await Axios.post('/expenses', {
            date: dataDialogAddExpenses.value.date,
            type: dataDialogAddExpenses.value.type.name,
            description: dataDialogAddExpenses.value.description,
            value: dataDialogAddExpenses.value.value
        });
        console.log(response.data);
        loadingClose();
        toast.add({ severity: 'success', summary: 'Adicionado', detail: 'Despesa cadastrada com sucesso!', life: 8000 });
        dataDialogAddExpenses.value = {};
    } catch (error) {
        loadingClose();
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao tentar cadastrar despesa.', life: 8000 });
    }
};

onMounted(() => {
    const dataAtual = new Date().toISOString().slice(0, 10);
    dataDialogAddExpenses.value.date = dataAtual;
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
