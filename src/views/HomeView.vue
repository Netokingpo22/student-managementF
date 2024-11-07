<template>
  <div class="flex justify-center items-center w-full h-screen">
    <div class="w-4/6 h-5/6">
      <v-card title="Students" flat>
        <template v-slot:text>
          <v-text-field v-model="search" label="Search" prepend-inner-icon="mdi-magnify" variant="outlined" hide-details
            single-line></v-text-field>
        </template>
        <v-data-table :headers="headers" :items="students" :search="search" item-key="studentId" :loading="isLoading">
          <template v-slot:[`item.action`]="{ item }">
            <v-btn @click="goToStudentDetails(item.studentId)" color="primary" small>
              Details
            </v-btn>
          </template>
        </v-data-table>
        <v-btn @click="dialogVisible = true" color="success" class="mt-3">Add New Student</v-btn>
      </v-card>
      <v-dialog v-model="dialogVisible" max-width="600px">
        <v-card>
          <v-card-title>
            <span class="text-h5">Add New Student</span>
          </v-card-title>
          <v-card-text>
            <v-form ref="studentForm" @submit.prevent="submitStudentForm">
              <v-text-field v-model="newStudent.firstName" label="First Name" required></v-text-field>
              <v-text-field v-model="newStudent.middleName" label="Middle Name"></v-text-field>
              <v-text-field v-model="newStudent.lastName" label="Last Name" required></v-text-field>
              <v-select v-model="newStudent.gender" :items="genders" label="Gender" required></v-select>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="dialogVisible = false" color="blue darken-1">Cancel</v-btn>
            <v-btn @click="submitStudentForm" color="green darken-1">Submit</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { StudentDTOService } from '@/services/studentDTOService';
import type { StudentDTO } from '@/interfaces/StudentDTO';
import { StudentService } from '@/services/StudentService';
import type { Student } from '@/interfaces/Student';
import type { StudentPost } from '@/interfaces/StudentPost';

const router = useRouter();

const search = ref('');
const students = ref<StudentDTO[]>([]);
const isLoading = ref(true);
const dialogVisible = ref(false);

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
  { key: 'action', title: 'Action', sortable: false }
]);

const fetchStudents = async () => {
  try {
    isLoading.value = true;
    students.value = await StudentDTOService.fetchStudents();
  } catch (error) {
    console.error('Error fetching students:', error);
  } finally {
    isLoading.value = false;
  }
};

const submitStudentForm = async () => {
  try {
    const studentData = newStudent.value;
    const createdStudent = await StudentService.createStudent(studentData);
    const studentDTO = transformToStudentDTO(createdStudent);
    console.log(studentDTO);
    students.value.push(studentDTO);
    dialogVisible.value = false;
  } catch (error) {
    console.error('Error creating student:', error);
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

onMounted(() => {
  fetchStudents();
});
</script>

<style scoped></style>
