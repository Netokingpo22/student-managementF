<template>
  <div class="flex justify-center items-center w-full h-screen">
    <div class="w-4/6 h-5/6">
      <div class="flex justify-between">
        <p class="text-3xl"><strong>Student</strong></p>
        <v-btn @click="dialogVisible = true" variant="tonal" color="success">Student&nbsp;<v-icon
            icon="mdi-plus"></v-icon></v-btn>
      </div>
      <v-card flat>
        <template v-slot:text>
          <v-text-field v-model="search" label="Search" prepend-inner-icon="mdi-magnify" variant="outlined" hide-details
            single-line></v-text-field>
        </template>
        <v-data-table :headers="headers" :items="students" :search="search" item-key="studentId" :loading="isLoading">
          <template v-slot:[`item.hasEmails`]="{ item }">
            <v-icon color="green-lighten-2" v-if="item.hasEmails">mdi-email</v-icon>
            <v-icon color="red-lighten-2" v-else>mdi-email-off</v-icon>
          </template>
          <template v-slot:[`item.hasAddresses`]="{ item }">
            <v-icon color="green-lighten-2" v-if="item.hasAddresses">mdi-map-marker</v-icon>
            <v-icon color="red-lighten-2" v-else>mdi-map-marker-off</v-icon>
          </template>
          <template v-slot:[`item.hasPhones`]="{ item }">
            <v-icon color="green-lighten-2" v-if="item.hasPhones">mdi-phone</v-icon>
            <v-icon color="red-lighten-2" v-else>mdi-phone-off</v-icon>
          </template>
          <template v-slot:[`item.action`]="{ item }">
            <v-btn @click="goToStudentDetails(item.studentId)" variant="tonal" color="warning">DETAILS&nbsp;<v-icon
                icon="mdi-arrow-collapse-right"></v-icon></v-btn>
          </template>
        </v-data-table>
      </v-card>

      <v-dialog v-model="dialogVisible" max-width="600px">
        <v-card>
          <v-card-title>
            <span class="text-h5">Add New Student</span>
          </v-card-title>
          <v-card-text>
            <v-form ref="studentForm" @submit.prevent="submitStudentForm">
              <v-text-field v-model="newStudent.firstName" label="First Name" :error-messages="errorMessages.firstName"
                required></v-text-field>
              <v-text-field v-model="newStudent.middleName" label="Middle Name"></v-text-field>
              <v-text-field v-model="newStudent.lastName" label="Last Name" :error-messages="errorMessages.lastName"
                required></v-text-field>
              <v-select v-model="newStudent.gender" :items="genders" label="Gender"
                :error-messages="errorMessages.gender" required></v-select>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="dialogVisible = false" variant="tonal" color="error">Cancel<v-icon
                icon="mdi-close"></v-icon></v-btn>
            <v-btn @click="submitStudentForm" variant="tonal" color="success">Submit<v-icon
                icon="mdi-check"></v-icon></v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-snackbar v-model="snackbarVisible" :color="snackbarColor" timeout="3000">
        {{ snackbarMessage }}
        <v-btn @click="snackbarVisible = false">Close</v-btn>
      </v-snackbar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { StudentDTOService } from '@/services/studentDTOService';
import { StudentService } from '@/services/StudentService';
import type { Student, StudentDTO, StudentPost } from '@/interfaces/StudentInterfaces';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';

const router = useRouter();

const search = ref('');
const students = ref<StudentDTO[]>([]);
const isLoading = ref(true);
const dialogVisible = ref(false);

const snackbarVisible = ref(false);
const snackbarMessage = ref('');
const snackbarColor = ref('');

const newStudent = ref<StudentPost>({
  firstName: '',
  middleName: '',
  lastName: '',
  gender: 'OTHER',
});

const genders = ['OTHER', 'FEMALE', 'MALE'];

const headers = ref([
  { key: 'studentId', title: 'Id' },
  { key: 'fullName', title: 'Name' },
  { key: 'hasEmails', title: 'Email' },
  { key: 'hasAddresses', title: 'Address' },
  { key: 'hasPhones', title: 'Phone' },
  { key: 'action', title: 'Action', sortable: false },
]);

const rules = {
  firstName: { required },
  lastName: { required },
  gender: { required },
};

const v$ = useVuelidate(rules, newStudent);

const errorMessages = computed(() => ({
  firstName: v$.value.firstName.$errors.map(e => e.$message.toString()),
  lastName: v$.value.lastName.$errors.map(e => e.$message.toString()),
  gender: v$.value.gender.$errors.map(e => e.$message.toString()),
}));

const fetchStudents = async () => {
  try {
    isLoading.value = true;
    students.value = await StudentDTOService.fetchStudents();
  } catch (error) {
    console.error('Error fetching students:', error);
    showSnackbar('Error fetching students!', 'red');
  } finally {
    isLoading.value = false;
  }
};

const submitStudentForm = async () => {
  v$.value.$touch();
  if (v$.value.$invalid) {
    return;
  }
  try {
    const studentData = newStudent.value;
    const createdStudent = await StudentService.createStudent(studentData);
    const studentDTO = transformToStudentDTO(createdStudent);
    students.value.push(studentDTO);
    dialogVisible.value = false;
    showSnackbar('Student created successfully!', 'green');
  } catch (error) {
    console.error('Error creating student:', error);
    showSnackbar('Error creating student!', 'red');
  }
};

const transformToStudentDTO = (student: Student): StudentDTO => {
  return {
    studentId: student.studentId,
    fullName: `${student.firstName} ${student.middleName || ''} ${student.lastName}`.trim(),
    gender: student.gender,
    hasEmails: (student.emails?.length ?? 0) > 0,
    hasAddresses: (student.addresses?.length ?? 0) > 0,
    hasPhones: (student.phones?.length ?? 0) > 0,
  };
};

const goToStudentDetails = (id: number) => {
  router.push({ name: 'studentDetails', params: { id } });
};

const showSnackbar = (message: string, color: string) => {
  snackbarMessage.value = message;
  snackbarColor.value = color;
  snackbarVisible.value = true;
};

onMounted(() => {
  fetchStudents();
});
</script>
