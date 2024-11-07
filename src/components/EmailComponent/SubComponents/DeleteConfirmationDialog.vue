<template>
    <v-dialog v-model="internalDialog" max-width="400px">
        <v-card>
            <v-card-title class="headline">Confirm Deletion</v-card-title>
            <v-card-text>
                Are you sure you want to delete this item?
            </v-card-text>
            <v-card-actions>
                <v-btn color="red darken-1" @click="close">Cancel</v-btn>
                <v-btn color="green darken-1" @click="confirmDeletion">Yes, Delete</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
    modelValue: boolean;
}>();

const emit = defineEmits(['update:modelValue', 'confirm']);

const internalDialog = ref(props.modelValue);

// Sincronizar estado interno con el valor de `props.modelValue`
watch(() => props.modelValue, (newVal) => {
    internalDialog.value = newVal;
});

// Emitir cambios al valor de `modelValue`
watch(internalDialog, (newVal) => {
    emit('update:modelValue', newVal);
});

// Cerrar el diálogo
const close = () => {
    internalDialog.value = false;
};

// Confirmar eliminación
const confirmDeletion = () => {
    emit('confirm');
    close();
};
</script>
