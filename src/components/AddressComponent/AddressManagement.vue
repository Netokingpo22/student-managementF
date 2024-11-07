<template>
    <div>
        <AddressTable :addresses="localAddresses" @edit="editAddress" @delete="openDeleteDialog" />
        <v-btn @click="showAddAddressDialog = true" color="primary">Add Address</v-btn>

        <AddAddressDialog v-model="showAddAddressDialog" :address="editingAddress" :studentId="props.studentId"
            @add="addAddress" />
        <EditAddressDialog v-model="showEditAddressDialog" :address="editingAddress" :studentId="props.studentId"
            @update="updateAddress" />

        <DeleteConfirmationDialog v-model="isDeleteDialogVisible" @confirm="deleteAddress" />

        <v-snackbar v-model="snackbarVisible" :color="snackbarColor" timeout="3000">
            {{ snackbarMessage }}
            <v-btn color="pink" @click="snackbarVisible = false">Close</v-btn>
        </v-snackbar>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AddressTable from './SubComponents/AddressTable.vue';
import AddAddressDialog from './SubComponents/AddAddressDialog.vue';
import EditAddressDialog from './SubComponents/EditAddressDialog.vue';
import DeleteConfirmationDialog from './SubComponents/DeleteConfirmationDialog.vue';
import { AddressService } from '@/services/addressService';
import { useSnackbar } from '@/components/Composables/useSnackbar';
import type { Address } from '@/interfaces/Address';
import type { AddressPost } from '@/interfaces/AddressPost';

const props = defineProps<{ addresses: Address[], studentId: number }>();
const emit = defineEmits(['update:addresses']);

const localAddresses = ref([...props.addresses]);
const showAddAddressDialog = ref(false);
const showEditAddressDialog = ref(false);
const isDeleteDialogVisible = ref(false);
const editingAddress = ref<Address | null>(null);
const addressIdToDelete = ref<number | null>(null);

const { snackbarVisible, snackbarMessage, snackbarColor, showSnackbar } = useSnackbar();

const addAddress = async (newAddress: AddressPost) => {
    try {
        const addressResponse = await AddressService.addAddress(newAddress);
        localAddresses.value.push(addressResponse);
        emit('update:addresses', localAddresses.value);
        showSnackbar('Address added successfully!', 'green');
    } catch (error) {
        console.error('Error adding address:', error);
        showSnackbar('Error adding address!', 'red');
    }
};

const editAddress = (address: Address) => {
    editingAddress.value = address;
    showEditAddressDialog.value = true;
};

const updateAddress = async (updatedAddress: AddressPost) => {
    try {
        const address = await AddressService.updateAddress(updatedAddress);
        const index = localAddresses.value.findIndex(a => a.addressId === address.addressId);
        localAddresses.value[index] = address;
        emit('update:addresses', localAddresses.value);
        showSnackbar('Address updated successfully!', 'green');
    } catch (error) {
        console.error('Error updating address:', error);
        showSnackbar('Error updating address!', 'red');
    }
};

const deleteAddress = async () => {
    if (addressIdToDelete.value !== null) {
        try {
            await AddressService.deleteAddress(addressIdToDelete.value);
            localAddresses.value = localAddresses.value.filter(address => address.addressId !== addressIdToDelete.value);
            emit('update:addresses', localAddresses.value);
            showSnackbar('Address deleted successfully!', 'green');
        } catch (error) {
            console.error('Error deleting address:', error);
            showSnackbar('Error deleting address!', 'red');
        }
    }
};

const openDeleteDialog = (addressId: number) => {
    addressIdToDelete.value = addressId;
    isDeleteDialogVisible.value = true;
};
</script>
