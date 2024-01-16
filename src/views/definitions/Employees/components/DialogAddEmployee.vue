<script setup>
import Axios from '@/service/Axios';
import { ref, inject } from 'vue';
import { loadingOpen, loadingClose } from '../../../utils/computeds';
import { messageAddUser, addMessage } from '../../../utils/messages.js';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const visibleDialogAdd = inject('visibleDialogAdd');
const dataPostEmployee = ref([]);

const postEmployee = async () => {
    loadingOpen();
    try {
        await Axios.post('/employees', {
            full_name: dataPostEmployee.value.full_name,
            address: dataPostEmployee.value.address,
            telephone: dataPostEmployee.value.telephone,
            cpf: dataPostEmployee.value.cpf,
            entry_date: dataPostEmployee.value.entry_date,
            payment_type: dataPostEmployee.value.payment_type,
            total_salary: dataPostEmployee.value.total_salary,
            pix_key: dataPostEmployee.value.pix_key
        });
        toast.add({ severity: 'success', summary: 'Adicionado', detail: 'Funcionário adicionado com sucesso', life: 5000 });

        visibleDialogAdd.value = false;
        loadingClose();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao adicionar funcionário', life: 5000 });
        console.error(error);
        loadingClose();
    }
};

const validatePostEmployee = async () => {
    const requiredFields = ['full_name', 'address', 'telephone', 'cpf', 'entry_date', 'payment_type', 'total_salary', 'pix_key'];
    for (const field of requiredFields) {
        if (isFieldEmpty(dataPostEmployee.value[field])) {
            addMessage('addUser', 'error', 'Preencha todos os campos obrigatórios.');
            return;
        }
    }
    await postEmployee();
};

const isFieldEmpty = (field) => {
    return !field || field.trim() === '';
};
</script>
<template>
    <Toast />
    <Dialog header="Adicionar Funcionário" v-model:visible="visibleDialogAdd" position="top" :breakpoints="{ '960px': '75vw' }" :style="{ width: '28vw' }" :modal="true">
        <transition-group tag="div">
            <Message v-for="msg of messageAddUser" :severity="msg.severity" :key="msg.content">{{ msg.content }}</Message>
        </transition-group>
        <div class="grid p-fluid mt-1">
            <div class="field col-12 md:col-6">
                <span class="p-float-label">
                    <InputText type="text" id="full-name" v-model="dataPostEmployee.full_name" />
                    <label for="full-name"><span style="color: red">*</span> Nome Completo </label>
                </span>
            </div>
            <div class="field col-12 md:col-6">
                <span class="p-float-label">
                    <InputText type="number" id="cpf" v-model="dataPostEmployee.cpf" />
                    <label for="cpf"> <span style="color: red">*</span> CPF </label>
                </span>
            </div>
            <div class="field col-12 md:col-6">
                <span class="p-float-label">
                    <InputText type="number" id="telephone" v-model="dataPostEmployee.telephone" />
                    <label for="telephone"> <span style="color: red">*</span> Telefone </label>
                </span>
            </div>
            <div class="field col-12 md:col-6">
                <span class="p-float-label">
                    <InputText type="text" id="address" v-model="dataPostEmployee.address" />
                    <label for="address"> <span style="color: red">*</span> Endereço </label>
                </span>
            </div>
            <div class="field col-12 md:col-6">
                <span class="p-float-label">
                    <InputText type="date" id="entry-date" v-model="dataPostEmployee.entry_date" />
                    <label for="entry-date"> <span style="color: red">*</span> Data de Entrada </label>
                </span>
            </div>
            <div class="field col-12 md:col-6">
                <span class="p-float-label">
                    <InputText type="text" id="payment-type" v-model="dataPostEmployee.payment_type" />
                    <label for="payment-type"> <span style="color: red">*</span> Tipo de Pagamento </label>
                </span>
            </div>
            <div class="field col-12 md:col-6">
                <span class="p-float-label">
                    <InputText type="text" id="total-salary" v-model="dataPostEmployee.total_salary" />
                    <label for="total-salary"> <span style="color: red">*</span> Salário Total </label>
                </span>
            </div>
            <div class="field col-12 md:col-6">
                <span class="p-float-label">
                    <InputText type="text" id="pix-key" v-model="dataPostEmployee.pix_key" />
                    <label for="pix-key"> <span style="color: red">*</span> Chave Pix </label>
                </span>
            </div>
        </div>
        <template #footer>
            <Button label="Cancelar" icon="pi pi-times" class="p-button-danger" @click="visibleDialogAdd = false" />
            <Button label="Adicionar" icon="pi pi-check" class="p-button-success" @click="validatePostEmployee()" />
        </template>
    </Dialog>
</template>
