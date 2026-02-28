<script setup>
import { useUserForm } from '../composables/useUserForm';
import { messageAddUser } from '../../../utils/messages.js';

const props = defineProps({
    getUsers: { type: Function, required: true }
});

const { dataPostUser, displayModalAdd, openModalAdd, closeModal, customBase64Uploader, validatePostUser } = useUserForm(props.getUsers);

defineExpose({ open: openModalAdd });
</script>

<template>
    <Dialog header="Adicionar Usuário" v-model:visible="displayModalAdd" position="top" :breakpoints="{ '960px': '75vw' }" :style="{ width: '28vw' }" :modal="true">
        <transition-group tag="div">
            <Message v-for="msg of messageAddUser" :severity="msg.severity" :key="msg.content">{{ msg.content }}</Message>
        </transition-group>
        <div class="grid p-fluid mt-1">
            <div class="field col-12 md:col-6">
                <span class="p-float-label">
                    <InputText type="text" id="addUsername" v-model="dataPostUser.username" />
                    <label for="addUsername"><span style="color: red">*</span> Nome de Usuário </label>
                </span>
            </div>
            <div class="field col-12 md:col-6">
                <span class="p-float-label">
                    <InputText type="text" id="addEmail" v-model="dataPostUser.email" />
                    <label for="addEmail"> <span style="color: red">*</span> Email </label>
                </span>
            </div>
            <div class="field col-12 md:col-6">
                <span class="p-float-label">
                    <Password id="addPassword" v-model="dataPostUser.password" toggleMask :feedback="false" />
                    <label for="addPassword"> <span style="color: red">*</span> Senha </label>
                </span>
            </div>
            <div class="field col-12 md:col-6">
                <span class="p-float-label">
                    <Password id="addConfirmPassword" v-model="dataPostUser.confirmPassword" toggleMask :feedback="false" />
                    <label for="addConfirmPassword"> <span style="color: red">*</span> Confirmar Senha </label>
                </span>
            </div>
            <div class="field col-12 md:col-6">
                <span class="p-float-label">
                    <FileUpload id="addSignature" mode="basic" url="/api/upload" accept="image/*" customUpload @uploader="customBase64Uploader" chooseLabel="Assinatura" />
                </span>
            </div>
            <div class="field col-12 md:col-6">
                <span class="p-float-label">
                    <Checkbox id="addAdmin" v-model="dataPostUser.admin" :binary="true" />
                    <label for="addAdmin" style="margin-left: 20px"> Administrador</label>
                </span>
            </div>
        </div>
        <template #footer>
            <Button label="Cancelar" icon="pi pi-times" class="p-button-danger" @click="closeModal()" />
            <Button label="Adicionar" icon="pi pi-check" class="p-button-success" @click="validatePostUser()" />
        </template>
    </Dialog>
</template>
