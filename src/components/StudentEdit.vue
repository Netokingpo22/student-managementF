<template>
    <v-dialog v-model="internalDialogVisible" max-width="500px">
        <v-card>
            <v-card-title>
                <span class="text-h5">Edit Student Details</span>
            </v-card-title>
            <v-card-text>
                <v-form ref="editForm" @submit.prevent="submit" novalidate>
                    <v-text-field v-model="localStudent.firstName" label="First Name"
                        :error-messages="errorMessages.firstName" required placeholder="John"></v-text-field>
                    <v-text-field v-model="localStudent.middleName" label="Middle Name (Optional)"
                        :error-messages="errorMessages.middleName" placeholder="Alexander"></v-text-field>
                    <v-text-field v-model="localStudent.lastName" label="Last Name"
                        :error-messages="errorMessages.lastName" required placeholder="Doe"></v-text-field>
                    <v-select v-model="localStudent.gender" :items="genders" label="Gender"
                        :error-messages="errorMessages.gender" required></v-select>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-btn @click="close" variant="tonal" color="error">Cancel&nbsp;<v-icon
                        icon="mdi-close"></v-icon></v-btn>
                <v-btn @click="submit" variant="tonal" color="primary">update&nbsp;<v-icon
                        icon="mdi-check"></v-icon></v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbarVisible" :color="snackbarColor" timeout="3000">
        {{ snackbarMessage }}
        <v-btn @click="snackbarVisible = false">Close</v-btn>
    </v-snackbar>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits, computed } from 'vue';
import { StudentService } from '@/services/StudentService';
import { useSnackbar } from '@/components/Composables/useSnackbar';
import type { Student } from '@/interfaces/StudentInterfaces';
import useVuelidate from '@vuelidate/core';
import { maxLength, minLength, required } from '@vuelidate/validators';

const props = defineProps<{
    student: Student | null;
    dialogVisible: boolean;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
    (e: 'updateStudent', student: Student): void;
}>();

const genders = ['OTHER', 'FEMALE', 'MALE'];

const internalDialogVisible = ref(props.dialogVisible);

const { snackbarVisible, snackbarMessage, snackbarColor, showSnackbar } = useSnackbar();

watch(() => props.dialogVisible, (newVal) => {
    internalDialogVisible.value = newVal;
});

watch(internalDialogVisible, (newVal) => {
    emit('update:modelValue', newVal);
});
const originalStudent = ref<Student>({ ...props.student! });
const localStudent = ref<Student>({ ...props.student! });

watch(() => props.student, (newStudent) => {
    originalStudent.value = { ...newStudent! };
    localStudent.value = { ...newStudent! };
});

const rules = {
    firstName: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(45),
    },
    middleName: {
        minLength: minLength(3),
        maxLength: maxLength(45),
    },
    lastName: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(45),
    },
    gender: { required },
};

const v$ = useVuelidate(rules, localStudent);

const errorMessages = computed(() => ({
    firstName: v$.value.firstName.$errors.map(e => e.$message.toString()),
    middleName: v$.value.middleName.$errors.map(e => e.$message.toString()),
    lastName: v$.value.lastName.$errors.map(e => e.$message.toString()),
    gender: v$.value.gender.$errors.map(e => e.$message.toString()),
}));

const close = () => {
    emit('update:modelValue', false);
};

const submit = async () => {
    v$.value.$touch();
    if (v$.value.$invalid) {
        return;
    }
    try {
        if (localStudent.value?.studentId && localStudent.value.studentId > 0) {
            await StudentService.updateStudent(localStudent.value.studentId, localStudent.value);
            originalStudent.value = { ...localStudent.value };
            emit('updateStudent', localStudent.value);
            showSnackbar('Student updated successfully!', 'green');
            close();
        }
    } catch (error) {
        console.error('Error updating student:', error);
        showSnackbar('Error updating student!', 'red');
        localStudent.value = { ...originalStudent.value };
    }
};
</script>
