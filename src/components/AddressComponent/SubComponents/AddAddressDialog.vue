<template>
    <v-dialog v-model="internalDialog" max-width="500px">
        <v-card>
            <v-card-title>
                <span class="text-h5">Add Address</span>
            </v-card-title>
            <v-card-text>
                <v-form ref="addForm">
                    <v-text-field v-model="newAddress.street" label="Street" :error-messages="errorMessages.street"
                        required />
                    <v-text-field v-model="newAddress.city" label="City" />
                    <v-text-field v-model="newAddress.state" label="State" />
                    <v-text-field v-model="newAddress.zipCode" label="Zip Code" type="number" />
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn color="blue darken-1" @click="close">Cancel</v-btn>
                <v-btn color="blue darken-1" @click="submit">Submit</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import type { AddressPost } from '../../../interfaces/AddressPost';
import type { Address } from '@/interfaces/Address';

const props = defineProps<{
    modelValue: boolean;
    address: Address | null;
    studentId: number;
}>();

const emit = defineEmits(['update:modelValue', 'add']);

const internalDialog = ref(props.modelValue);

const newAddress = ref<AddressPost>({
    street: props.address?.street || '',
    city: props.address?.city || '',
    state: props.address?.state || '',
    zipCode: props.address?.zipCode || '',
    studentId: props.studentId,
});

const rules = {
    street: { required }
};

const v$ = useVuelidate(rules, newAddress);

const errorMessages = computed(() => ({
    street: v$.value.street.$errors.map(e => e.$message.toString())
}));

watch(() => props.modelValue, (newVal) => {
    internalDialog.value = newVal;
});

watch(internalDialog, (newVal) => {
    emit('update:modelValue', newVal);
});

const submit = () => {
    v$.value.$touch();
    if (!v$.value.$invalid) {
        const addressPost: AddressPost = {
            street: newAddress.value.street,
            city: newAddress.value.city,
            state: newAddress.value.state,
            zipCode: newAddress.value.zipCode,
            studentId: newAddress.value.studentId,
        };
        emit('add', addressPost);
        close();
    }
};

const close = () => {
    internalDialog.value = false;
    emit('update:modelValue', false);
    v$.value.$reset();
    newAddress.value = {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        studentId: props.studentId,
    };
};
</script>
