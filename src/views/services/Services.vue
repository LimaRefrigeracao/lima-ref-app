<script setup>
import Axios from '@/service/Axios';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { ref, onBeforeMount } from 'vue';

/* Datas */
const popup = ref(null);
const displayModalAdd = ref(false);
const positionModalAdd = ref(false);
const addTelephone = ref(false);
const dataPostService = ref({});
const dataGetService = ref([]);
const filters = ref(null);
const loading = ref(null);
const productsTypes = ref(['Máquina de Lavar', 'Geladeira', 'Freezer', 'Micro-ondas', 'Air Fryer', 'Forno Elétrico', 'Tanquinho', 'Expositor', 'Outros']);
const statusTypes = ref([
    { code: 0, name: 'Visitar' },
    { code: 1, name: 'Buscar' },
    { code: 2, name: 'Na Fila' },
    { code: 3, name: 'Mexendo' },
    { code: 4, name: 'Orçamentado' },
    { code: 5, name: 'Autorizado' },
    { code: 6, name: 'Testando' },
    { code: 7, name: 'Pronto' },
    { code: 8, name: 'Entregar' },
    { code: 9, name: 'Devolver' },
    { code: 10, name: 'Concluído' }
]);
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
const getServices = async () => {
    try {
        const response = await Axios.get('/services');
        dataGetService.value = response.data;
        initFilters();
    } catch (error) {
        console.error(error);
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
        closeModalAdd();
    } catch (error) {
        toast.add({ severity: 'danger', summary: 'Erro', detail: 'Erro ao adicionar serviço', life: 5000 });
        console.error(error);
    }
};
const deleteService = async (idService) => {
    try {
        const response = await Axios.delete('/services/' + idService);
        toast.add({ severity: 'success', summary: 'Deletado', detail: 'Serviço deletado com sucesso', life: 5000 });
        console.log(response.status);
        await getServices();
    } catch (error) {
        toast.add({ severity: 'danger', summary: 'Erro', detail: 'Erro ao deletar serviço', life: 5000 });
        console.error(error);
    }
};

