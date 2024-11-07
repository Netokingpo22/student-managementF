<template>
    <v-dialog v-model="internalDialog" max-width="500px">
        <v-card>
            <v-card-title>
                <span class="text-h5">Add Phone</span>
            </v-card-title>
            <v-card-text>
                <v-form ref="addForm">
                    <v-text-field v-model="newPhone.phoneNumber" label="Phone Number" type="tel"
                        :error-messages="errorMessages.phoneNumber" required />
                    <v-select v-model="newPhone.phoneType" :items="phoneTypes" label="Phone Type"
                        :error-messages="errorMessages.phoneType" required />
                    <v-text-field v-model="newPhone.countryCode" label="Country Code" />
                    <v-text-field v-model="newPhone.areaCode" label="Area Code" />
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
import type { PhonePost } from '@/interfaces/PhonePost';
import type { Phone } from '@/interfaces/Phone';

const props = defineProps<{
    modelValue: boolean;
    phone: Phone | null;
    studentId: number;
}>();

const emit = defineEmits(['update:modelValue', 'add']);

const internalDialog = ref(props.modelValue);

const newPhone = ref<PhonePost>({
    phoneNumber: props.phone?.phoneNumber || '',
    phoneType: props.phone?.phoneType || 'MOBILE',
    countryCode: props.phone?.countryCode || '',
    areaCode: props.phone?.areaCode || '',
    studentId: props.studentId
});

const phoneTypes = ['MOBILE', 'HOME', 'WORK'];

const rules = {
    phoneNumber: { required },
    phoneType: { required }
};

const v$ = useVuelidate(rules, newPhone);

const errorMessages = computed(() => ({
    phoneNumber: v$.value.phoneNumber.$errors.map(e => e.$message.toString()),
    phoneType: v$.value.phoneType.$errors.map(e => e.$message.toString())
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
        const phonePost: PhonePost = {
            phoneNumber: newPhone.value.phoneNumber,
            phoneType: newPhone.value.phoneType,
            countryCode: newPhone.value.countryCode,
            areaCode: newPhone.value.areaCode,
            studentId: newPhone.value.studentId,
        };
        emit('add', phonePost);
        close();
    }
};

const close = () => {
    internalDialog.value = false;
    emit('update:modelValue', false);
    v$.value.$reset();
    newPhone.value = {
        phoneNumber: '',
        phoneType: 'MOBILE',
        countryCode: '',
        areaCode: '',
        studentId: props.studentId,
    };
};
</script>
