<template>
    <v-dialog v-model="internalDialog" max-width="400px">
        <v-card>
            <v-card-title class="headline">Confirm Deletion</v-card-title>
            <v-card-text>
                Are you sure you want to delete this item?
            </v-card-text>
            <v-card-actions>
                <v-btn @click="close" variant="tonal" color="error">Cancel&nbsp;<v-icon
                        icon="mdi-close"></v-icon></v-btn>
                <v-btn @click="confirmDeletion" variant="tonal" color="success">Yes, Delete&nbsp;<v-icon
                        icon="mdi-check"></v-icon></v-btn>
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
watch(() => props.modelValue, (newVal) => {
    internalDialog.value = newVal;
});
watch(internalDialog, (newVal) => {
    emit('update:modelValue', newVal);
});
const close = () => {
    internalDialog.value = false;
};
const confirmDeletion = () => {
    emit('confirm');
    close();
};
</script>
