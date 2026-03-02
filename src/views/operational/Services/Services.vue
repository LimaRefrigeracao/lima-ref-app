<script setup>
import { onBeforeMount } from 'vue';
import { useServices } from './composables/useServices';
import DialogServiceAdd from './components/DialogServiceAdd.vue';
import DialogViewOS from './components/DialogViewOS.vue';
import DialogEditStatus from './components/DialogEditStatus.vue';
import DialogEditPaymentStatus from './components/DialogEditPaymentStatus.vue';
import DialogEditInfoClient from './components/DialogEditInfoClient.vue';

const {
    optionsTypesTables, formatData, sendWhatsAppMessage, sendInfoClientsWhats, pdfGenerator,
    typeTable, loading, filters, typeOS, typeOsOptions,
    messageAddEstimateOSSimple, messageAddEstimateOSComplete, messageEditInfoClient,
    messageUpdateStatusService, messageUpdateStatusPayment,
    statusServiceOptions, statusPaymentOptions,
    getStyleStatusService, getStyleStatusPayment,
    dataGetOS, dataGetService, typesProductOptions,
    displayModalOS, positionModalOS, dataViewEstimateOS, displayButtonRemoveOS,
    dataPutOrderOfServiceSimple, dataPutOrderOfServiceComplete,
    displayModalViewObservation, positionModalViewObservation, dataViewObservation,
    displayModalViewAdress, positionModalViewAdress, dataViewAdress,
    displayModalEditPaymentStatus, positionModalEditPaymentStatus, dataEditPaymentStatus,
    displayModalEditStatus, positionModalEditStatus, dataEditStatus,
    displayModalEditInfo, positionModalEditInfo, dataEditInfoClient,
    getStatusService, getStatusPayment, getTypesProduct, getServices,
    clearFilter, changeTable, openModalAdd, closeModal,
    openModalOS, validateUpdateEstimateOS, deleteEstimateOS,
    openModalViewObservation, openModalViewAdress,
    openModalEditPaymentStatus, validateUpdateStatusPayment,
    openModalEditStatus, validateUpdateStatusService,
    openModalEditInfo, validateEditInfoClient, isInfoClientChanged, resetInfoClient,
    confirmDeleteService, confirmUpdateWarehouse, confirmUpdateForServices,
    toggle, openOverlay, idop, op, copyText
} = useServices();

onBeforeMount(() => {
    getTypesProduct();
    getStatusPayment();
    getStatusService();
    getServices();
});

const props = defineProps({
  rowData: {
    type: Array,
    required: false,
    default: () => []
  },
  dataGetOs: {
    type: Array,
    required: false,
    default: () => []
  },
  typeOs: {
    type: Array,
    required: false,
    default: () => []
  },
  dataViewEstimateOs: {
    type: Array,
    required: false,
    default: () => []
  }
});

</script>

