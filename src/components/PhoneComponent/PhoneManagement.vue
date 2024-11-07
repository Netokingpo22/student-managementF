<template>
    <div>
        <PhoneTable :phones="localPhones" @edit="editPhone" @delete="openDeleteDialog" />
        <v-btn @click="showAddPhoneDialog = true" color="primary">Add Phone</v-btn>
        <AddPhoneDialog v-model="showAddPhoneDialog" :phone="editingPhone" :studentId="props.studentId"
            @add="addPhone" />
        <EditPhoneDialog v-model="showEditPhoneDialog" :phone="editingPhone" :studentId="props.studentId"
            @update="updatePhone" />
        <DeleteConfirmationDialog v-model="isDeleteDialogVisible" @confirm="deletePhone" />
        <v-snackbar v-model="snackbarVisible" :color="snackbarColor" timeout="3000">
            {{ snackbarMessage }}
            <v-btn color="pink" @click="snackbarVisible = false">Close</v-btn>
        </v-snackbar>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import PhoneTable from './SubComponents/PhoneTable.vue';
import AddPhoneDialog from './SubComponents/AddPhoneDialog.vue';
import EditPhoneDialog from './SubComponents/EditPhoneDialog.vue';
import DeleteConfirmationDialog from './SubComponents/DeleteConfirmationDialog.vue';
import { PhoneService } from '@/services/phoneService';
import { useSnackbar } from '@/components/Composables/useSnackbar';
import type { Phone } from '@/interfaces/Phone';
import type { PhonePost } from '../../interfaces/PhonePost';


const props = defineProps<{ phones: Phone[], studentId: number }>();
const emit = defineEmits(['update:phones']);

const localPhones = ref([...props.phones]);
const showAddPhoneDialog = ref(false);
const showEditPhoneDialog = ref(false);
const isDeleteDialogVisible = ref(false);
const editingPhone = ref<Phone | null>(null);
const phoneIdToDelete = ref<number | null>(null);

const { snackbarVisible, snackbarMessage, snackbarColor, showSnackbar } = useSnackbar();

const addPhone = async (newPhonePost: PhonePost) => {
    try {
        const phoneResponse = await PhoneService.addPhone(newPhonePost);
        localPhones.value.push(phoneResponse);
        emit('update:phones', localPhones.value);
        showSnackbar('Phone added successfully!', 'green');
    } catch (error) {
        console.error('Error adding phone:', error);
        showSnackbar('Error adding phone!', 'red');
    }
};

const editPhone = (phone: Phone) => {
    editingPhone.value = phone;
    showEditPhoneDialog.value = true;
};

const updatePhone = async (updatedPhone: PhonePost) => {
    try {
        const phone = await PhoneService.updatePhone(updatedPhone, updatedPhone.studentId);
        const index = localPhones.value.findIndex(p => p.phoneId === phone.phoneId);
        localPhones.value[index] = phone;
        emit('update:phones', localPhones.value);
        showSnackbar('Phone updated successfully!', 'green');
    } catch (error) {
        console.error('Error updating phone:', error);
        showSnackbar('Error updating phone!', 'red');
    }
};

const deletePhone = async () => {
    if (phoneIdToDelete.value !== null) {
        try {
            await PhoneService.deletePhone(phoneIdToDelete.value);
            localPhones.value = localPhones.value.filter(phone => phone.phoneId !== phoneIdToDelete.value);
            emit('update:phones', localPhones.value);
            showSnackbar('Phone deleted successfully!', 'green');
        } catch (error) {
            console.error('Error deleting phone:', error);
            showSnackbar('Error deleting phone!', 'red');
        }
    }
};

const openDeleteDialog = (phoneId: number) => {
    phoneIdToDelete.value = phoneId;
    isDeleteDialogVisible.value = true;
};
</script>
