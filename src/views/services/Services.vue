<script setup>
import Axios from '@/service/Axios';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { ref, onBeforeMount } from 'vue';
import { messageAddService, messageAddEstimateOS, messageEditInfoClient, messageUpdateStatusService, messageUpdateStatusPayment, addMessage } from '../components/messages.js';
import { productsTypes, statusPaymentOptions, statusServiceOptions, statusTypes, formatData, getStatusServiceLabel, getStatusPaymentLabel, getStatusPaymentClass, getStatusServiceClass, sendWhatsAppMessage } from '../components/computeds.js';

const toast = useToast();
const popup = ref(null);
const confirmPopup = useConfirm();
const loading = ref(null);
const filters = ref(null);
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
        created_at: { value: null }
    };
};
const clearFilter = () => {
    initFilters();
};

const dataGetOS = ref([]);
const getUniqueOS = async (order_of_service) => {
    try {
        const response = await Axios.get('/order_of_service/' + order_of_service);
        dataGetOS.value = response.data[0];
        return dataGetOS.value;
    } catch (error) {
        console.error(error);
    }
};
const dataGetService = ref([]);
const getServices = async () => {
    try {
        const response = await Axios.get('/services');
        dataGetService.value = response.data;
        initFilters();
    } catch (error) {
        console.error(error);
    }
};
const dataPostService = ref({});
const validatePostService = async () => {
    if (!dataPostService.value.product || !dataPostService.value.client || !dataPostService.value.telephone || !dataPostService.value.status.code) {
        addMessage('addService', 'error', 'Preencha todos os campos obrigatórios.');
    } else {
        postService();
    }
};
const postService = async () => {
    try {
        const response = await Axios.post('/services', {
            product: dataPostService.value.product,
            client: dataPostService.value.client,
            telephone: dataPostService.value.telephone,
            adress: dataPostService.value.adress,
            status: dataPostService.value.status.code,
            observation: dataPostService.value.observation
        });
        toast.add({ severity: 'success', summary: 'Adicionado', detail: 'Serviço adicionado com sucesso', life: 5000 });
        console.log(response.status);
        await getServices();
        closeModal();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao adicionar serviço', life: 5000 });
        console.error(error);
    }
};
const confirmDeleteService = (event, data) => {
    confirmPopup.require({
        target: event.target,
        message: 'Deseja realmente excluir este serviço?',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        accept: () => {
            deleteService(data.id, data.order_of_service);
        }
    });
};
const deleteService = async (idService, cod_order) => {
    try {
        const response = await Axios.delete('/services/' + idService + '/' + cod_order);
        toast.add({ severity: 'success', summary: 'Deletado', detail: 'Serviço deletado com sucesso', life: 5000 });
        console.log(response.status);
        await getServices();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao deletar serviço', life: 5000 });
        console.error(error);
    }
};
const confirmUpdateWarehouse = (event, idService) => {
    confirmPopup.require({
        target: event.target,
        message: 'Deseja enviar este serviço ao depósito?',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        accept: () => {
            updateWarehouse(idService);
        }
    });
};
const updateWarehouse = async (id) => {
    try {
        const response = await Axios.put('/services/warehouse/' + id + '/false');
        toast.add({ severity: 'success', summary: 'Enviado', detail: 'Serviço enviado ao depósito', life: 5000 });
        console.log(response.status);
        await getServices();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao enviar serviço ao depósito', life: 5000 });
        console.error(error);
    }
};
const validateEditInfoClient = async () => {
    if (!dataEditInfoClient.value.product || !dataEditInfoClient.value.client || !dataEditInfoClient.value.telephone) {
        addMessage('editInfoClient', 'error', 'Preencha todos os campos obrigatórios.', true);
    } else {
        updateInfoClient();
    }
};
const updateInfoClient = async () => {
    try {
        const response = await Axios.put('/services/info/client/' + dataEditInfoClient.value.id, {
            product: dataEditInfoClient.value.product,
            client: dataEditInfoClient.value.client,
            telephone: dataEditInfoClient.value.telephone,
            adress: dataEditInfoClient.value.adress,
            observation: dataEditInfoClient.value.observation
        });
        toast.add({ severity: 'success', summary: 'Editado', detail: 'As informações do cliente foram editadas', life: 5000 });
        console.log(response.status);
        await getServices();
        closeModal();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao editar as informações do cliente', life: 5000 });
        console.error(error);
    }
};
const validateUpdateStatusService = async () => {
    if (!dataEditStatus.value.status) {
        addMessage('updateStatusService', 'error', 'Campo obrigatório.');
    } else {
        updateStatus();
    }
};
const updateStatus = async () => {
    try {
        const response = await Axios.put('/services/status/' + dataEditStatus.value.id + '/' + dataEditStatus.value.status);
        toast.add({ severity: 'success', summary: 'Atualizado', detail: 'Status atualizado com sucesso', life: 5000 });
        console.log(response.status);
        await getServices();
        closeModal();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao atualizar o status', life: 5000 });
        console.error(error);
    }
};
const validateUpdateStatusPayment = async () => {
    if (!dataEditPaymentStatus.value.payment_status) {
        addMessage('updateStatusPayment', 'error', 'Campo obrigatório.');
    } else {
        updatePaymentStatus();
    }
};
const updatePaymentStatus = async () => {
    try {
        const response = await Axios.put('/services/status/payment/' + dataEditPaymentStatus.value.id + '/' + dataEditPaymentStatus.value.payment_status);
        toast.add({ severity: 'success', summary: 'Atualizado', detail: 'Status de pagamento atualizado com sucesso', life: 5000 });
        console.log(response.status);
        await getServices();
        closeModal();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao atualizar o status de pagamento ', life: 5000 });
        console.error(error);
    }
};
const dataPutOrderOfService = ref({});
const validateUpdateEstimateOS = async (data) => {
    if (!dataPutOrderOfService.value.amount || !dataPutOrderOfService.value.description || !dataPutOrderOfService.value.price) {
        addMessage('addEstimateOS', 'error', 'Preencha todos os campos obrigatórios.');
    } else {
        updateEstimateOS(data);
    }
};
const updateEstimateOS = async (data) => {
    try {
        const response = await Axios.put('/order_of_service/estimate/' + data.order_of_service, {
            amount: dataPutOrderOfService.value.amount,
            description: dataPutOrderOfService.value.description,
            price: dataPutOrderOfService.value.price
        });
        console.log(response.status);
        openModalOS('top', data);
        closeModal();
        toast.add({ severity: 'success', summary: 'Adicionado', detail: 'Registro de OS adicionado com sucesso', life: 5000 });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao adicionar registro de OS', life: 5000 });
        console.error(error);
    }
};
const deleteEstimateOS = async (cod, data) => {
    try {
        const response = await Axios.delete('/order_of_service/estimate/' + cod + '/' + data.id);
        toast.add({ severity: 'success', summary: 'Deletado', detail: 'Registro de OS deletado com sucesso', life: 5000 });
        console.log(response.status);
        const dataOpen = { order_of_service: cod };
        openModalOS('top', dataOpen);
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao deletar registro de OS', life: 5000 });
        console.error(error);
    }
};

