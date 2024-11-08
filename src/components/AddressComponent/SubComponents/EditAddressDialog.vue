<template>
    <v-dialog v-model="internalDialog" max-width="500px">
        <v-card>
            <v-card-title>
                <span class="text-h5">Edit Address</span>
            </v-card-title>
            <v-card-text>
                <v-form ref="editForm" @submit.prevent="submit" novalidate>
                    <v-text-field v-model="localAddress" label="Street" :error-messages="errorMessages.street" required
                        placeholder="Enter street address" />
                    <v-text-field v-model="city" label="City (Optional)" placeholder="Enter city"
                        :error-messages="errorMessages.city" />
                    <v-text-field v-model="state" label="State (Optional)" placeholder="Enter state"
                        :error-messages="errorMessages.state" />
                    <v-text-field v-model="zipCode" label="Zip Code (Optional)" type="number"
                        placeholder="Enter zip code" :error-messages="errorMessages.zipCode" />
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="close" variant="tonal" color="error">Cancel&nbsp;<v-icon
                        icon="mdi-close"></v-icon></v-btn>
                <v-btn @click="submit" variant="tonal" color="primary">Update&nbsp;<v-icon
                        icon="mdi-check"></v-icon></v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, maxLength } from '@vuelidate/validators';
import type { Address, AddressPost } from '@/interfaces/AddressInterfaces';

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

const rules = {
    localAddress: { required, minLength: minLength(3), maxLength: maxLength(100) },
    city: { minLength: minLength(3), maxLength: maxLength(100) },
    state: { minLength: minLength(2), maxLength: maxLength(45) },
    zipCode: { minLength: minLength(5), maxLength: maxLength(10) }
};

const v$ = useVuelidate(rules, { localAddress, city, state, zipCode });

const errorMessages = computed(() => ({
    street: v$.value.localAddress.$errors.map(e => e.$message.toString()),
    city: v$.value.city?.$errors.map(e => e.$message.toString()) || [],
    state: v$.value.state?.$errors.map(e => e.$message.toString()) || [],
    zipCode: v$.value.zipCode?.$errors.map(e => e.$message.toString()) || []
}));

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
};
</script>
