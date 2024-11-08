<template>
    <v-dialog v-model="internalDialog" max-width="500px">
        <v-card>
            <v-card-title>
                <span class="text-h5">Add Address</span>
            </v-card-title>
            <v-card-text>
                <v-form ref="addForm">
                    <v-text-field v-model="newAddress.street" label="Street" :error-messages="errorMessages.street"
                        required placeholder="Enter street address" />
                    <v-text-field v-model="newAddress.city" label="City (Optional)" placeholder="Enter city"
                        :error-messages="errorMessages.city" />
                    <v-text-field v-model="newAddress.state" label="State (Optional)" placeholder="Enter state"
                        :error-messages="errorMessages.state" />
                    <v-text-field v-model="newAddress.zipCode" label="Zip Code (Optional)" type="number"
                        placeholder="Enter zip code" :error-messages="errorMessages.zipCode" />
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn @click="close" variant="tonal" color="error">Cancel<v-icon icon="mdi-close"></v-icon></v-btn>
                <v-btn @click="submit" variant="tonal" color="success">Submit<v-icon icon="mdi-check"></v-icon></v-btn>
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
    street: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(100)
    },
    city: {
        minLength: minLength(3),
        maxLength: maxLength(100)
    },
    state: {
        minLength: minLength(3),
        maxLength: maxLength(45)
    },
    zipCode: {
        minLength: minLength(2),
        maxLength: maxLength(10)
    }
};

const v$ = useVuelidate(rules, newAddress);

const errorMessages = computed(() => ({
    street: v$.value.street.$errors.map(e => e.$message.toString()),
    city: v$.value.city.$errors.map(e => e.$message.toString()),
    state: v$.value.state.$errors.map(e => e.$message.toString()),
    zipCode: v$.value.zipCode.$errors.map(e => e.$message.toString())
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
