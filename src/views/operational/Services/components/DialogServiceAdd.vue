<script setup>
import { ref, onMounted, Axios, inject, loadingOpen, loadingClose, useToast } from '@/views/common';
import { statusServiceMapping, typesProductOptions } from '../../../utils/computeds.js';
import { messageAddService, addMessage } from '../../../utils/messages.js';

const toast = useToast();
const displayModalAdd = inject('displayDialogAdd');
const dataPostService = ref({});

const validatePostService = async () => {
    if (!dataPostService.value.product || !dataPostService.value.client || !dataPostService.value.telephone || !dataPostService.value.status.cod) {
        addMessage('addService', 'error', 'Preencha todos os campos obrigatórios.');
    } else {
        postService();
    }
};

const postService = async () => {
    loadingOpen();
    try {
        const response = await Axios.post('/services', {
            product: dataPostService.value.product,
            client: dataPostService.value.client,
            telephone: dataPostService.value.telephone,
            adress: dataPostService.value.adress,
            status: dataPostService.value.status.cod,
            observation: dataPostService.value.observation,
            created_at: dataPostService.value.created_at,
            typeTable: 1
        });
        toast.add({ severity: 'success', summary: 'Adicionado', detail: 'Serviço adicionado com sucesso', life: 5000 });
        console.log(response.status);
        closeModal();
        loadingClose();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao adicionar serviço', life: 5000 });
        console.error(error);
        loadingClose();
    }
};

const closeModal = () => {
    if (displayModalAdd.value == true) {
        messageAddService.value.length = 0;
        displayModalAdd.value = false;
        dataPostService.value.product = '';
        dataPostService.value.client = '';
        dataPostService.value.telephone = '';
        dataPostService.value.adress = '';
        dataPostService.value.status = '';
        dataPostService.value.observation = '';
    }
};

onMounted(() => {
    const dataAtual = new Date().toISOString().slice(0, 10);
    dataPostService.value.created_at = dataAtual;
});
</script>
<template>
    <Dialog header="Adicionar Serviço" v-model:visible="displayModalAdd" position="top" :breakpoints="{ '960px': '75vw' }" :style="{ width: '50vw' }" :modal="true">
        <transition-group tag="div">
            <Message v-for="msg of messageAddService" :severity="msg.severity" :key="msg.content">{{ msg.content }}</Message>
        </transition-group>
        <div class="grid p-fluid mt-1">
            <div class="field col-12 md:col-4">
                <span class="p-float-label">
                    <Dropdown id="addProduct" :options="typesProductOptions" v-model="dataPostService.product" />
                    <label for="addProduct"><span style="color: red">*</span> Produto</label>
                </span>
            </div>
            <div class="field col-12 md:col-4">
                <span class="p-float-label">
                    <InputText type="text" id="addClient" v-model="dataPostService.client" />
                    <label for="addClient"><span style="color: red">*</span> Cliente</label>
                </span>
            </div>
            <div class="field col-12 md:col-4">
                <span class="p-float-label">
                    <InputText t id="addTelephone" :maxlength="11" :inputStyle="{ 'text-transform': 'none' }" v-model="dataPostService.telephone" />
                    <label for="addTelephone"><span style="color: red">*</span> Telefone</label>
                </span>
            </div>
            <div class="field col-12 md:col-8">
                <span class="p-float-label">
                    <InputText type="text" id="addAdress" v-model="dataPostService.adress" />
                    <label for="addAdress">Endereço</label>
                </span>
            </div>
            <div class="field col-12 md:col-4">
                <span class="p-float-label">
                    <Dropdown id="addStatus" :options="statusServiceMapping" v-model="dataPostService.status" optionLabel="description" />
                    <label for="addStatus"><span style="color: red">*</span> Status</label>
                </span>
            </div>
            <div class="field col-12 md:col-9">
                <span class="p-float-label">
                    <Textarea inputId="addObservation" rows="1" cols="10" v-model="dataPostService.observation" />
                    <label for="addObservation">Observação</label>
                </span>
            </div>
            <div class="field col-12 md:col-3">
                <span class="p-float-label">
                    <InputText type="date" v-model="dataPostService.created_at" />
                </span>
            </div>
        </div>
        <template #footer>
            <Button label="Cancelar" icon="pi pi-times" class="p-button-danger" @click="closeModal()" />
            <Button label="Adicionar" icon="pi pi-check" class="p-button-success" @click="validatePostService()" />
        </template>
    </Dialog>
</template>