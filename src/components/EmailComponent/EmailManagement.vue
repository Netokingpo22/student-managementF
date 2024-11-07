<template>
    <div>
        <EmailTable :emails="localEmails" @edit="editEmail" @delete="openDeleteDialog" />
        <v-btn @click="showAddEmailDialog = true" color="primary">Add Email</v-btn>
        <AddEmailDialog v-model="showAddEmailDialog" :email="editingEmail" :studentId="props.studentId"
            @add="addEmail" />
        <EditEmailDialog v-model="showEditEmailDialog" :email="editingEmail" :studentId="props.studentId"
            @update="updateEmail" />
        <DeleteConfirmationDialog v-model="isDeleteDialogVisible" @confirm="deleteEmail" />
        <v-snackbar v-model="snackbarVisible" :color="snackbarColor" timeout="3000">
            {{ snackbarMessage }}
            <v-btn color="pink" @click="snackbarVisible = false">Close</v-btn>
        </v-snackbar>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import EmailTable from '@/components/EmailComponent/SubComponents/EmailTable.vue';
import AddEmailDialog from '@/components/EmailComponent/SubComponents/AddEmailDialog.vue';
import EditEmailDialog from '@/components/EmailComponent/SubComponents/EditEmailDialog.vue';
import DeleteConfirmationDialog from '@/components/EmailComponent/SubComponents/DeleteConfirmationDialog.vue';
import { EmailService } from '@/services/emailService';
import { useSnackbar } from '@/components/Composables/useSnackbar';
import type { Email } from '@/interfaces/Email';
import type { EmailPost } from '@/interfaces/EmailPost';

const props = defineProps<{ emails: Email[], studentId: number }>();
const emit = defineEmits(['update:emails']);

const localEmails = ref([...props.emails]);
const showAddEmailDialog = ref(false);
const showEditEmailDialog = ref(false);
const isDeleteDialogVisible = ref(false);
const editingEmail = ref<Email | null>(null);
const emailIdToDelete = ref<number | null>(null);

const { snackbarVisible, snackbarMessage, snackbarColor, showSnackbar } = useSnackbar();

const addEmail = async (newEmailPost: EmailPost) => {
    try {
        const emailResponse = await EmailService.addEmail(newEmailPost);
        localEmails.value.push(emailResponse);
        emit('update:emails', localEmails.value);
        showSnackbar('Email added successfully!', 'green');
    } catch (error) {
        console.error('Error adding email:', error);
        showSnackbar('Error adding email!', 'red');
    }
};

const editEmail = (email: Email) => {
    editingEmail.value = email;
    showEditEmailDialog.value = true;
};

const updateEmail = async (updatedEmail: EmailPost) => {
    try {
        const email = await EmailService.updateEmail(updatedEmail, updatedEmail.studentId);
        const index = localEmails.value.findIndex(e => e.emailId === email.emailId);
        localEmails.value[index] = email;
        emit('update:emails', localEmails.value);
        showSnackbar('Email updated successfully!', 'green');
    } catch (error) {
        console.error('Error updating email:', error);
        showSnackbar('Error updating email!', 'red');
    }
};

const deleteEmail = async () => {
    if (emailIdToDelete.value !== null) {
        try {
            await EmailService.deleteEmail(emailIdToDelete.value);
            localEmails.value = localEmails.value.filter(email => email.emailId !== emailIdToDelete.value);
            emit('update:emails', localEmails.value);
            showSnackbar('Email deleted successfully!', 'green');
        } catch (error) {
            console.error('Error deleting email:', error);
            showSnackbar('Error deleting email!', 'red');
        }
    }
};

const openDeleteDialog = (emailId: number) => {
    emailIdToDelete.value = emailId;
    isDeleteDialogVisible.value = true;
};
</script>
