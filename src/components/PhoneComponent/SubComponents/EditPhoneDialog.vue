<template>
    <v-dialog v-model="internalDialog" max-width="500px">
        <v-card>
            <v-card-title>
                <span class="text-h5">Edit Phone</span>
            </v-card-title>
            <v-card-text>
                <v-form ref="editForm" @submit.prevent="submit" novalidate>
                    <v-text-field v-model="localPhone" label="Phone" type="tel" :error-messages="errorMessages"
                        required></v-text-field>
                    <v-select v-model="phoneType" :items="phoneTypes" label="Phone Type" required></v-select>
                    <v-text-field v-model="countryCode" label="Country Code" type="tel" required></v-text-field>
                    <v-text-field v-model="areaCode" label="Area Code" type="tel" required></v-text-field>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="close" variant="tonal" color="error">Cancel&nbsp;<v-icon
                        icon="mdi-close"></v-icon></v-btn>
                <v-btn @click="submit" variant="tonal" color="primary">update&nbsp;<v-icon
                        icon="mdi-check"></v-icon></v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
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

const rules = { localPhone: { required }, countryCode: { required }, areaCode: { required } };
const v$ = useVuelidate(rules, { localPhone, countryCode, areaCode });

const errorMessages = computed(() =>
    v$.value.localPhone?.$errors.map(e => e.$message.toString()) || []
);

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
