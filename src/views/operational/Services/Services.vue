<script setup>
import { ref, onBeforeMount, provide, Axios, loadingOpen, loadingClose, useToast } from '@/views/common';
import { useConfirm } from 'primevue/useconfirm';
import pdfGenerator from '@/service/PdfGenerator.js';
import { messageAddService, messageAddEstimateOSSimple, messageAddEstimateOSComplete, messageEditInfoClient, messageUpdateStatusService, messageUpdateStatusPayment, addMessage } from '../../utils/messages.js';
import { optionsTypesTables, socket, formatData, sendWhatsAppMessage, sendInfoClientsWhats } from '../../utils/computeds.js';

import DialogServiceAdd from './components/DialogServiceAdd.vue';

/* Service Status */
const statusServiceOptions = ref([]);
const statusServiceMapping = ref([]);
const getStatusService = async () => {
    try {
        const response = await Axios.get('/status_service');
        statusServiceOptions.value = response.data.map((item) => item.cod.toString());
        statusServiceMapping.value = response.data;
        statusServiceMapping.value.forEach((value) => {
            if (value.color) {
                value.color = JSON.parse(value.color);
            }
        });
    } catch (error) {
        console.error(error);
    }
};

const getStyleStatusService = (cod) => {
    const statusService = statusServiceMapping.value.find((item) => item.cod === cod);
    return statusService || null;
};

/* Payment Status */
const statusPaymentOptions = ref([]);
const statusPaymentMapping = ref([]);
const getStatusPayment = async () => {
    try {
        const response = await Axios.get('/status_payment');
        statusPaymentOptions.value = response.data.map((item) => item.cod.toString());
        statusPaymentMapping.value = response.data;
        statusPaymentMapping.value.forEach((value) => {
            if (value.color) {
                value.color = JSON.parse(value.color);
            }
        });
    } catch (error) {
        console.error(error);
    }
};

const getStyleStatusPayment = (cod) => {
    const statusPayment = statusPaymentMapping.value.find((item) => item.cod === cod);
    return statusPayment || null;
};

/* Products Types */
const typesProductOptions = ref([]);
const getTypesProduct = async () => {
    try {
        const response = await Axios.get('/types_product');
        typesProductOptions.value = response.data.map((item) => item.name);
    } catch (error) {
        console.error(error);
    }
};

const typeTable = ref({ value: 1, label: 'Oficina' });
const toast = useToast();
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

const typeOS = ref({ label: 'Simplificada', value: 'simples' });
const typeOsOptions = ref([
    { label: 'Simplificada', value: 'simples' },
    { label: 'Detalhada', value: 'completa' }
]);

const dataGetOS = ref([]);

socket.on('reloadDataOrders', (data) => {
    dataGetOS.value = data;
});
const getUniqueOS = async (order_of_service) => {
    try {
        const response = await Axios.get('/order_of_service/' + order_of_service);
        dataGetOS.value = response.data[0];
        return dataGetOS.value;
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao buscar OS específica', life: 5000 });
        console.error(error);
    }
};
const dataGetService = ref([]);
socket.on('reloadDataService', (data) => {
    dataGetService.value = data;
});
const getServices = async () => {
    loadingOpen();
    try {
        const response = await Axios.get('/services');
        dataGetService.value = response.data;
         
        initFilters();
        loadingClose();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao buscar serviços', life: 5000 });
        console.error(error);
        loadingClose();
    }
};

const getServicesWarehouse = async () => {
    loadingOpen();
    try {
        const response = await Axios.get('/services/warehouse');
        dataGetService.value = response.data;
         
        initFilters();
        loadingClose();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao buscar serviços do depósito', life: 5000 });
        loadingClose();
        console.error(error);
    }
};

