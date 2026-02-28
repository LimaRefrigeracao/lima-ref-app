<script setup>
const props = defineProps({
    modelValue: { type: Boolean, default: false },
    position: { type: String, default: 'top' },
    data: { type: Object, default: () => ({}) },
    dataEditStatus: { type: Object, required: true },
    statusOptions: { type: Array, required: true },
    messages: { type: Array, required: true },
    getStyleStatus: { type: Function, required: true },
    formatData: { type: Function, required: true }
});

const emit = defineEmits(['update:modelValue', 'save', 'cancel']);
</script>

<template>
    <Dialog
        header="Atualizar Status de Serviço"
        :visible="modelValue"
        @update:visible="emit('update:modelValue', $event)"
        :position="position"
        :breakpoints="{ '960px': '75vw' }"
        :style="{ width: '15vw' }"
        :modal="true"
    >
        <transition-group tag="div">
            <Message v-for="msg of messages" :severity="msg.severity" :key="msg.content">{{ msg.content }}</Message>
        </transition-group>
        <div class="grid p-fluid mt-1">
            <div class="field col-12 md:col-12">
                <span class="p-float-label">
                    <Dropdown id="editStatus" v-model="dataEditStatus.status" :options="statusOptions" class="p-column-filter" :showClear="true">
                        <template #value="slotProps">
                            <div v-if="slotProps.value">
                                <Tag :value="getStyleStatus(parseInt(slotProps.value)).description" :style="{ background: getStyleStatus(parseInt(slotProps.value)).color.hex }" />
                            </div>
                            <span v-else>{{ slotProps.placeholder }}</span>
                        </template>
                        <template #option="slotProps">
                            <Tag :value="getStyleStatus(parseInt(slotProps.option)).description" :style="{ background: getStyleStatus(parseInt(slotProps.option)).color.hex }" />
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
            <Button label="Cancelar" icon="pi pi-times" class="p-button-danger" @click="emit('cancel')" />
            <Button label="Atualizar" icon="pi pi-check" class="p-button-warning" @click="emit('save')" />
        </template>
    </Dialog>
</template>
