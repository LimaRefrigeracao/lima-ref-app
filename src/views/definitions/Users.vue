<script setup>
import { ref, onMounted } from 'vue';

onMounted(() => {});

const products = ref([{ username: 'JP', email: 'teste', admin: true }]);
</script>

<template>
    <div class="card">
        <Toolbar class="mb-4">
            <template v-slot:start>
                <div class="my-2">
                    <Button label="Adicionar" icon="pi pi-plus" class="p-button-primary mr-2" @click="openModalAdd('top')" />
                </div>
            </template>
        </Toolbar>
        <DataTable :value="products" :rowHover="true" showGridlines tableStyle="min-width: 50rem">
            <Column field="username" header="Nome de Usuário"></Column>
            <Column field="email" header="Email"></Column>
            <Column field="admin" header="Admin">
                <template #body="{ data }">
                    <Badge v-if="data" severity="success"><i class="pi pi-check mt-1"/></Badge>
                    <Badge v-else severity="warning"><i class="pi pi-times mt-1"/></Badge>
 
                </template>
            </Column>
            <Column field="" header=""> </Column>
        </DataTable>
    </div>
</template>