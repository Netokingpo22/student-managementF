<template>
    <div>
        <ul>
            <li v-for="email in emails" :key="email.emailId">
                {{ email.email }}
                <button @click="deleteEmail(email.emailId)">Delete</button>
            </li>
        </ul>
        <div>
            <input v-model="newEmail" placeholder="Enter new email" />
            <button @click="addEmail">Add Email</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { EmailService } from '@/services/emailService';
import type { Email } from '@/interfaces/Email';

const props = defineProps<{ emails: Email[], studentId: number }>();

const newEmail = ref('');
const emailType = ref('PERSONAL'); // Suponemos que el tipo de email es "PERSONAL"

const addEmail = async () => {
    try {
        const email = await EmailService.addEmail(props.studentId, newEmail.value, emailType.value);
        props.emails.push(email); // Actualiza la lista de emails con el nuevo email

        newEmail.value = ''; // Limpia el campo de entrada
    } catch (error) {
        console.error('Error adding email:', error);
    }
};

const deleteEmail = async (emailId: number) => {
    try {
        await EmailService.deleteEmail(emailId);
        props.emails = props.emails.filter(email => email.emailId !== emailId); // Eliminar email de la lista localmente
    } catch (error) {
        console.error('Error deleting email:', error);
    }
};
</script>

<style scoped></style>