/* Dinamics */
const openModalAdd = (position) => {
    displayModalAdd.value = true;
    positionModalAdd.value = position;
};
const closeModalAdd = () => {
    displayModalAdd.value = false;
    dataPostService.value.product = '';
    dataPostService.value.client = '';
    dataPostService.value.telephone = '';
    dataPostService.value.adress = '';
    dataPostService.value.status = '';
    dataPostService.value.observation = '';
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
const initFilters = () => {
    filters.value = {
        order_of_service: { value: null },
        product: { value: null },
        client: { value: null },
        telephone: { value: null },
        adress: { value: null },
        status: { value: null },
        payment_status: { value: null },
        warehouse_status: { value: null },
        observation: { value: null },
        created_at: { value: null },
        updated_at: { value: null }
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
    getServices();
});

/* Tools */
const clearCaracterNumber = async () => {
    const regex = /[^\w\s]/g;
    const newTelephone = addTelephone.value.replace(regex, '');
    dataPostService.value.telephone = newTelephone;
};
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5>Serviços</h5>
                <Toast />
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <Dialog header="Adicionar Serviço" v-model:visible="displayModalAdd" :position="positionModalAdd" :breakpoints="{ '960px': '75vw' }" :style="{ width: '50vw' }" :modal="true">
                                <div class="grid p-fluid mt-1">
                                    <div class="field col-12 md:col-4">
                                        <span class="p-float-label">
                                            <Dropdown id="addProduct" :options="productsTypes" v-model="dataPostService.product" />
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
                                            <InputMask id="addTelephone" mask="(99)99999-9999" @change="clearCaracterNumber()" v-model="addTelephone" />
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
                                    <Button label="Cancelar" icon="pi pi-times" class="p-button-danger" @click="closeModalAdd()" />
                                    <Button label="Adicionar" icon="pi pi-check" class="p-button-success" @click="postService()" />
                                </template>
                            </Dialog>
                            <Toast />
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
                    :globalFilterFields="['order_fo_service', 'product', 'client', 'telephone', 'created_at', 'updated_at', 'status', 'payment_status']"
                    :filterLocale="filterLocale"
                >
                    <template #empty> Not found data </template>
                    <template #loading> Loading customers data. Please wait. </template>

                    <Column bodyClass="text-center" filterField="order_of_service" header="OS" :showFilterMatchModes="false" dataType="numeric">
                        <template #body="{ data }">
                            {{ data.order_of_service }}
                        </template>
                        <template #filter="{ filterModel }">
                            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Código da OS" />
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
                            {{ data.telephone }}
                            <a :href="`https://wa.me/${data.telephone}`" target="_blank"
                                ><Badge value="8" severity="success" style="padding: 2px 3px"><i class="pi pi-whatsapp"></i></Badge
                            ></a>
                        </template>
                        <template #filter="{ filterModel }">
                            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="" />
                        </template>
                    </Column>

                    <Column field="adress" header="Endereço" dataType="boolean" bodyClass="text-center">
                        <template #body="{ data }">
                            <i class="pi" :class="{ 'text-green-500 pi-check-circle': data.adress, 'text-pink-500 pi-times-circle': !data.adress }"></i>
                        </template>
                        <template #filter="{ filterModel }">
                            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Endereço" />
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

                    <Column bodyClass="text-center" field="updated_at" header="D. Atualização" :showFilterMatchModes="false" dataType="date">
                        <template #body="{ data }">
                            {{ data.updated_at }}
                        </template>
                        <template #filter="{ filterModel }">
                            <InputText type="date" v-model="filterModel.value" class="p-column-filter" placeholder="" />
                        </template>
                    </Column>

                    <Column bodyClass="text-center" field="status" header="Status de Serviço" :showFilterMatchModes="false">
                        <template #body="{ data }">
                            <Tag :value="getStatusServiceLabel(data.status)" :severity="getStatusServiceClass(data.status)" />
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
                            <Tag :value="getStatusPaymentLabel(data.payment_status)" :severity="getStatusPaymentClass(data.payment_status)" />
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

                    <Column field="odservation" header="Obs." dataType="boolean" bodyClass="text-center">
                        <template #body="{ data }">
                            <i class="pi" :class="{ 'text-yellow-500 pi-circle-fill': data.odservation, 'text-green-500 pi-circle': !data.odservation }"></i>
                        </template>
                    </Column>

                    <Column>
                        <template #body="{ data }">
                            <ConfirmPopup></ConfirmPopup>
                            <Toast />
                            <Button ref="popup" @click="confirmDelete($event, data.id)" icon="pi pi-trash" class="p-button-rounded p-button-danger" />
                        </template>
                    </Column>

                    <!-- 
                    
                    <Column header="Date" filterField="date" dataType="date" style="min-width: 10rem">
                        <template #body="{ data }">
                            {{ formatDate(data.date) }}
                        </template>
                        <template #filter="{ filterModel }">
                            <Calendar v-model="filterModel.value" dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" />
                        </template>
                    </Column>
                    <Column header="Balance" filterField="balance" dataType="numeric" style="min-width: 10rem">
                        <template #body="{ data }">
                            {{ formatCurrency(data.balance) }}
                        </template>
                        <template #filter="{ filterModel }">
                            <InputNumber v-model="filterModel.value" mode="currency" currency="USD" locale="en-US" />
                        </template>
                    </Column>
                    <Column field="status" header="Status" :filterMenuStyle="{ width: '14rem' }" style="min-width: 12rem">
                        <template #body="{ data }">
                            <span :class="'customer-badge status-' + data.status">{{ data.status }}</span>
                        </template>
                        <template #filter="{ filterModel }">
                            <Dropdown v-model="filterModel.value" :options="statuses" placeholder="Any"
                                class="p-column-filter" :showClear="true">
                                <template #value="slotProps">
                                    <span :class="'customer-badge status-' + slotProps.value" v-if="slotProps.value">{{
                                        slotProps.value }}</span>
                                    <span v-else>{{ slotProps.placeholder }}</span>
                                </template>
                                <template #option="slotProps">
                                    <span :class="'customer-badge status-' + slotProps.option">{{ slotProps.option }}</span>
                                </template>
                            </Dropdown>
                        </template>
                    </Column>
                    <Column field="activity" header="Activity" :showFilterMatchModes="false" style="min-width: 12rem">
                        <template #body="{ data }">
                            <ProgressBar :value="data.activity" :showValue="false" style="height: 0.5rem"></ProgressBar>
                        </template>
                        <template #filter="{ filterModel }">
                            <Slider v-model="filterModel.value" :range="true" class="m-3"></Slider>
                            <div class="flex align-items-center justify-content-between px-2">
                                <span>{{ filterModel.value ? filterModel.value[0] : 0 }}</span>
                                <span>{{ filterModel.value ? filterModel.value[1] : 100 }}</span>
                            </div>
                        </template>
                    </Column>
                    <Column field="verified" header="Verified" dataType="boolean" bodyClass="text-center"
                        style="min-width: 8rem">
                        <template #body="{ data }">
                            <i class="pi"
                                :class="{ 'text-green-500 pi-check-circle': data.verified, 'text-pink-500 pi-times-circle': !data.verified }"></i>
                        </template>
                        <template #filter="{ filterModel }">
                            <TriStateCheckbox v-model="filterModel.value" />
                        </template>
                    </Column> -->
                </DataTable>
            </div>
        </div>
    </div>
</template>
