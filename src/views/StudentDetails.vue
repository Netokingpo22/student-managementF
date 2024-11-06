<template>
    <div>
        <div v-if="student">
            <p><strong>ID:</strong> {{ student.studentId }}</p>
            <p><strong>First Name:</strong> {{ student.firstName }}</p>
            <p><strong>Middle Name:</strong> {{ student.middleName }}</p>
            <p><strong>Last Name:</strong> {{ student.lastName }}</p>
            <p><strong>Gender:</strong> {{ student.gender }}</p>

            <h2>Emails</h2>
            <EmailComponent :emails="student.emails" :studentId="student.studentId" />

            <h2>Addresses</h2>
            <AddressComponent :addresses="student.addresses" :studentId="student.studentId" />

            <h2>Phones</h2>
            <PhoneComponent :phones="student.phones" :studentId="student.studentId" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { StudentService } from '@/services/studentService';
import type { Student } from '@/interfaces/Student';
import EmailComponent from '../components/EmailComponent.vue';
import AddressComponent from '../components/AddressComponent.vue';
import PhoneComponent from '../components/PhoneComponent.vue';

const route = useRoute();
const studentId = ref<string | string[]>(route.params.id);
const student = ref<Student | null>(null);

const fetchStudentDetails = async () => {
    try {
        const id = Array.isArray(studentId.value) ? parseInt(studentId.value[0]) : parseInt(studentId.value);
        student.value = await StudentService.fetchStudentDetails(id);
    } catch (error) {
        console.error('Error fetching student details:', error);
    }
};

onMounted(() => {
    fetchStudentDetails();
});
</script>

<style scoped></style>