<template>
    <ConfirmPopup />
    <Toast />

    <!-- Dialogs globais (fora da DataTable) -->
    <DialogServiceAdd />

    <DialogViewOS
        v-model="displayModalOS"
        :position="String(positionModalOS)"
        :dataGetOS="dataGetOS"
        :dataViewEstimateOS="dataViewEstimateOS"
        :typeOS="typeOS"
        :row-data="dataGetOS"
        :data-get-os="dataGetOS"
        :data-view-estimate-os="dataViewEstimateOS"
        :type-os="typeOS"
        :type-os-options="typeOsOptions"
        :data-put-order-of-service-simple="dataPutOrderOfServiceSimple"
        :data-put-order-of-service-complete="dataPutOrderOfServiceComplete"
        :display-button-remove-os="displayButtonRemoveOS"
        :message-simple="messageAddEstimateOSSimple"
        :message-complete="messageAddEstimateOSComplete"
        :send-whats-app-message="sendWhatsAppMessage"
        :pdf-generator="pdfGenerator"
        @update:typeOS="typeOS = $event"
        @save="validateUpdateEstimateOS"
        @delete="deleteEstimateOS"
    />

    <DialogEditStatus
        v-model="displayModalEditStatus"
        :position="String(positionModalEditStatus)"
        :data="dataEditStatus"
        :data-edit-status="dataEditStatus"
        :status-options="statusServiceOptions"
        :messages="messageUpdateStatusService"
        :get-style-status="getStyleStatusService"
        :format-data="formatData"
        @save="validateUpdateStatusService"
        @cancel="closeModal"
    />

    <DialogEditPaymentStatus
        v-model="displayModalEditPaymentStatus"
        :position="String(positionModalEditPaymentStatus)"
        :data="dataEditPaymentStatus"
        :data-edit-payment-status="dataEditPaymentStatus"
        :status-options="statusPaymentOptions"
        :messages="messageUpdateStatusPayment"
        :get-style-status="getStyleStatusPayment"
        :format-data="formatData"
        @save="validateUpdateStatusPayment"
        @cancel="closeModal"
    />

    <DialogEditInfoClient
        v-model="displayModalEditInfo"
        :position="String(positionModalEditInfo)"
        :data-edit-info-client="dataEditInfoClient"
        :types-product-options="typesProductOptions"
        :messages="messageEditInfoClient"
        :is-info-client-changed="isInfoClientChanged"
        @save="validateEditInfoClient"
        @cancel="closeModal"
        @reset="resetInfoClient"
    />

    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5>SERVIÇOS</h5>
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2" v-if="typeTable.value == 1">
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
                >
                    <template #empty> Nenhum registro encontrado. </template>
                    <template #loading> Carregando registros. Por favor aguarde. </template>

                    <!-- OS -->
                    <Column bodyClass="text-center" filterField="order_of_service" header="OS" :showFilterMatchModes="false" dataType="numeric" style="width: auto">
                        <template #body="{ data }">
                            <Dialog v-if="data.id == dataViewObservation.id" header="Observação" v-model:visible="displayModalViewObservation" :position="String(positionModalViewObservation)" :breakpoints="{ '960px': '75vw' }" :style="{ width: '25vw' }" :modal="true">
                                <h6 class="line-height-3 m-0">{{ dataViewObservation.observation }}</h6>
                            </Dialog>
                            <div style="position: relative; display: inline-block;">
                                <Chip v-if="typeTable.value == 1"
                                        :label="String(data.order_of_service)"
                                        @click="openModalOS('top', data)"
                                        v-tooltip.top="'Visualizar/Atualizar Orçamento'"
                                        style="cursor: pointer" />

                                <span v-if="typeTable.value == 2">
                                    {{ data.order_of_service }}
                                </span>

                                <i v-if="data.observation"
                                    @click="openModalViewObservation('top', data)"
                                    class="pi pi-exclamation-triangle"
                                    v-tooltip.top="'Visualizar Observação'"
                                    style="position: absolute; top: -2px; right: -15px; cursor: pointer; color: #f59e0b; font-size: 12px;">
                                </i>
                            </div>
                        </template>
                        <template #filter="{ filterModel }">
                            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Código da OS" />
                        </template>
                    </Column>

                    <!-- Data -->
                    <Column bodyClass="text-center" field="created_at" header="Data" :showFilterMatchModes="false" dataType="date" style="width: 6vw">
                        <template #body="{ data }">
                            {{ formatData(data.created_at) }}
                        </template>
                        <template #filter="{ filterModel }">
                            <InputText type="date" v-model="filterModel.value" class="p-column-filter" placeholder="" />
                        </template>
                    </Column>

                    <!-- Produto -->
                    <Column bodyClass="text-center" field="product" header="Produto" :showFilterMatchModes="false">
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

                    <!-- Cliente -->
                    <Column bodyClass="text-center" field="client" header="Informações do Cliente" :showFilterMatchModes="false" dataType="text" style="width: auto">
                        <template #body="{ data }">
                            {{ data.client }}
                            <Dialog v-if="data.id == dataViewAdress.id" header="Endereço" v-model:visible="displayModalViewAdress" :position="String(positionModalViewAdress)" :breakpoints="{ '960px': '75vw' }" :style="{ width: '25vw' }" :modal="true">
                                <h6 class="line-height-3 m-0">{{ data.adress }}</h6>
                            </Dialog>
                            <i v-if="data.adress" @click="openModalViewAdress('top', data)" class="text-green-500 pi pi-map-marker" v-tooltip.top="'Visualizar Endereço'" style="cursor: pointer"></i>
                        </template>
                        <template #filter="{ filterModel }">
                            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Nome" />
                        </template>
                    </Column>

                    <!-- Telefone -->
                    <Column bodyClass="text-center" field="telephone" header="Contato" :showFilterMatchModes="false" dataType="text" style="width: auto">
                        <template #body="{ data }">
                            {{ data.telephone }}
                            <a :href="`https://wa.me/${data.telephone}`" target="_blank">
                                <Tag severity="success" v-tooltip.top="'Abrir no Whatsapp'"><i class="pi pi-whatsapp"></i></Tag>
                            </a>
                            <a @click="copyText(data.telephone)" style="cursor: pointer">
                                <Tag class="ml-1 surface-500" v-tooltip.top="'Copiar Telefone'"><i class="pi pi-copy"></i></Tag>
                            </a>

                        </template>
                        <template #filter="{ filterModel }">
                            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="" />
                        </template>
                    </Column>

                    <!-- Situação -->
                    <Column bodyClass="text-center" field="status" header="Situação" :showFilterMatchModes="false" style="width: 7vw">
                        <template #body="{ data }">
                            <Tag
                                @click="openModalEditStatus('top', data)"
                                :value="getStyleStatusService(data.status)?.description"
                                :style="{ background: getStyleStatusService(data.status)?.color.hex }"
                                v-tooltip.top="'Atualizar Situação do Serviço'"
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

                    <!-- Pagamento -->
                    <Column bodyClass="text-center" field="payment_status" header="Pagamento" :showFilterMatchModes="false" style="width: 8vw">
                        <template #body="{ data }">
                            <Tag
                                @click="openModalEditPaymentStatus('top', data)"
                                :value="getStyleStatusPayment(data.payment_status).description"
                                :style="{ background: getStyleStatusPayment(data.payment_status).color.hex }"
                                v-tooltip.top="'Atualizar Situação do Pagamento'"
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

                    <!-- Ações -->
                    <Column bodyClass="text-center" style="width: 4vw">
                        <template #body="{ data }">
                            <Button v-tooltip.top="'Ações'" icon="pi pi-ellipsis-v" @click="toggle($event, data.id)" class="p-button-rounded surface-500 surface-border" />
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
