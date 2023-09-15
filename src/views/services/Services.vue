<script setup>
import Axios from '@/service/Axios';
import { ref, onBeforeMount } from 'vue';

/* Datas */
const dataGetService = ref([]);
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

/* Tools */
const getStatusServiceLabel = (status) => {
    return statusServiceMapping.value[status] || status;
};
const getStatusPaymentLabel = (status) => {
    return statusPaymentMapping.value[status] || status;
};
const getStatusPaymentClass = (status) => {
    switch (status) {
        case '0':
            return 'primary';
        case '1':
            return 'warning';
        case '2':
            return 'success';
        default:
            return '';
    }
};
const getStatusServiceClass = (status) => {
    switch (status) {
        case '0':
            return 'primary';
        case '1':
            return 'warning';
        case '2':
            return 'success';
        case '3':
            return 'primary';
        case '4':
            return 'warning';
        case '5':
            return 'success';
        case '6':
            return 'primary';
        case '7':
            return 'warning';
        case '8':
            return 'success';
        case '9':
            return 'primary';
        case '10':
            return 'warning';
        default:
            return '';
    }
};
const initFilters = () => {
    filters.value = {
        global: { value: '' },
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
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5>Serviços</h5>
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
                    <template #header>
                        <div class="flex justify-content-between flex-column sm:flex-row">
                            <Button type="button" icon="pi pi-filter-slash" label="Clear" class="p-button-outlined mb-2" @click="clearFilter()" />
                        </div>
                    </template>

                    <template #empty> Not found data </template>
                    <template #loading> Loading customers data. Please wait. </template>

                    <Column bodyClass="text-center" field="order_of_service" header="OS" :showFilterMatchModes="false" dataType="numeric">
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
                            <Badge :value="getStatusServiceLabel(data.status)" :severity="getStatusServiceClass(data.status)" />
                        </template>
                        <template #filter="{ filterModel }">
                            <Dropdown v-model="filterModel.value" :options="statusServiceOptions" placeholder="Todos" class="p-column-filter" :showClear="true">
                                <template #value="slotProps">
                                    <div v-if="slotProps.value">
                                        <Badge :value="getStatusServiceLabel(slotProps.value)" :severity="getStatusServiceClass(slotProps.value)" />
                                    </div>
                                    <span v-else>{{ slotProps.placeholder }}</span>
                                </template>
                                <template #option="slotProps">
                                    <Badge :value="getStatusServiceLabel(slotProps.option)" :severity="getStatusServiceClass(slotProps.option)" />
                                </template>
                            </Dropdown>
                        </template>
                    </Column>

                    <Column bodyClass="text-center" field="payment_status" header="Status de Pagamento" :showFilterMatchModes="false">
                        <template #body="{ data }">
                            <Badge :value="getStatusPaymentLabel(data.payment_status)" :severity="getStatusPaymentClass(data.payment_status)" />
                        </template>
                        <template #filter="{ filterModel }">
                            <Dropdown v-model="filterModel.value" :options="statusPaymentOptions" placeholder="Todos" class="p-column-filter" :showClear="true">
                                <template #value="slotProps">
                                    <div v-if="slotProps.value">
                                        <Badge :value="getStatusPaymentLabel(slotProps.value)" :severity="getStatusPaymentClass(slotProps.value)" />
                                    </div>
                                    <span v-else>{{ slotProps.placeholder }}</span>
                                </template>
                                <template #option="slotProps">
                                    <Badge :value="getStatusPaymentLabel(slotProps.option)" :severity="getStatusPaymentClass(slotProps.option)" />
                                </template>
                            </Dropdown>
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
