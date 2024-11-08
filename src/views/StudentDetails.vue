<template>
    <div class="flex justify-center items-start w-full h-screen pt-36">
        <div v-if="student" class="flex flex-col gap-y-1 w-4/6">
            <div class="border-b-4">
                <div class="flex justify-between pt-4">
                    <div class="flex flex-row order-first">
                        <v-btn @click="exitStudent" color="warning" class="mr-4" variant="tonal"><v-icon
                                icon="mdi-chevron-left" size="x-large"></v-icon>back</v-btn>
                        <p class="text-3xl"><strong>Student details</strong></p>
                    </div>
                    <div class="order-last">
                        <v-btn @click="dialogVisible = true" color="primary" variant="tonal" class="mx-1">Edit&nbsp;
                            <v-icon icon="mdi-pencil"></v-icon></v-btn>
                        <v-btn @click=" showDeleteDialog = true" variant="tonal" color="error">Delete&nbsp;<v-icon
                                icon="mdi-delete"></v-icon>
                        </v-btn>
                    </div>
                </div>
                <div class="flex flex-row gap-x-5">
                    <p><strong>ID:</strong> {{ student.studentId }}</p>
                </div>
                <div class="flex flex-row gap-x-5">
                    <p><strong>First Name:</strong> {{ student.firstName }}</p>
                    <p><strong>Middle Name:</strong> {{ student.middleName }}</p>
                    <p><strong>Last Name:</strong> {{ student.lastName }}</p>
                </div>
                <div class="flex flex-row gap-x-5 pb-4">
                    <p><strong>Gender:</strong> {{ student.gender }}</p>
                    <p><strong>CreatedOn:</strong> {{ student.createdOn }}</p>
                    <p><strong>UpdatedOn:</strong> {{ student.updatedOn }}</p>
                </div>
            </div>
            <EmailManagement :emails="student.emails" :studentId="student.studentId" />
            <AddressManagement :addresses="student.addresses" :studentId="student.studentId" />
            <PhoneManagement :phones="student.phones" :studentId="student.studentId" />
            <div class="pb-20"></div>
            <StudentEdit :student="student" :dialogVisible="dialogVisible" @update:modelValue="dialogVisible = $event"
                @updateStudent="updateStudent" />
            <DeleteConfirmationDialog v-model="showDeleteDialog" @confirm="deleteStudent" />
        </div>
        <v-snackbar v-model="snackbarVisible" :color="snackbarColor" timeout="3000">
            {{ snackbarMessage }}
            <v-btn @click="snackbarVisible = false">Close</v-btn>
        </v-snackbar>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { StudentService } from '@/services/StudentService';
import type { Student } from '@/interfaces/StudentInterfaces';
import EmailManagement from '@/components/EmailComponent/EmailManagement.vue';
import AddressManagement from '@/components/AddressComponent/AddressManagement.vue';
import PhoneManagement from '@/components/PhoneComponent/PhoneManagement.vue';
import StudentEdit from '../components/StudentEdit.vue';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog.vue';
import { useSnackbar } from '@/components/Composables/useSnackbar';

const { snackbarVisible, snackbarMessage, snackbarColor, showSnackbar } = useSnackbar();

const route = useRoute();
const router = useRouter();
const studentId = ref<string | string[]>(route.params.id);
const student = ref<Student | null>(null);
const dialogVisible = ref(false);
const showDeleteDialog = ref(false);

const fetchStudentDetails = async () => {
    try {
        const id = Array.isArray(studentId.value) ? parseInt(studentId.value[0]) : parseInt(studentId.value);
        student.value = await StudentService.fetchStudentDetails(id);
    } catch (error) {
        console.error('Error fetching student details:', error);
        showSnackbar('Error fetching student details!', 'red');
    }
};

const updateStudent = (updatedStudent: Student) => {
    student.value = updatedStudent;
};

const deleteStudent = async () => {
    try {
        if (student.value) {
            await StudentService.deleteStudent(student.value.studentId);
            showSnackbar('Student deleted successfully!', 'green');
            setTimeout(() => {
                router.push('/');
            }, 1000);
        }
    } catch (error) {
        console.error('Error deleting student:', error);
        showSnackbar('Error deleting student!', 'red');
    }
};

const exitStudent = () => {
    router.push('/');
};
onMounted(() => {
    fetchStudentDetails();
});
</script>