const updateWarehouseForService = async (id) => {
    try {
        await Axios.put('/services/warehouse/' + id + '/true', {
            typeTable: typeTable.value.value
        });
        toast.add({ severity: 'success', summary: 'Enviado', detail: '', life: 5000 });
         
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Erro', detail: '', life: 5000 });
        console.error(error);
    }
};
const confirmUpdateForServices = (event, idService) => {
    confirmPopup.require({
        target: event.target,
        message: 'Deseja levar este serviço de volta?',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        accept: () => {
            updateWarehouseForService(idService);
        }
    });
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
    loadingOpen();
    try {
        await Axios.delete('/services/' + idService + '/' + cod_order + '/' + typeTable.value.value);
        toast.add({ severity: 'success', summary: 'Deletado', detail: 'Serviço deletado com sucesso', life: 5000 });
         
        loadingClose();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao deletar serviço', life: 5000 });
        console.error(error);
        loadingClose();
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
    loadingOpen();
    try {
        await Axios.put('/services/warehouse/' + id + '/false', {
            typeTable: typeTable.value.value
        });
        toast.add({ severity: 'success', summary: 'Enviado', detail: 'Serviço enviado ao depósito', life: 5000 });
         
        loadingClose();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao enviar serviço ao depósito', life: 5000 });
        console.error(error);
        loadingClose();
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
    loadingOpen();
    try {
        await Axios.put('/services/info/client/' + dataEditInfoClient.value.id, {
            product: dataEditInfoClient.value.product,
            client: dataEditInfoClient.value.client,
            telephone: dataEditInfoClient.value.telephone,
            adress: dataEditInfoClient.value.adress,
            observation: dataEditInfoClient.value.observation,
            typeTable: typeTable.value.value
        });
        toast.add({ severity: 'success', summary: 'Editado', detail: 'As informações do cliente foram editadas', life: 5000 });
         
        closeModal();
        loadingClose();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao editar as informações do cliente', life: 5000 });
        console.error(error);
        loadingClose();
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
    loadingOpen();
    try {
        await Axios.put('/services/status/' + dataEditStatus.value.id + '/' + dataEditStatus.value.status, {
            typeTable: typeTable.value.value
        });
        toast.add({ severity: 'success', summary: 'Atualizado', detail: 'Status atualizado com sucesso', life: 5000 });
         
        closeModal();
        loadingClose();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao atualizar o status', life: 5000 });
        console.error(error);
        loadingClose();
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
    loadingOpen();
    try {
        await Axios.put('/services/status/payment/' + dataEditPaymentStatus.value.id + '/' + dataEditPaymentStatus.value.payment_status, {
            typeTable: typeTable.value.value
        });
        toast.add({ severity: 'success', summary: 'Atualizado', detail: 'Status de pagamento atualizado com sucesso', life: 5000 });
         
        closeModal();
        loadingClose();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao atualizar o status de pagamento ', life: 5000 });
        console.error(error);
        loadingClose();
    }
};
const dataPutOrderOfServiceSimple = ref({});
const dataPutOrderOfServiceComplete = ref({});
const validateUpdateEstimateOS = async (data) => {
    if (typeOS.value.value == 'simples') {
        if (!dataPutOrderOfServiceSimple.value[0].description || !dataPutOrderOfServiceSimple.value[0].price) {
            addMessage('addEstimateOSSimple', 'error', 'Preencha todos os campos obrigatórios.');
        } else {
            updateEstimateOS(data);
        }
    } else {
        if (!dataPutOrderOfServiceComplete.value.amount || !dataPutOrderOfServiceComplete.value.description || !dataPutOrderOfServiceComplete.value.price) {
            addMessage('addEstimateOSComplete', 'error', 'Preencha todos os campos obrigatórios.');
        } else {
            updateEstimateOS(data);
        }
    }
};
const updateEstimateOS = async (data) => {
    loadingOpen();
    try {
        const dataPutOrderOfService = ref({});
        if (typeOS.value.value == 'simples') {
            dataPutOrderOfService.value.amount = '';
            dataPutOrderOfService.value.description = dataPutOrderOfServiceSimple.value[0].description;
            dataPutOrderOfService.value.price = dataPutOrderOfServiceSimple.value[0].price;
        } else {
            dataPutOrderOfService.value = dataPutOrderOfServiceComplete.value;
        }
        await Axios.put('/order_of_service/estimate/' + data.order_of_service, {
            type: typeOS.value.value,
            id: !dataPutOrderOfService.value.id ? null : dataPutOrderOfService.value.id,
            amount: dataPutOrderOfService.value.amount,
            description: dataPutOrderOfService.value.description,
            price: dataPutOrderOfService.value.price
        });
         
        closeModal();
        openModalOS('top', data);
        loadingClose();
        toast.add({ severity: 'success', summary: 'Adicionado', detail: 'Registro de OS adicionado com sucesso', life: 5000 });
    } catch (error) {
        console.error(error);
        loadingClose();
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao adicionar registro de OS', life: 5000 });
    }
};
const deleteEstimateOS = async (cod, data) => {
    loadingOpen();
    try {
        await Axios.delete('/order_of_service/estimate/' + cod + '/' + data.id);
        toast.add({ severity: 'success', summary: 'Deletado', detail: 'Registro de OS deletado com sucesso', life: 5000 });
         
        const dataOpen = { order_of_service: cod };
        closeModal();
        openModalOS('top', dataOpen);
        loadingClose();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao deletar registro de OS', life: 5000 });
        console.error(error);
        loadingClose();
    }
};

const displayModalOS = ref(false);
const positionModalOS = ref(false);
const dataViewEstimateOS = ref([]);
const displayButtonRemoveOS = ref(false);
const openModalOS = async (position, data) => {
    const dataOS = await getUniqueOS(data.order_of_service);
    if (data.status !== 13) {
        displayButtonRemoveOS.value = true;
    } else {
        displayButtonRemoveOS.value = false;
    }
    if (dataOS) {
        messageAddEstimateOSSimple.value.length = 0;
        messageAddEstimateOSComplete.value.length = 0;
        dataViewEstimateOS.value = JSON.parse(dataOS.estimate);
        dataPutOrderOfServiceSimple.value = dataViewEstimateOS.value && dataViewEstimateOS.value.length > 0 ? dataViewEstimateOS.value : { 0: { id: null, description: '', price: null } };
        displayModalOS.value = true;
        positionModalOS.value = position;
        if (dataViewEstimateOS.value[0].amount !== '') {
            typeOS.value = { label: 'Detalhada', value: 'completa' };
        } else {
            typeOS.value = { label: 'Simplificada', value: 'simples' };
        }
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
    dataEditPaymentStatus.value.label = getStyleStatusPayment(data.payment_status).description;
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
    dataEditStatus.value.label = getStyleStatusService(data.status).description;
    dataEditStatus.value.id = data.id;
    dataEditStatus.value.status = data.status;
};

const isInfoClientChanged = () => {
    return JSON.stringify(dataEditInfoClient.value) !== JSON.stringify(originalInfoClient.value);
};
const originalInfoClient = ref({});
const resetInfoClient = () => {
    dataEditInfoClient.value = { ...originalInfoClient.value };
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

    originalInfoClient.value.id = data.id;
    originalInfoClient.value.product = data.product;
    originalInfoClient.value.client = data.client;
    originalInfoClient.value.telephone = data.telephone;
    originalInfoClient.value.adress = data.adress;
    originalInfoClient.value.observation = data.observation;
};
const displayModalAdd = ref(false);
provide('displayDialogAdd', displayModalAdd);
const openModalAdd = () => {
    messageAddService.value.length = 0;
    displayModalAdd.value = true;
};

const closeModal = () => {
    if (displayModalOS.value == true) {
        dataPutOrderOfServiceComplete.value.amount = null;
        dataPutOrderOfServiceComplete.value.description = '';
        dataPutOrderOfServiceComplete.value.price = null;
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
};

const changeTable = async (type) => {
    if (type == 1) {
        await getServices();
    } else if (type == 2) {
        await getServicesWarehouse();
    }
};

const idop = ref(null);
const op = ref();
const toggle = async (event, id) => {
    idop.value = id;
    const result = await openOverlay(id);
    if (result) {
        op.value.toggle(event);
    }
};
const openOverlay = (id) => {
    return id === idop.value;
};

onBeforeMount(() => {
    getTypesProduct();
    getStatusPayment();
    getStatusService();
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
                        <div class="my-2" v-if="typeTable.value == 1">
                            <DialogServiceAdd />
                            <Button label="Adicionar" icon="pi pi-plus" class="p-button-primary mr-2" @click="openModalAdd()" />
                        </div>
                    </template>
                    <template v-slot:end>
                        <div class="flex justify-content-between flex-column sm:flex-row mt-2">
                            <div class="p-inputgroup p-column-filter mb-2 mr-4" style="width: auto; height: 45px">
                                <span class="p-inputgroup-addon"> Local </span>
                                <span class="p-inputgroup-addon">
                                    <Dropdown v-model="typeTable" label="teste" :options="optionsTypesTables" optionLabel="label" @change="changeTable(typeTable.value)" />
                                </span>
                            </div>
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
                    <template #empty> Nenhum registro encontrado. </template>
                    <template #loading> Carregando registros. Por favor aguarde. </template>

                    <Column bodyClass="text-center" filterField="order_of_service" header="OS" :showFilterMatchModes="false" dataType="numeric" style="width: 3vw">
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
                                <div class="flex justify-content-center mb-4">
                                    <SelectButton v-model="typeOS" :options="typeOsOptions" optionLabel="label" dataKey="label" />
                                </div>

                                <DataTable v-if="typeOS.value == 'simples'" :value="dataViewEstimateOS" responsiveLayout="scroll" :rows="6">
                                    <transition-group tag="div">
                                        <Message v-for="msg of messageAddEstimateOSSimple" :severity="msg.severity" :key="msg.content">{{ msg.content }}</Message>
                                    </transition-group>
                                    <template #header>
                                        <div class="grid p-fluid mt-1">
                                            <div class="field col-12 md:col-6">
                                                <span class="p-float-label">
                                                    <Textarea id="addDescriptionOS" v-model="dataPutOrderOfServiceSimple[0].description" rows="3" />
                                                    <label for="addDescriptionOS">
                                                        <span style="color: red">*</span>
                                                        Descrição
                                                    </label>
                                                </span>
                                            </div>
                                            <div class="field col-12 md:col-3">
                                                <span class="p-float-label">
                                                    <InputNumber id="addPriceOS" v-model="dataPutOrderOfServiceSimple[0].price" :minFractionDigits="2" />
                                                    <label for="addPriceOS">
                                                        <span style="color: red">*</span>
                                                        Preço
                                                    </label>
                                                </span>
                                            </div>
                                            <div class="field col-12 md:col-3">
                                                <Button icon="pi pi-save" class="p-button-outlined p-button-info mr-2" @click="validateUpdateEstimateOS(data)" v-tooltip.top="'Salvar Orçamento'" />
                                                <Button icon="pi pi-share-alt" class="p-button-outlined p-button-success mr-2" @click="sendWhatsAppMessage(data, dataGetOS)" v-tooltip.top="'Enviar Orçamento'" />
                                                <Button icon="pi pi-download" class="p-button-outlined p-button-warning" @click="pdfGenerator.generateReceipt(data, dataGetOS)" v-tooltip.top="'Gerar Recibo'" :disabled="dataGetOS.estimate == '[]'" />
                                            </div>
                                        </div>
                                    </template>
                                </DataTable>

                                <DataTable v-if="typeOS.value == 'completa'" :value="dataViewEstimateOS" responsiveLayout="scroll" :rows="6">
                                    <template #header>
                                        <transition-group tag="div">
                                            <Message v-for="msg of messageAddEstimateOSComplete" :severity="msg.severity" :key="msg.content">{{ msg.content }}</Message>
                                        </transition-group>
                                        <div class="grid p-fluid mt-1">
                                            <div class="field col-12 md:col-3">
                                                <span class="p-float-label">
                                                    <InputNumber id="addQuantOS" v-model="dataPutOrderOfServiceComplete.amount" />
                                                    <label for="addQuantOS">
                                                        <span style="color: red">*</span>
                                                        Quantidade
                                                    </label>
                                                </span>
                                            </div>
                                            <div class="field col-12 md:col-5">
                                                <span class="p-float-label">
                                                    <InputText id="addDescriptionOS" v-model="dataPutOrderOfServiceComplete.description" />
                                                    <label for="addDescriptionOS">
                                                        <span style="color: red">*</span>
                                                        Descrição
                                                    </label>
                                                </span>
                                            </div>
                                            <div class="field col-12 md:col-2">
                                                <span class="p-float-label">
                                                    <InputNumber id="addPriceOS" v-model="dataPutOrderOfServiceComplete.price" :minFractionDigits="2" />
                                                    <label for="addPriceOS">
                                                        <span style="color: red">*</span>
                                                        Preço
                                                    </label>
                                                </span>
                                            </div>
                                            <div class="field col-12 md:col-1">
                                                <Button icon="pi pi-plus" class="p-button-outlined p-button-info" @click="validateUpdateEstimateOS(data)" v-tooltip.top="'Adicionar Registro'" />
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
                                    <Column headerStyle="width:4rem" v-if="displayButtonRemoveOS == true">
                                        <template #body="{ data }">
                                            <Button icon="pi pi-trash" class="p-button-outlined p-button-danger" @click="deleteEstimateOS(dataGetOS.cod_order, data)" v-tooltip.top="'Excluir Registro'" />
                                        </template>
                                    </Column>
                                    <template #footer>
                                        <div class="grid p-fluid mt-1">
                                            <div class="col-12 md:col-6">
                                                <div class="p-inputgroup">
                                                    <span class="p-inputgroup-addon"> VALOR </span>
                                                    <span class="p-inputgroup-addon"> R$ {{ dataGetOS.value }}.00 </span>
                                                    <span class="p-inputgroup-addon">
                                                        <Button icon="pi pi-share-alt" class="p-button-outlined p-button-success mr-2" @click="sendWhatsAppMessage(data, dataGetOS)" v-tooltip.top="'Enviar Orçamento'" />
                                                        <Button icon="pi pi-download" class="p-button-outlined p-button-warning mr-2" @click="pdfGenerator.generateReceipt(data, dataGetOS)" v-tooltip.top="'Gerar Recibo'" :disabled="dataGetOS.estimate == '[]'" />
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                </DataTable>
                            </Dialog>
                            <Chip v-if="typeTable.value == 1" :label="data.order_of_service" @click="openModalOS('top', data)" v-tooltip.top="'Visualizar/Atualizar Orçamento'" style="cursor: pointer" />
                            <span v-if="typeTable.value == 2"> {{ data.order_of_service }} </span>
                        </template>
                        <template #filter="{ filterModel }">
                            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Código da OS" />
                        </template>
                    </Column>

                    <Column bodyClass="text-center" field="created_at" header="DATA" :showFilterMatchModes="false" dataType="date" style="width: 6vw">
                        <template #body="{ data }">
                            {{ formatData(data.created_at) }}
                        </template>
                        <template #filter="{ filterModel }">
                            <InputText type="date" v-model="filterModel.value" class="p-column-filter" placeholder="" />
                        </template>
                    </Column>

                    <Column bodyClass="text-center" field="product" header="PRODUTO" :showFilterMatchModes="false">
                        <template #body="{ data }">
                            {{ data.product }}
                        </template>
                        <template #filter="{ filterModel }">
                            <Dropdown v-model="filterModel.value" :options="typesProductOptions" placeholder="Todos" class="p-column-filter" :showClear="true">
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

                    <Column bodyClass="text-center" field="client" header="CLIENTE" :showFilterMatchModes="false" dataType="text">
                        <template #body="{ data }">
                            {{ data.client }}
                        </template>
                        <template #filter="{ filterModel }">
                            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Nome" />
                        </template>
                    </Column>

                    <Column bodyClass="text-center" field="telephone" header="TELEFONE" :showFilterMatchModes="false" dataType="text" style="width: 5vw">
                        <template #body="{ data }">
                            <a :href="`https://wa.me/${data.telephone}`" target="_blank">
                                <Tag severity="success" v-tooltip.top="'Abrir no Whatsapp'"> {{ data.telephone }} <i class="pi pi-whatsapp ml-1"></i> </Tag>
                            </a>
                        </template>
                        <template #filter="{ filterModel }">
                            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="" />
                        </template>
                    </Column>

                    <Column field="adress" header="ENDEREÇO" dataType="boolean" bodyClass="text-center" style="width: 4vw">
                        <template #body="{ data }">
                            <Dialog v-if="data.id == dataViewAdress.id" header="Endereço" v-model:visible="displayModalViewAdress" :position="positionModalViewAdress" :breakpoints="{ '960px': '75vw' }" :style="{ width: '25vw' }" :modal="true">
                                <h6 class="line-height-3 m-0">
                                    {{ data.adress }}
                                </h6>
                            </Dialog>
                            <i v-if="data.adress" @click="openModalViewAdress('top', data)" class="text-green-500 pi pi-map-marker" v-tooltip.top="'Visualizar'" style="cursor: pointer"></i>
                            <i v-if="!data.adress" class="pi pi-minus"></i>
                        </template>
                    </Column>

                    <Column field="observation" header="OBSERVAÇÃO" dataType="boolean" bodyClass="text-center" style="width: 5vw">
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
                            <i v-if="!data.observation" class="pi pi-minus"></i>
                        </template>
                    </Column>

                    <Column bodyClass="text-center" field="status" header="STATUS" :showFilterMatchModes="false" style="width: 7vw">
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
                                            <Dropdown id="editStatus" v-model="dataEditStatus.status" :options="statusServiceOptions" class="p-column-filter" :showClear="true">
                                                <template #value="slotProps">
                                                    <div v-if="slotProps.value">
                                                        <Tag :value="getStyleStatusService(parseInt(slotProps.value)).description" :style="{ background: getStyleStatusService(parseInt(slotProps.value)).color.hex }" />
                                                    </div>
                                                    <span v-else>{{ slotProps.placeholder }}</span>
                                                </template>
                                                <template #option="slotProps">
                                                    <Tag :value="getStyleStatusService(parseInt(slotProps.option)).description" :style="{ background: getStyleStatusService(parseInt(slotProps.option)).color.hex }" />
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
                            <Tag
                                @click="openModalEditStatus('top', data)"
                                :value="getStyleStatusService(data.status).description"
                                :style="{ background: getStyleStatusService(data.status).color.hex }"
                                v-tooltip.top="'Atualizar Status'"
                                style="cursor: pointer"
                            />
                        </template>
                        <template #filter="{ filterModel }">
                            <Dropdown v-model="filterModel.value" :options="statusServiceOptions" placeholder="Todos" class="p-column-filter" :showClear="true">
                                <template #value="slotProps">
                                    <div v-if="slotProps.value">
                                        <Tag :value="getStyleStatusService(parseInt(slotProps.value)).description" :style="{ background: getStyleStatusService(parseInt(slotProps.value)).color.hex }" />
                                    </div>
                                    <span v-else>{{ slotProps.placeholder }}</span>
                                </template>
                                <template #option="slotProps">
                                    <Tag :value="getStyleStatusService(parseInt(slotProps.option)).description" :style="{ background: getStyleStatusService(parseInt(slotProps.option)).color.hex }" />
                                </template>
                            </Dropdown>
                        </template>
                    </Column>

                    <Column bodyClass="text-center" field="payment_status" header="PAGAMENTO" :showFilterMatchModes="false" style="width: 8vw">
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
                                                        <Tag :value="getStyleStatusPayment(parseInt(slotProps.value)).description" :style="{ background: getStyleStatusPayment(parseInt(slotProps.value)).color.hex }" />
                                                    </div>
                                                    <span v-else>{{ slotProps.placeholder }}</span>
                                                </template>
                                                <template #option="slotProps">
                                                    <Tag :value="getStyleStatusPayment(parseInt(slotProps.option)).description" :style="{ background: getStyleStatusPayment(parseInt(slotProps.option)).color.hex }" />
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
                                :value="getStyleStatusPayment(data.payment_status).description"
                                :style="{ background: getStyleStatusPayment(data.payment_status).color.hex }"
                                v-tooltip.top="'Atualizar Status de Pagamento'"
                                style="cursor: pointer"
                            />
                        </template>
                        <template #filter="{ filterModel }">
                            <Dropdown v-model="filterModel.value" :options="statusPaymentOptions" placeholder="Todos" class="p-column-filter" :showClear="true">
                                <template #value="slotProps">
                                    <div v-if="slotProps.value">
                                        <Tag :value="getStyleStatusPayment(parseInt(slotProps.value)).description" :style="{ background: getStyleStatusPayment(parseInt(slotProps.value)).color.hex }" />
                                    </div>
                                    <span v-else>{{ slotProps.placeholder }}</span>
                                </template>
                                <template #option="slotProps">
                                    <Tag :value="getStyleStatusPayment(parseInt(slotProps.option)).description" :style="{ background: getStyleStatusPayment(parseInt(slotProps.option)).color.hex }" />
                                </template>
                            </Dropdown>
                        </template>
                    </Column>

                    <Column bodyClass="text-center" style="width: 4vw">
                        <template #body="{ data }">
                            <Dialog
                                v-if="data.id == dataEditInfoClient.id"
                                header="Informações do Cliente"
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
                                            <Dropdown id="editProduct" :options="typesProductOptions" v-model="dataEditInfoClient.product" />
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
                                    <Button label="Resetar" icon="pi pi-refresh" class="p-button-primary" v-show="isInfoClientChanged()" @click="resetInfoClient()" />
                                    <Button label="Cancelar" icon="pi pi-times" class="p-button-danger" @click="closeModal()" />
                                    <Button label="Editar" icon="pi pi-check" class="p-button-warning" @click="validateEditInfoClient()" />
                                </template>
                            </Dialog>

                            <Button v-tooltip.top="'Ações'" icon="pi pi-ellipsis-v" @click="toggle($event, data.id)" class="p-button-rounded surface-400 surface-border" />
                            <OverlayPanel v-if="openOverlay(data.id)" ref="op">
                                <Button icon="pi pi-user-edit" @click="openModalEditInfo('top', data)" class="p-button-rounded p-button-warning" v-tooltip.top="'Ver informações'" />
                                <Button icon="pi pi-share-alt" @click="sendInfoClientsWhats(data)" class="ml-1 p-button-rounded p-button-success" v-tooltip.top="'Enviar informações'" />
                                <Button v-if="typeTable.value == 1" icon="pi pi-sign-in" @click="confirmUpdateWarehouse($event, data.id)" class="ml-1 p-button-rounded p-button-info" v-tooltip.top="'Enviar ao depósito'" />
                                <Button v-if="typeTable.value == 2" icon="pi pi-sign-out" @click="confirmUpdateForServices($event, data.id)" class="ml-1 p-button-rounded p-button-info" v-tooltip.top="'Retornar para serviço'" />
                                <Button @click="confirmDeleteService($event, data)" icon="pi pi-trash" class="ml-1 p-button-rounded p-button-danger" v-tooltip.top="'Excluir'" />
                            </OverlayPanel>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>