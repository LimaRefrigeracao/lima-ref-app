<script setup>
import Axios from '@/service/Axios';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { ref, onBeforeMount } from 'vue';

/* Datas */
const popup = ref(null);
const dataGetWarehouse = ref([]);
const filters = ref(null);
const loading = ref(null);
const productsTypes = ref(['Máquina de Lavar', 'Geladeira', 'Freezer', 'Micro-ondas', 'Air Fryer', 'Forno Elétrico', 'Tanquinho', 'Expositor', 'Outros']);
const statusPaymentOptions = ref(['0', '1', '2']);
const statusPaymentMapping = ref({
    0: 'Aberto',
    1: 'Pendente',
    2: 'Pago'
});
const statusServiceOptions = ref(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
const statusServiceMapping = ref({
    0: 'Visitar',
    1: 'Buscar',
    2: 'Na Fila',
    3: 'Mexendo',
    4: 'Orçamentado',
    5: 'Autorizado',
    6: 'Testando',
    7: 'Pronto',
    8: 'Entregar',
    9: 'Devolver',
    10: 'Concluído'
});
const toast = useToast();
const confirmPopup = useConfirm();

/* Requests */
const getWarehouse = async () => {
    try {
        const response = await Axios.get('/services/warehouse');
        dataGetWarehouse.value = response.data;
        console.error(response.data);
        initFilters();
    } catch (error) {
        console.error(error);
    }
};
const deleteService = async (idService) => {
    try {
        const response = await Axios.delete('/services/' + idService);
        toast.add({ severity: 'success', summary: 'Deletado', detail: 'Serviço deletado com sucesso', life: 5000 });
        console.log(response.status);
        await getWarehouse();
    } catch (error) {
        toast.add({ severity: 'danger', summary: 'Erro', detail: 'Erro ao deletar serviço', life: 5000 });
        console.error(error);
    }
};
const updateWarehouse = async (id) => {
    try {
        const response = await Axios.put('/services/warehouse/' + id + '/true');
        toast.add({ severity: 'success', summary: 'Enviado', detail: 'Serviço enviado de volta', life: 5000 });
        console.log(response.status);
        await getWarehouse();
    } catch (error) {
        toast.add({ severity: 'danger', summary: 'Erro', detail: 'Erro ao enviar serviço de volta', life: 5000 });
        console.error(error);
    }
};

const getStatusServiceLabel = (status) => {
    return statusServiceMapping.value[status] || status;
};
const getStatusPaymentLabel = (status) => {
    return statusPaymentMapping.value[status] || status;
};
const getStatusPaymentClass = (status) => {
    switch (status) {
        case 0:
            return 'info';
        case 1:
            return 'warning';
        case 2:
            return 'success';
        default:
            return '';
    }
};
const getStatusServiceClass = (status) => {
    switch (status) {
        case 0:
            return 'info';
        case 1:
            return 'info';
        case 2:
            return 'info';
        case 3:
            return 'warning';
        case 4:
            return 'warning';
        case 5:
            return 'warning';
        case 6:
            return 'warning';
        case 7:
            return 'success';
        case 8:
            return 'success';
        case 9:
            return 'success';
        case 10:
            return 'success';
        default:
            return '';
    }
};
const confirmDelete = (event, idService) => {
    confirmPopup.require({
        target: event.target,
        message: 'Deseja realmente excluir este serviço?',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        accept: () => {
            deleteService(idService);
        }
    });
};
const confirmUpdateWarehouse = (event, idService) => {
    confirmPopup.require({
        target: event.target,
        message: 'Deseja levar este serviço de volta?',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        accept: () => {
            updateWarehouse(idService);
        }
    });
};
const initFilters = () => {
    filters.value = {
        order_of_service: { value: null },
        product: { value: null },
        client: { value: null },
        telephone: { value: null },
        adress: { value: null },
        status: { value: null },
        payment_status: { value: null },
        observation: { value: null },
        created_at: { value: null },
        created_at_warehouse: { value: null },
    };
};
const clearFilter = () => {
    initFilters();
};
const formatData = (dataString) => {
    const partes = dataString.split('-');
    if (partes.length !== 3) {
        return 'Data inválida';
    }
    const ano = partes[0].substring(2);
    const mes = partes[1];
    const dia = partes[2];
    return `${dia}/${mes}/${ano}`;
};

onBeforeMount(() => {
    getWarehouse();
});

</script>

<template>
    <ConfirmPopup />
    <Toast />
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5>DEPÓSITO</h5>
                <Toolbar class="mb-4">
                    <template v-slot:end>
                        <div class="flex justify-content-between flex-column sm:flex-row">
                            <Button type="button" icon="pi pi-filter-slash" label="Limpar filtros" class="p-button-outlined mb-2 mr-2" @click="clearFilter()" />
                        </div>
                    </template>
                </Toolbar>
                <DataTable
                    :value="dataGetWarehouse"
                    :paginator="true"
                    class="p-datatable-gridlines"
                    :rows="10"
                    dataKey="id"
                    :rowHover="true"
                    v-model:filters="filters"
                    filterDisplay="menu"
                    :loading="loading"
                    :filters="filters"
                    responsiveLayout="scroll"
                    :globalFilterFields="['order_fo_service', 'created_at_warehouse', 'product', 'client', 'telephone', 'created_at', 'status', 'payment_status']"
                    :filterLocale="filterLocale"
                >
                    <template #empty> Not found data </template>
                    <template #loading> Loading customers data. Please wait. </template>

                    <Column bodyClass="text-center" filterField="order_of_service" header="OS" :showFilterMatchModes="false" dataType="numeric">
                        <template #body="{ data }">
                            <a href="">
                                <Chip :label="data.order_of_service" v-tooltip.top="'Visualizar orçamento'" />
                            </a>
                        </template>
                        <template #filter="{ filterModel }">
                            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Código da OS" />
                        </template>
                    </Column>

                    <Column bodyClass="text-center" field="created_at_warehouse" header="D. E. Depósito" :showFilterMatchModes="false" dataType="date">
                        <template #body="{ data }">
                            {{ formatData(data.created_at_warehouse) }}
                        </template>
                        <template #filter="{ filterModel }">
                            <InputText type="date" v-model="filterModel.value" class="p-column-filter" placeholder="" />
                        </template>
                    </Column>

                    <Column bodyClass="text-center" field="created_at" header="D. Entrada" :showFilterMatchModes="false" dataType="date">
                        <template #body="{ data }">
                            {{ formatData(data.created_at) }}
                        </template>
                        <template #filter="{ filterModel }">
                            <InputText type="date" v-model="filterModel.value" class="p-column-filter" placeholder="" />
                        </template>
                    </Column>

                    <Column bodyClass="text-center" field="product" header="Produto" :showFilterMatchModes="false">
                        <template #body="{ data }">
                            {{ data.product }}
                        </template>
                        <template #filter="{ filterModel }">
                            <Dropdown v-model="filterModel.value" :options="productsTypes" placeholder="Todos" class="p-column-filter" :showClear="true">
                                <template #value="slotProps">
                                    <div v-if="slotProps.value">
                                        <Badge :value="slotProps.value" severity="primary" />
                                    </div>
                                    <span v-else>{{ slotProps.placeholder }}</span>
                                </template>
                                <template #option="slotProps">
                                    <span>{{ slotProps.option }}</span>
                                </template>
                            </Dropdown>
                        </template>
                    </Column>

                    <Column bodyClass="text-center" field="client" header="Cliente" :showFilterMatchModes="false" dataType="text">
                        <template #body="{ data }">
                            {{ data.client }}
                        </template>
                        <template #filter="{ filterModel }">
                            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Nome" />
                        </template>
                    </Column>

                    <Column bodyClass="text-center" field="telephone" header="Telefone" :showFilterMatchModes="false" dataType="text">
                        <template #body="{ data }">
                            <a :href="`https://wa.me/${data.telephone}`" target="_blank">
                                <Tag value="" severity="success" v-tooltip.top="'Abrir no Whatsapp'"> {{ data.telephone }} <i class="pi pi-whatsapp ml-1"></i> </Tag>
                            </a>
                        </template>
                        <template #filter="{ filterModel }">
                            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="" />
                        </template>
                    </Column>

                    <Column field="adress" header="Endereço" dataType="boolean" bodyClass="text-center">
                        <template #body="{ data }">
                            <a href="">
                                <i v-if="data.adress" class="text-green-500 pi pi-map-marker" v-tooltip.top="'Visualizar'"></i>
                            </a>
                            <i v-if="!data.adress" class="text-red-500 pi pi-minus"></i>
                        </template>
                        <template #filter="{ filterModel }">
                            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Endereço" />
                        </template>
                    </Column>

                    <Column bodyClass="text-center" field="status" header="Status de Serviço" :showFilterMatchModes="false">
                        <template #body="{ data }">
                            <a href="">
                                <Tag :value="getStatusServiceLabel(data.status)" :severity="getStatusServiceClass(data.status)" v-tooltip.top="'Atualizar'" />
                            </a>
                        </template>
                        <template #filter="{ filterModel }">
                            <Dropdown v-model="filterModel.value" :options="statusServiceOptions" placeholder="Todos" class="p-column-filter" :showClear="true">
                                <template #value="slotProps">
                                    <div v-if="slotProps.value">
                                        <Tag :value="getStatusServiceLabel(slotProps.value)" :severity="getStatusServiceClass(parseInt(slotProps.value))" />
                                    </div>
                                    <span v-else>{{ slotProps.placeholder }}</span>
                                </template>
                                <template #option="slotProps">
                                    <Tag :value="getStatusServiceLabel(slotProps.option)" :severity="getStatusServiceClass(parseInt(slotProps.option))" />
                                </template>
                            </Dropdown>
                        </template>
                    </Column>

                    <Column bodyClass="text-center" field="payment_status" header="Status de Pagamento" :showFilterMatchModes="false">
                        <template #body="{ data }">
                            <a href="">
                                <Tag :value="getStatusPaymentLabel(data.payment_status)" :severity="getStatusPaymentClass(data.payment_status)" v-tooltip.top="'Atualizar'" />
                            </a>
                        </template>
                        <template #filter="{ filterModel }">
                            <Dropdown v-model="filterModel.value" :options="statusPaymentOptions" placeholder="Todos" class="p-column-filter" :showClear="true">
                                <template #value="slotProps">
                                    <div v-if="slotProps.value">
                                        <Tag :value="getStatusPaymentLabel(slotProps.value)" :severity="getStatusPaymentClass(parseInt(slotProps.value))" />
                                    </div>
                                    <span v-else>{{ slotProps.placeholder }}</span>
                                </template>
                                <template #option="slotProps">
                                    <Tag :value="getStatusPaymentLabel(slotProps.option)" :severity="getStatusPaymentClass(parseInt(slotProps.option))" />
                                </template>
                            </Dropdown>
                        </template>
                    </Column>

                    <Column field="observation" header="Obs." dataType="boolean" bodyClass="text-center">
                        <template #body="{ data }">
                            <a href="">
                                <i v-if="data.observation" class="text-green-500 pi pi-tag" v-tooltip.top="'Visualizar'"></i>
                            </a>
                            <i v-if="!data.observation" class="text-yellow-500 pi pi-minus"></i>
                        </template>
                    </Column>

                    <Column bodyClass="text-center">
                        <template #body="{ data }">
                            <Button icon="pi pi-user-edit" class="p-button-rounded p-button-warning mr-2" v-tooltip.top="'Editar informações'" type="text" placeholder="Top" />
                            <Button ref="popup" @click="confirmUpdateWarehouse($event, data.id)" icon="pi pi-wrench" class="p-button-rounded p-button-info mr-2" v-tooltip.top="'Retornar para serviço'" />
                            <Button ref="popup" @click="confirmDelete($event, data.id)" icon="pi pi-trash" class="p-button-rounded p-button-danger" v-tooltip.top="'Excluir'" />
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>
