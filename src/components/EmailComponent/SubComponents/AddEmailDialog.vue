<template>
    <v-dialog v-model="internalDialog" max-width="500px">
        <v-card>
            <v-card-title>
                <span class="text-h5">Add Email</span>
            </v-card-title>
            <v-card-text>
                <v-form ref="addForm">
                    <v-text-field v-model="newEmail.email" label="Email" type="email"
                        :error-messages="errorMessages.email" required />
                    <v-select v-model="newEmail.emailType" :items="emailTypes" label="Email Type"
                        :error-messages="errorMessages.emailType" required />
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
import { required, email as emailValidator } from '@vuelidate/validators';
import type { Email, EmailPost } from '@/interfaces/EmailInterfaces';

const props = defineProps<{
    modelValue: boolean;
    email: Email | null;
    studentId: number;
}>();

const emit = defineEmits(['update:modelValue', 'add']);

const internalDialog = ref(props.modelValue);

const newEmail = ref<Email>({
    email: props.email?.email || '',
    emailType: props.email?.emailType || 'PERSONAL',
    emailId: props.email?.emailId || -1,
});

const emailTypes = ['PERSONAL', 'WORK', 'SCHOOL'];

const rules = {
    email: { required, email: emailValidator },
    emailType: { required },
};

const v$ = useVuelidate(rules, newEmail);

const errorMessages = computed(() => ({
    email: v$.value.email.$errors.map(e => e.$message.toString()),
    emailType: v$.value.emailType.$errors.map(e => e.$message.toString())
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
        const emailPost: EmailPost = {
            email: newEmail.value.email,
            emailType: newEmail.value.emailType,
            studentId: props.studentId
        };
        emit('add', emailPost, props.email?.emailId);
        close();
    }
};


const close = () => {
    internalDialog.value = false;
    emit('update:modelValue', false);
    v$.value.$reset();
    newEmail.value = {
        email: '',
        emailType: 'PERSONAL',
        emailId: -1
    };
};
</script>
