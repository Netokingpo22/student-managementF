<template>
    <v-dialog v-model="internalDialog" max-width="500px">
        <v-card>
            <v-card-title>
                <span class="text-h5">Edit Email</span>
            </v-card-title>
            <v-card-text>
                <v-form ref="editForm" @submit.prevent="submit" novalidate>
                    <v-text-field v-model="localEmail" label="Email" type="email" :error-messages="errorMessages"
                        required></v-text-field>
                    <v-select v-model="emailType" :items="emailTypes" label="Email Type" required></v-select>
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
import { required, email as emailValidator, minLength, maxLength } from '@vuelidate/validators';
import type { Email, EmailPost } from '@/interfaces/EmailInterfaces';

const props = defineProps<{
    modelValue: boolean;
    email: Email | null;
    studentId: number;
}>();

const emit = defineEmits(['update:modelValue', 'update']);

const internalDialog = ref(props.modelValue);
const localEmail = ref<string>(props.email?.email || '');
const emailType = ref<string>(props.email?.emailType || 'PERSONAL');

const rules = {
    localEmail: {
        required,
        email: emailValidator,
        minLength: minLength(5),
        maxLength: maxLength(100)
    }
};

const v$ = useVuelidate(rules, { localEmail });

const errorMessages = computed(() =>
    v$.value.localEmail?.$errors.map(e => e.$message.toString()) || []
);

const emailTypes = ['PERSONAL', 'WORK', 'SCHOOL'];

watch(() => props.modelValue, (newVal) => {
    internalDialog.value = newVal;
});

watch(() => props.email, (newEmailValue) => {
    localEmail.value = newEmailValue?.email || '';
    emailType.value = newEmailValue?.emailType || 'PERSONAL';
});

watch(internalDialog, (newVal) => {
    emit('update:modelValue', newVal);
});

const submit = () => {
    v$.value.$touch();
    if (!v$.value.$invalid) {
        if (props.email) {
            const emailPost: EmailPost = {
                email: localEmail.value,
                emailType: emailType.value,
                studentId: props.email.emailId
            };
            emit('update', emailPost);
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
