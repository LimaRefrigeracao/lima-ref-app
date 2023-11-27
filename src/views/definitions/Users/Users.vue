<script setup>
import { ref, onBeforeMount, Axios, loadingOpen, loadingClose, useToast } from '@/views/common';
import { messageAddUser, addMessage } from '../../components/messages.js';
import { useConfirm } from 'primevue/useconfirm';

const popup = ref(null);
const confirmPopup = useConfirm();
const toast = useToast();

const dataPostUser = ref([]);
const dataGetUsers = ref([]);
const getUsers = async () => {
    loadingOpen();
    try {
        const response = await Axios.get('/users');
        dataGetUsers.value = response.data;
        console.log(response.status);
        loadingClose();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao buscar serviços do depósito', life: 5000 });
        loadingClose();
        console.error(error);
    }
};

const deleteUser = async (id) => {
    loadingOpen();
    try {
        const response = await Axios.delete('/users/' + id);
        toast.add({ severity: 'success', summary: 'Deletado', detail: 'Usuário deletado com sucesso', life: 5000 });
        console.log(response.status);
        await getUsers();
        loadingClose();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Erro', detail: error.response.data.msg, life: 5000 });
        console.error(error);
        loadingClose();
    }
};

const confirmDeleteUser = (event, id) => {
    confirmPopup.require({
        target: event.target,
        message: 'Deseja realmente excluir este usuário?',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        accept: () => {
            deleteUser(id);
        }
    });
};

const customBase64Uploader = async (event) => {
    const file = event.files[0];
    const reader = new FileReader();
    let blob = await fetch(file.objectURL).then((r) => r.blob());

    const targetSizeBytes = 40 * 1024;

    if (blob.size > targetSizeBytes) {
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Imagem muito grande. Max: 30KB. Para redimencionar sua imagem acesse: https://www.shutterstock.com/pt/image-resizer ', life: 8000 });
    } else {
        reader.readAsDataURL(blob);

        reader.onloadend = function () {
            const base64data = reader.result;
            dataPostUser.value.signature = base64data;
        };
    }
};

const postUser = async () => {
    loadingOpen();
    try {
        const response = await Axios.post('/users', {
            username: dataPostUser.value.username,
            email: dataPostUser.value.email,
            password: dataPostUser.value.password,
            confirmPassword: dataPostUser.value.confirmPassword,
            signature: dataPostUser.value.signature,
            admin: dataPostUser.value.admin
        });
        toast.add({ severity: 'success', summary: 'Adicionado', detail: 'Usuário adicionado com sucesso', life: 5000 });
        console.log(response.status);
        await getUsers();
        closeModal();
        loadingClose();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao adicionar usuário', life: 5000 });
        console.error(error);
        loadingClose();
    }
};

const validatePostUser = async () => {
    if (!dataPostUser.value.username || !dataPostUser.value.email || !dataPostUser.value.password || !dataPostUser.value.confirmPassword) {
        addMessage('addUser', 'error', 'Preencha todos os campos obrigatórios.');
    } else if (dataPostUser.value.password !== dataPostUser.value.confirmPassword) {
        addMessage('addUser', 'error', 'Senhas incoerentes.');
    } else {
        await postUser();
    }
};

const displayModalAdd = ref(false);
const positionModalAdd = ref(false);
const openModalAdd = (position) => {
    messageAddUser.value.length = 0;
    displayModalAdd.value = true;
    positionModalAdd.value = position;
};

const closeModal = () => {
    if (displayModalAdd.value == true) {
        displayModalAdd.value = false;
        dataPostUser.value = [];
    }
};

onBeforeMount(() => {
    getUsers();
});
</script>

<template>
    <ConfirmPopup />
    <Toast />
    <div class="card">
        <h5>USUÁRIOS</h5>
        <Toolbar class="mb-4">
            <template v-slot:start>
                <div class="my-2">
                    <Dialog header="Adicionar Usuário" v-model:visible="displayModalAdd" :position="positionModalAdd" :breakpoints="{ '960px': '75vw' }" :style="{ width: '28vw' }" :modal="true">
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
                    <Button label="Adicionar" icon="pi pi-plus" class="p-button-primary mr-2" @click="openModalAdd('top')" />
                </div>
            </template>
        </Toolbar>
        <DataTable :value="dataGetUsers" :rowHover="true" showGridlines tableStyle="min-width: 50rem">
            <Column bodyClass="text-center" field="username" header="Nome de Usuário"></Column>
            <Column bodyClass="text-center" field="email" header="Email"></Column>
            <Column bodyClass="text-center" field="admin" header="Administrador">
                <template #body="{ data }">
                    <Badge v-if="data.admin" severity="success"><i class="pi pi-check mt-1" /></Badge>
                    <Badge v-else severity="warning"><i class="pi pi-times mt-1" /></Badge>
                </template>
            </Column>
            <Column bodyClass="text-center" field="signature" header="Assinatura">
                <template #body="{ data }">
                    <Badge v-if="data.signature" severity="success"><i class="pi pi-check mt-1" /></Badge>
                    <Badge v-else severity="warning"><i class="pi pi-times mt-1" /></Badge>
                </template>
            </Column>
            <Column bodyClass="text-center">
                <template #body="{ data }">
                    <Button ref="popup" @click="confirmDeleteUser($event, data.id)" icon="pi pi-trash" class="p-button-rounded p-button-danger" v-tooltip.top="'Excluir'" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>