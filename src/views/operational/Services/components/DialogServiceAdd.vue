<script setup>
import { onMounted } from 'vue';
import { useDialogServiceAdd } from '../composables/useDialogServiceAdd';

const { displayModalAdd, dataPostService, statusServiceMapping, typesProductOptions, messageAddService, getStatusService, getTypesProduct, validatePostService, closeModal, initDate } = useDialogServiceAdd();

onMounted(() => {
    getTypesProduct();
    getStatusService();
    initDate();
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
