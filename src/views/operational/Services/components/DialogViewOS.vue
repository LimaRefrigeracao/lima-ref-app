<script setup>
const props = defineProps({
    modelValue: { type: Boolean, default: false },
    position: { type: String, default: 'top' },
    rowData: { type: Object, default: () => ({}) },
    dataGetOS: { type: Object, required: true },
    dataViewEstimateOS: { type: Array, required: true },
    typeOS: { type: Object, required: true },
    typeOsOptions: { type: Array, required: true },
    dataPutOrderOfServiceSimple: { type: Object, required: true },
    dataPutOrderOfServiceComplete: { type: Object, required: true },
    displayButtonRemoveOS: { type: Boolean, default: false },
    messageSimple: { type: Array, required: true },
    messageComplete: { type: Array, required: true },
    sendWhatsAppMessage: { type: Function, required: true },
    pdfGenerator: { type: Object, required: true }
});

const emit = defineEmits(['update:modelValue', 'update:typeOS', 'save', 'delete']);
</script>

<template>
    <Dialog
        :header="`Orçamento - ( ${rowData.order_of_service} / ${rowData.product} / ${rowData.client} )`"
        :visible="modelValue"
        @update:visible="emit('update:modelValue', $event)"
        :position="position"
        :breakpoints="{ '960px': '75vw' }"
        :style="{ width: '50vw' }"
        :modal="true"
    >
        <div class="flex justify-content-center mb-4">
            <SelectButton :modelValue="typeOS" @update:modelValue="emit('update:typeOS', $event)" :options="typeOsOptions" optionLabel="label" dataKey="label" />
        </div>

        <!-- Orçamento Simplificado -->
        <DataTable v-if="typeOS.value == 'simples'" :value="dataViewEstimateOS" responsiveLayout="scroll" :rows="6">
            <transition-group tag="div">
                <Message v-for="msg of messageSimple" :severity="msg.severity" :key="msg.content">{{ msg.content }}</Message>
            </transition-group>
            <template #header>
                <div class="grid p-fluid mt-1">
                    <div class="field col-12 md:col-6">
                        <span class="p-float-label">
                            <Textarea id="addDescriptionOS" v-model="dataPutOrderOfServiceSimple[0].description" rows="3" />
                            <label for="addDescriptionOS"><span style="color: red">*</span> Descrição</label>
                        </span>
                    </div>
                    <div class="field col-12 md:col-3">
                        <span class="p-float-label">
                            <InputNumber id="addPriceOS" v-model="dataPutOrderOfServiceSimple[0].price" :minFractionDigits="2" />
                            <label for="addPriceOS"><span style="color: red">*</span> Preço</label>
                        </span>
                    </div>
                    <div class="field col-12 md:col-3">
                        <Button icon="pi pi-save" class="p-button-outlined p-button-info mr-2" @click="emit('save', rowData)" v-tooltip.top="'Salvar Orçamento'" />
                        <Button icon="pi pi-share-alt" class="p-button-outlined p-button-success mr-2" @click="sendWhatsAppMessage(rowData, dataGetOS)" v-tooltip.top="'Enviar Orçamento'" />
                        <Button icon="pi pi-download" class="p-button-outlined p-button-warning" @click="pdfGenerator.generateReceipt(rowData, dataGetOS)" v-tooltip.top="'Gerar Recibo'" :disabled="dataGetOS.estimate == '[]'" />
                    </div>
                </div>
            </template>
        </DataTable>

        <!-- Orçamento Detalhado -->
        <DataTable v-if="typeOS.value == 'completa'" :value="dataViewEstimateOS" responsiveLayout="scroll" :rows="6">
            <template #header>
                <transition-group tag="div">
                    <Message v-for="msg of messageComplete" :severity="msg.severity" :key="msg.content">{{ msg.content }}</Message>
                </transition-group>
                <div class="grid p-fluid mt-1">
                    <div class="field col-12 md:col-3">
                        <span class="p-float-label">
                            <InputNumber id="addQuantOS" v-model="dataPutOrderOfServiceComplete.amount" />
                            <label for="addQuantOS"><span style="color: red">*</span> Quantidade</label>
                        </span>
                    </div>
                    <div class="field col-12 md:col-5">
                        <span class="p-float-label">
                            <InputText id="addDescriptionOSC" v-model="dataPutOrderOfServiceComplete.description" />
                            <label for="addDescriptionOSC"><span style="color: red">*</span> Descrição</label>
                        </span>
                    </div>
                    <div class="field col-12 md:col-2">
                        <span class="p-float-label">
                            <InputNumber id="addPriceOSC" v-model="dataPutOrderOfServiceComplete.price" :minFractionDigits="2" />
                            <label for="addPriceOSC"><span style="color: red">*</span> Preço</label>
                        </span>
                    </div>
                    <div class="field col-12 md:col-1">
                        <Button icon="pi pi-plus" class="p-button-outlined p-button-info" @click="emit('save', rowData)" v-tooltip.top="'Adicionar Registro'" />
                    </div>
                </div>
            </template>
            <Column field="amount" header="Quantidade">
                <template #body="{ data }">{{ data.amount }}</template>
            </Column>
            <Column field="description" header="Descrição">
                <template #body="{ data }">{{ data.description }}</template>
            </Column>
            <Column field="price" header="Preço">
                <template #body="{ data }">{{ data.price }}</template>
            </Column>
            <Column headerStyle="width:4rem" v-if="displayButtonRemoveOS">
                <template #body="{ data }">
                    <Button icon="pi pi-trash" class="p-button-outlined p-button-danger" @click="emit('delete', dataGetOS.cod_order, data)" v-tooltip.top="'Excluir Registro'" />
                </template>
            </Column>
            <template #footer>
                <div class="grid p-fluid mt-1">
                    <div class="col-12 md:col-6">
                        <div class="p-inputgroup">
                            <span class="p-inputgroup-addon"> VALOR </span>
                            <span class="p-inputgroup-addon"> R$ {{ dataGetOS.value }}.00 </span>
                            <span class="p-inputgroup-addon">
                                <Button icon="pi pi-share-alt" class="p-button-outlined p-button-success mr-2" @click="sendWhatsAppMessage(rowData, dataGetOS)" v-tooltip.top="'Enviar Orçamento'" />
                                <Button icon="pi pi-download" class="p-button-outlined p-button-warning mr-2" @click="pdfGenerator.generateReceipt(rowData, dataGetOS)" v-tooltip.top="'Gerar Recibo'" :disabled="dataGetOS.estimate == '[]'" />
                            </span>
                        </div>
                    </div>
                </div>
            </template>
        </DataTable>
    </Dialog>
</template>
