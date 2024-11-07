<template>
    <v-dialog v-model="internalDialog" max-width="500px">
        <v-card>
            <v-card-title>
                <span class="text-h5">Edit Address</span>
            </v-card-title>
            <v-card-text>
                <v-form ref="editForm" @submit.prevent="submit" novalidate>
                    <v-text-field v-model="localAddress" label="Address Line" required
                        :error-messages="errorMessages"></v-text-field>
                    <v-text-field v-model="city" label="City"></v-text-field>
                    <v-text-field v-model="state" label="State"></v-text-field>
                    <v-text-field v-model="zipCode" label="ZIP Code"></v-text-field>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
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
import type { Address } from '@/interfaces/Address';
import type { AddressPost } from '@/interfaces/AddressPost';

const props = defineProps<{
    modelValue: boolean;
    address: Address | null;
    studentId: number;
}>();

const emit = defineEmits(['update:modelValue', 'update']);

const internalDialog = ref(props.modelValue);
const localAddress = ref<string>(props.address?.street || '');
const city = ref<string>(props.address?.city || '');
const state = ref<string>(props.address?.state || '');
const zipCode = ref<string>(props.address?.zipCode || '');

const rules = { localAddress: { required } };
const v$ = useVuelidate(rules, { localAddress });

const errorMessages = computed(() =>
    v$.value.localAddress?.$errors.map(e => e.$message.toString()) || []
);

watch(() => props.modelValue, (newVal) => {
    internalDialog.value = newVal;
});

watch(() => props.address, (newAddressValue) => {
    localAddress.value = newAddressValue?.street || '';
    city.value = newAddressValue?.city || '';
    state.value = newAddressValue?.state || '';
    zipCode.value = newAddressValue?.zipCode || '';
});

watch(internalDialog, (newVal) => {
    emit('update:modelValue', newVal);
});

const submit = () => {
    v$.value.$touch();
    if (!v$.value.$invalid) {
        if (props.address) {
            const addressPost: AddressPost = {
                street: localAddress.value,
                city: city.value,
                state: state.value,
                zipCode: zipCode.value,
                studentId: props.address.addressId
            };
            emit('update', addressPost);
        }
        close();
    }
};

const close = () => {
    internalDialog.value = false;
    emit('update:modelValue', false);
    v$.value.$reset();
    localAddress.value = '';
    city.value = '';
    state.value = '';
    zipCode.value = '';
};
</script>
