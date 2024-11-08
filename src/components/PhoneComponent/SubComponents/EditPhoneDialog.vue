<template>
    <v-dialog v-model="internalDialog" max-width="500px">
        <v-card>
            <v-card-title>
                <span class="text-h5">Edit Phone</span>
            </v-card-title>
            <v-card-text>
                <v-form ref="editForm" @submit.prevent="submit" novalidate>
                    <v-text-field v-model="localPhone" label="Phone Number" type="number"
                        :error-messages="errorMessages.localPhone" required placeholder="123-456-7890"></v-text-field>
                    <v-select v-model="phoneType" :items="phoneTypes" label="Phone Type"
                        :error-messages="errorMessages.phoneType"></v-select>
                    <v-text-field v-model="countryCode" label="Country Code (Optional)" type="tel"
                        :error-messages="errorMessages.countryCode" placeholder="Enter country code"></v-text-field>
                    <v-text-field v-model="areaCode" label="Area Code (Optional)" type="tel"
                        :error-messages="errorMessages.areaCode" placeholder="Enter area code"></v-text-field>
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
import { maxLength, minLength, required } from '@vuelidate/validators';
import type { Phone, PhonePost } from '@/interfaces/PhoneInterfaces';

const props = defineProps<{
    modelValue: boolean;
    phone: Phone | null;
    studentId: number;
}>();

const emit = defineEmits(['update:modelValue', 'update']);

const internalDialog = ref(props.modelValue);
const localPhone = ref<string>(props.phone?.phoneNumber || '');
const countryCode = ref<string>(props.phone?.countryCode || '');
const areaCode = ref<string>(props.phone?.areaCode || '');
const phoneType = ref<string>(props.phone?.phoneType || 'MOBILE');

const rules = {
    localPhone: {
        required,
        minLength: minLength(5),
        maxLength: maxLength(15)
    },
    countryCode: {
        minLength: minLength(2),
        maxLength: maxLength(5)
    },
    areaCode: {
        minLength: minLength(2),
        maxLength: maxLength(5)
    },
    phoneType: {
        required
    }
};

const v$ = useVuelidate(rules, { localPhone, countryCode, areaCode, phoneType });

const errorMessages = computed(() => ({
    localPhone: v$.value.localPhone.$errors.map(e => e.$message.toString()),
    countryCode: v$.value.countryCode?.$errors.map(e => e.$message.toString()),
    areaCode: v$.value.areaCode?.$errors.map(e => e.$message.toString()),
    phoneType: v$.value.phoneType?.$errors.map(e => e.$message.toString()),
}));

const phoneTypes = ['MOBILE', 'HOME', 'WORK'];

watch(() => props.modelValue, (newVal) => {
    internalDialog.value = newVal;
});

watch(() => props.phone, (newPhoneValue) => {
    localPhone.value = newPhoneValue?.phoneNumber || '';
    countryCode.value = newPhoneValue?.countryCode || '';
    areaCode.value = newPhoneValue?.areaCode || '';
    phoneType.value = newPhoneValue?.phoneType || 'MOBILE';
});

watch(internalDialog, (newVal) => {
    emit('update:modelValue', newVal);
});

const submit = () => {
    v$.value.$touch();
    if (!v$.value.$invalid) {
        if (props.phone) {
            const phonePost: PhonePost = {
                phoneNumber: localPhone.value,
                countryCode: countryCode.value,
                areaCode: areaCode.value,
                phoneType: phoneType.value,
                studentId: props.phone.phoneId
            };
            emit('update', phonePost);
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