const displayModalOS = ref(false);
const positionModalOS = ref(false);
const dataViewEstimateOS = ref([]);
const openModalOS = async (position, data) => {
    const dataOS = await getUniqueOS(data.order_of_service);
    if (dataOS) {
        messageAddEstimateOS.value.length = 0;
        dataViewEstimateOS.value = JSON.parse(dataOS.estimate);
        displayModalOS.value = true;
        positionModalOS.value = position;
    } else {
        toast.add({ severity: 'info', summary: 'Sem Orçamento', detail: 'Não foi encontrado o orçamento desse serviço.', life: 5000 });
    }
};
const displayModalViewObservation = ref(false);
const positionModalViewObservation = ref(false);
const dataViewObservation = ref({
    id: null,
    observation: ''
});
const openModalViewObservation = (position, data) => {
    displayModalViewObservation.value = true;
    positionModalViewObservation.value = position;
    dataViewObservation.value.id = data.id;
    dataViewObservation.value.observation = data.observation;
};
const displayModalViewAdress = ref(false);
const positionModalViewAdress = ref(false);
const dataViewAdress = ref({
    id: null,
    adress: ''
});
const openModalViewAdress = (position, data) => {
    displayModalViewAdress.value = true;
    positionModalViewAdress.value = position;
    dataViewAdress.value.id = data.id;
    dataViewAdress.value.adress = data.adress;
};
const displayModalEditPaymentStatus = ref(false);
const positionModalEditPaymentStatus = ref(false);
const dataEditPaymentStatus = ref({
    id: null,
    payment_status: null,
    label: ''
});
const openModalEditPaymentStatus = (position, data) => {
    messageUpdateStatusPayment.value.length = 0;
    displayModalEditPaymentStatus.value = true;
    positionModalEditPaymentStatus.value = position;
    dataEditPaymentStatus.value.label = getStatusPaymentLabel(data.payment_status);
    dataEditPaymentStatus.value.id = data.id;
    dataEditPaymentStatus.value.payment_status = data.payment_status;
};
const displayModalEditStatus = ref(false);
const positionModalEditStatus = ref(false);
const dataEditStatus = ref({
    id: null,
    status: null,
    label: ''
});
const openModalEditStatus = (position, data) => {
    messageUpdateStatusService.value.length = 0;
    displayModalEditStatus.value = true;
    positionModalEditStatus.value = position;
    dataEditStatus.value.label = getStatusServiceLabel(data.status);
    dataEditStatus.value.id = data.id;
    dataEditStatus.value.status = data.status;
};
const displayModalEditInfo = ref(false);
const positionModalEditInfo = ref(false);
const dataEditInfoClient = ref({});
const openModalEditInfo = (position, data) => {
    messageEditInfoClient.value.length = 0;
    displayModalEditInfo.value = true;
    positionModalEditInfo.value = position;
    dataEditInfoClient.value.id = data.id;
    dataEditInfoClient.value.product = data.product;
    dataEditInfoClient.value.client = data.client;
    dataEditInfoClient.value.telephone = data.telephone;
    dataEditInfoClient.value.adress = data.adress;
    dataEditInfoClient.value.observation = data.observation;
};
const displayModalAdd = ref(false);
const positionModalAdd = ref(false);
const openModalAdd = (position) => {
    messageAddService.value.length = 0;
    displayModalAdd.value = true;
    positionModalAdd.value = position;
};
const closeModal = () => {
    if (displayModalOS.value == true) {
        dataPutOrderOfService.value.amount = null;
        dataPutOrderOfService.value.description = '';
        dataPutOrderOfService.value.price = null;
    }
    if (displayModalEditPaymentStatus.value == true) {
        messageUpdateStatusPayment.value.length = 0;
        displayModalEditPaymentStatus.value = false;
        dataEditPaymentStatus.value.id = '';
        dataEditPaymentStatus.value.payment_status = '';
        dataEditPaymentStatus.value.label = '';
    }
    if (displayModalEditStatus.value == true) {
        messageUpdateStatusService.value.length = 0;
        displayModalEditStatus.value = false;
        dataEditStatus.value.id = '';
        dataEditStatus.value.status = '';
        dataEditStatus.value.label = '';
    }
    if (displayModalEditInfo.value == true) {
        messageEditInfoClient.value.length = 0;
        displayModalEditInfo.value = false;
        dataEditInfoClient.value.id = '';
        dataEditInfoClient.value.product = '';
        dataEditInfoClient.value.client = '';
        dataEditInfoClient.value.telephone = '';
        dataEditInfoClient.value.adress = '';
        dataEditInfoClient.value.observation = '';
    }
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

onBeforeMount(() => {
    getServices();
});
</script>

<template>
    <ConfirmPopup />
    <Toast />
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5>SERVIÇOS</h5>
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <Dialog header="Adicionar Serviço" v-model:visible="displayModalAdd" :position="positionModalAdd" :breakpoints="{ '960px': '75vw' }" :style="{ width: '50vw' }" :modal="true">
                                <transition-group tag="div">
                                    <Message v-for="msg of messageAddService" :severity="msg.severity" :key="msg.content">{{ msg.content }}</Message>
                                </transition-group>
                                <div class="grid p-fluid mt-1">
                                    <div class="field col-12 md:col-4">
                                        <span class="p-float-label">
                                            <Dropdown id="addProduct" :options="productsTypes" v-model="dataPostService.product" filter :show-clear="true"/>
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
                                            <InputMask id="addTelephone" mask="99999999999" v-model="dataPostService.telephone" />
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
                                            <Dropdown id="addStatus" :options="statusTypes" v-model="dataPostService.status" optionLabel="name" />
                                            <label for="addStatus"><span style="color: red">*</span> Status</label>
                                        </span>
                                    </div>
                                    <div class="field col-12 md:col-12">
                                        <span class="p-float-label">
                                            <Textarea inputId="addObservation" rows="1" cols="10" v-model="dataPostService.observation" />
                                            <label for="addObservation">Observação</label>
                                        </span>
                                    </div>
                                </div>
                                <template #footer>
                                    <Button label="Cancelar" icon="pi pi-times" class="p-button-danger" @click="closeModal()" />
                                    <Button label="Adicionar" icon="pi pi-check" class="p-button-success" @click="validatePostService()" />
                                </template>
                            </Dialog>
                            <Button label="Adicionar" icon="pi pi-plus" class="p-button-primary mr-2" @click="openModalAdd('top')" />
                        </div>
                    </template>
                    <template v-slot:end>
                        <div class="flex justify-content-between flex-column sm:flex-row">
                            <Button type="button" icon="pi pi-filter-slash" label="Limpar filtros" class="p-button-outlined mb-2 mr-2" @click="clearFilter()" />
                        </div>
                    </template>
                </Toolbar>
                <DataTable
                    :value="dataGetService"
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
                    :globalFilterFields="['order_of_service', 'product', 'client', 'telephone', 'created_at', 'adress', 'observation']"
                    :filterLocale="filterLocale"
                >
                    <template #empty> Not found data </template>
                    <template #loading> Loading customers data. Please wait. </template>

                    <Column bodyClass="text-center" filterField="order_of_service" header="OS" :showFilterMatchModes="false" dataType="numeric">
                        <template #body="{ data }">
                            <Dialog
                                v-if="data.order_of_service == dataGetOS.cod_order"
                                :header="`Orçamento - ( ${data.order_of_service} / ${data.product} / ${data.client} )`"
                                v-model:visible="displayModalOS"
                                :position="positionModalOS"
                                :breakpoints="{ '960px': '75vw' }"
                                :style="{ width: '50vw' }"
                                :modal="true"
                            >
                                <DataTable :value="dataViewEstimateOS" responsiveLayout="scroll" :rows="6">
                                    <template #header>
                                        <transition-group tag="div">
                                            <Message v-for="msg of messageAddEstimateOS" :severity="msg.severity" :key="msg.content">{{ msg.content }}</Message>
                                        </transition-group>
                                        <div class="grid p-fluid mt-1">
                                            <div class="field col-12 md:col-2">
                                                <span class="p-float-label">
                                                    <InputNumber id="addQuantOS" v-model="dataPutOrderOfService.amount" />
                                                    <label for="addQuantOS">
                                                        <span style="color: red">*</span>
                                                        Quantidade
                                                    </label>
                                                </span>
                                            </div>
                                            <div class="field col-12 md:col-5">
                                                <span class="p-float-label">
                                                    <InputText id="addDescriptionOS" v-model="dataPutOrderOfService.description" />
                                                    <label for="addDescriptionOS">
                                                        <span style="color: red">*</span>
                                                        Descrição
                                                    </label>
                                                </span>
                                            </div>
                                            <div class="field col-12 md:col-3">
                                                <span class="p-float-label">
                                                    <InputNumber id="addPriceOS" v-model="dataPutOrderOfService.price" />
                                                    <label for="addPriceOS">
                                                        <span style="color: red">*</span>
                                                        Preço
                                                    </label>
                                                </span>
                                            </div>
                                            <div class="field col-12 md:col-2">
                                                <Button icon="pi pi-plus" @click="validateUpdateEstimateOS(data)" v-tooltip.top="'Adicionar registro ao OS'" />
                                            </div>
                                        </div>
                                    </template>
                                    <Column field="amount" header="Quantidade">
                                        <template #body="{ data }">
                                            {{ data.amount }}
                                        </template>
                                    </Column>
                                    <Column field="description" header="Descrição">
                                        <template #body="{ data }">
                                            {{ data.description }}
                                        </template>
                                    </Column>
                                    <Column field="price" header="Preço">
                                        <template #body="{ data }">
                                            {{ data.price }}
                                        </template>
                                    </Column>
                                    <Column headerStyle="width:4rem">
                                        <template #body="{ data }">
                                            <Button icon="pi pi-trash" class="p-button-danger" @click="deleteEstimateOS(dataGetOS.cod_order, data)" v-tooltip.top="'Excluir registro da OS'" />
                                        </template>
                                    </Column>
                                    <template #footer>
                                        <div class="grid p-fluid mt-1">
                                            <div class="col-12 md:col-4">
                                                <div class="p-inputgroup">
                                                    <span class="p-inputgroup-addon"> VALOR TOTAL </span>
                                                    <span class="p-inputgroup-addon"> R$ </span>
                                                    <InputText v-model="dataGetOS.value" disabled />
                                                    <span class="p-inputgroup-addon"> .00 </span>
                                                </div>
                                            </div>
                                            <div class="col-12 md:col-4">
                                                <Button icon="pi pi-share-alt" class="p-button-success mr-2" @click="sendWhatsAppMessage(data, dataGetOS)" v-tooltip.top="'Compartilhar orçamento com o cliente'" />
                                                <Button icon="pi pi-download" class="p-button-warning" v-tooltip.top="'Gerar Recibo'" />
                                            </div>
                                        </div>
                                    </template>
                                </DataTable>
                            </Dialog>
                            <Chip :label="data.order_of_service" @click="openModalOS('top', data)" v-tooltip.top="'Visualizar/Atualizar Orçamento'" style="cursor: pointer" />
                        </template>
                        <template #filter="{ filterModel }">
                            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Código da OS" />
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
                            <Dialog v-if="data.id == dataViewAdress.id" header="Endereço" v-model:visible="displayModalViewAdress" :position="positionModalViewAdress" :breakpoints="{ '960px': '75vw' }" :style="{ width: '25vw' }" :modal="true">
                                <h6 class="line-height-3 m-0">
                                    {{ data.adress }}
                                </h6>
                                <template #footer>
                                    <Button class="p-button-rounded p-button-info mr-2 mb-2"><i class="pi pi-map-marker mr-2"></i>Abrir no Maps</Button>
                                </template>
                            </Dialog>
                            <i v-if="data.adress" @click="openModalViewAdress('top', data)" class="text-green-500 pi pi-map-marker" v-tooltip.top="'Visualizar'" style="cursor: pointer"></i>

                            <i v-if="!data.adress" class="text-red-500 pi pi-minus"></i>
                        </template>
                        <template #filter="{ filterModel }">
                            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Endereço" />
                        </template>
                    </Column>

                    <Column field="observation" header="Obs." dataType="boolean" bodyClass="text-center">
                        <template #body="{ data }">
                            <Dialog
                                v-if="data.id == dataViewObservation.id"
                                header="Observação"
                                v-model:visible="displayModalViewObservation"
                                :position="positionModalViewObservation"
                                :breakpoints="{ '960px': '75vw' }"
                                :style="{ width: '25vw' }"
                                :modal="true"
                            >
                                <h6 class="line-height-3 m-0">
                                    {{ dataViewObservation.observation }}
                                </h6>
                            </Dialog>
                            <i v-if="data.observation" @click="openModalViewObservation('top', data)" class="text-green-500 pi pi-tag" v-tooltip.top="'Visualizar'" style="cursor: pointer"></i>
                            <i v-if="!data.observation" class="text-yellow-500 pi pi-minus"></i>
                        </template>
                    </Column>

                    <Column bodyClass="text-center" field="status" header="Status de Serviço" :showFilterMatchModes="false">
                        <template #body="{ data }">
                            <Dialog
                                v-if="data.id == dataEditStatus.id"
                                header="Atualizar Status de Serviço"
                                v-model:visible="displayModalEditStatus"
                                :position="positionModalEditStatus"
                                :breakpoints="{ '960px': '75vw' }"
                                :style="{ width: '15vw' }"
                                :modal="true"
                            >
                                <transition-group tag="div">
                                    <Message v-for="msg of messageUpdateStatusService" :severity="msg.severity" :key="msg.content">{{ msg.content }}</Message>
                                </transition-group>
                                <div class="grid p-fluid mt-1">
                                    <div class="field col-12 md:col-12">
                                        <span class="p-float-label">
                                            <Dropdown id="editStatus" v-model="dataEditStatus.status" :options="statusServiceOptions" class="p-column-filter" :showClear="true" optionLabel="label">
                                                <template #value="slotProps">
                                                    <div v-if="slotProps.value">
                                                        <Tag :value="getStatusServiceLabel(parseInt(slotProps.value))" :severity="getStatusServiceClass(parseInt(slotProps.value))" />
                                                    </div>
                                                </template>
                                                <template #option="slotProps">
                                                    <Tag :value="getStatusServiceLabel(parseInt(slotProps.option))" :severity="getStatusServiceClass(parseInt(slotProps.option))" />
                                                </template>
                                            </Dropdown>

                                            <label for="editStatus"><span style="color: red">*</span>Status</label>
                                        </span>
                                    </div>
                                    <div class="col-12 md:col-12" style="text-align: center" v-if="data.updated_at_service">
                                        <strong style="font-size: 11px"> Última atualização em {{ formatData(data.updated_at_service) }} </strong>
                                    </div>
                                </div>
                                <template #footer>
                                    <Button label="Cancelar" icon="pi pi-times" class="p-button-danger" @click="closeModal()" />
                                    <Button label="Atualizar" icon="pi pi-check" class="p-button-warning" @click="validateUpdateStatusService()" />
                                </template>
                            </Dialog>
                            <Tag @click="openModalEditStatus('top', data)" :value="getStatusServiceLabel(data.status)" :severity="getStatusServiceClass(data.status)" v-tooltip.top="'Atualizar Status'" style="cursor: pointer" />
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
                            <Dialog
                                v-if="data.id == dataEditPaymentStatus.id"
                                header="Atualizar Status de Pagamento"
                                v-model:visible="displayModalEditPaymentStatus"
                                :position="positionModalEditPaymentStatus"
                                :breakpoints="{ '960px': '75vw' }"
                                :style="{ width: '15vw' }"
                                :modal="true"
                            >
                                <transition-group tag="div">
                                    <Message v-for="msg of messageUpdateStatusPayment" :severity="msg.severity" :key="msg.content">{{ msg.content }}</Message>
                                </transition-group>
                                <div class="grid p-fluid mt-1">
                                    <div class="field col-12 md:col-12">
                                        <span class="p-float-label">
                                            <Dropdown id="editPaymentStatus" v-model="dataEditPaymentStatus.payment_status" :options="statusPaymentOptions" class="p-column-filter" :showClear="true" optionLabel="label">
                                                <template #value="slotProps">
                                                    <div v-if="slotProps.value">
                                                        <Tag :value="getStatusPaymentLabel(parseInt(slotProps.value))" :severity="getStatusPaymentClass(parseInt(slotProps.value))" />
                                                    </div>
                                                </template>
                                                <template #option="slotProps">
                                                    <Tag :value="getStatusPaymentLabel(parseInt(slotProps.option))" :severity="getStatusPaymentClass(parseInt(slotProps.option))" />
                                                </template>
                                            </Dropdown>

                                            <label for="editPaymentStatus"><span style="color: red">*</span>Status</label>
                                        </span>
                                    </div>
                                    <div class="col-12 md:col-12" style="text-align: center" v-if="data.updated_at_payment">
                                        <strong style="font-size: 11px"> Última atualização em {{ formatData(data.updated_at_payment) }} </strong>
                                    </div>
                                </div>
                                <template #footer>
                                    <Button label="Cancelar" icon="pi pi-times" class="p-button-danger" @click="closeModal()" />
                                    <Button label="Atualizar" icon="pi pi-check" class="p-button-warning" @click="validateUpdateStatusPayment()" />
                                </template>
                            </Dialog>
                            <Tag
                                @click="openModalEditPaymentStatus('top', data)"
                                :value="getStatusPaymentLabel(data.payment_status)"
                                :severity="getStatusPaymentClass(data.payment_status)"
                                v-tooltip.top="'Atualizar Status de Pagamento'"
                                style="cursor: pointer"
                            />
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

                    <Column bodyClass="text-center">
                        <template #body="{ data }">
                            <Dialog
                                v-if="data.id == dataEditInfoClient.id"
                                header="Editar informações do Cliente"
                                v-model:visible="displayModalEditInfo"
                                :position="positionModalEditInfo"
                                :breakpoints="{ '960px': '75vw' }"
                                :style="{ width: '30vw' }"
                                :modal="true"
                            >
                                <transition-group tag="div">
                                    <Message v-for="msg of messageEditInfoClient" :severity="msg.severity" :key="msg.content">{{ msg.content }}</Message>
                                </transition-group>
                                <div class="grid p-fluid mt-1">
                                    <div class="field col-12 md:col-5">
                                        <span class="p-float-label">
                                            <Dropdown id="editProduct" :options="productsTypes" v-model="dataEditInfoClient.product" />
                                            <label for="editProduct"><span style="color: red">*</span> Produto</label>
                                        </span>
                                    </div>
                                    <div class="field col-12 md:col-7">
                                        <span class="p-float-label">
                                            <InputText type="text" id="editClient" v-model="dataEditInfoClient.client" />
                                            <label for="editClient"><span style="color: red">*</span> Cliente</label>
                                        </span>
                                    </div>
                                    <div class="field col-12 md:col-4">
                                        <span class="p-float-label">
                                            <InputText type="text" id="editTelephone" v-model="dataEditInfoClient.telephone" :maxlength="11" />
                                            <label for="editTelephone"><span style="color: red">*</span> Telefone</label>
                                        </span>
                                    </div>
                                    <div class="field col-12 md:col-8">
                                        <span class="p-float-label">
                                            <InputText type="text" id="editAdress" v-model="dataEditInfoClient.adress" />
                                            <label for="editAdress">Endereço</label>
                                        </span>
                                    </div>
                                    <div class="field col-12 md:col-12">
                                        <span class="p-float-label">
                                            <Textarea inputId="editObservation" rows="1" cols="10" v-model="dataEditInfoClient.observation" />
                                            <label for="editObservation">Observação</label>
                                        </span>
                                    </div>
                                </div>
                                <template #footer>
                                    <Button label="Cancelar" icon="pi pi-times" class="p-button-danger" @click="closeModal()" />
                                    <Button label="Editar" icon="pi pi-check" class="p-button-warning" @click="validateEditInfoClient()" />
                                </template>
                            </Dialog>
                            <Button icon="pi pi-user-edit" @click="openModalEditInfo('top', data)" class="p-button-rounded p-button-warning mr-2" v-tooltip.top="'Editar informações'" type="text" placeholder="Top" />
                            <Button ref="popup" @click="confirmUpdateWarehouse($event, data.id)" icon="pi pi-box" class="p-button-rounded p-button-info mr-2" v-tooltip.top="'Enviar ao depósito'" />
                            <Button ref="popup" @click="confirmDeleteService($event, data)" icon="pi pi-trash" class="p-button-rounded p-button-danger" v-tooltip.top="'Excluir'" />
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>
