<template>
    <v-dialog v-model="internalDialogVisible" max-width="500px">
        <v-card>
            <v-card-title>
                <span class="text-h5">Edit Student Details</span>
            </v-card-title>
            <v-card-text>
                <v-form ref="editForm" @submit.prevent="submit" novalidate>
                    <v-text-field v-model="localStudent.firstName" label="First Name" required></v-text-field>
                    <v-text-field v-model="localStudent.middleName" label="Middle Name"></v-text-field>
                    <v-text-field v-model="localStudent.lastName" label="Last Name" required></v-text-field>
                    <v-select v-model="localStudent.gender" :items="genders" label="Gender" required></v-select>
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
import { ref, watch, defineProps, defineEmits } from 'vue';
import { StudentService } from '@/services/StudentService';
import { useSnackbar } from '@/components/Composables/useSnackbar';
import type { Student } from '@/interfaces/StudentInterfaces';

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

const close = () => {
    localStudent.value = { ...originalStudent.value };
    emit('update:modelValue', false);
};

const submit = async () => {
    try {
        if (localStudent.value.studentId > 0) {
            await StudentService.updateStudent(localStudent.value.studentId, localStudent.value);
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
