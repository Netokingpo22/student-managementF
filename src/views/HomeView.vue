<template>
  <div class="flex justify-center items-center w-4/6 h-screen">
    <v-card title="Students" flat>
      <template v-slot:text>
        <v-text-field v-model="search" label="Search" prepend-inner-icon="mdi-magnify" variant="outlined" hide-details
          single-line></v-text-field>
      </template>
      <v-data-table :headers="headers" :items="students" :search="search">
        <template v-slot:[`item.action`]="{ item }">
          <v-btn @click="goToStudentDetails(item.studentId)">Details</v-btn>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import type { StudentDTO } from '@/interfaces/StudentDTO';
import { StudentDTOService } from '@/services/studentDTOService';

const router = useRouter();

const search = ref('');
const headers = ref([
  { key: 'studentId', title: 'Id' },
  { key: 'fullName', title: 'Name' },
  { key: 'hasEmails', title: 'Email' },
  { key: 'hasAddresses', title: 'Address' },
  { key: 'hasPhones', title: 'Phone' },
  { key: 'action', title: 'Action', sortable: false }
]);

const students = ref<StudentDTO[]>([]);
const fetchStudents = async () => {
  try {
    students.value = await StudentDTOService.fetchStudents();
  } catch (error) {
    console.error('Error fetching students:', error);
  }
};

const goToStudentDetails = (id: number) => {
  router.push({ name: 'studentDetails', params: { id } });
};

onMounted(() => {
  fetchStudents();
});
</script>

<style scoped></style>