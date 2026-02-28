<script setup>
import { ref, onBeforeMount } from 'vue';
import { useUsers } from './composables/useUsers';
import DialogAddUser from './components/DialogAddUser.vue';

const popup = ref(null);
const dialogAddUser = ref(null);

const { dataGetUsers, getUsers, confirmDeleteUser } = useUsers();

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
                    <DialogAddUser ref="dialogAddUser" :get-users="getUsers" />
                    <Button label="Adicionar" icon="pi pi-plus" class="p-button-primary mr-2" @click="dialogAddUser.open()" />
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

