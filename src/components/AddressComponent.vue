<template>
    <div>
        <ul>
            <li v-for="address in addresses" :key="address.addressId">
                {{ address.street }}, {{ address.city }}, {{ address.state }}, {{ address.zipCode }}
                <button @click="deleteAddress(address.addressId)">Delete</button>
            </li>
        </ul>
        <div>
            <input v-model="newStreet" placeholder="Enter street" />
            <input v-model="newCity" placeholder="Enter city" />
            <input v-model="newState" placeholder="Enter state" />
            <input v-model="newZipCode" placeholder="Enter zip code" />
            <button @click="addAddress">Add Address</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { AddressService } from '@/services/addressService';
import type { Address } from '@/interfaces/Address';

const props = defineProps<{ addresses: Address[], studentId: number }>();

const newStreet = ref('');
const newCity = ref('');
const newState = ref('');
const newZipCode = ref('');

const addAddress = async () => {
    try {
        const address = await AddressService.addAddress(props.studentId, newStreet.value, newCity.value, newState.value, newZipCode.value);
        props.addresses.push(address); // Actualiza la lista de direcciones con la nueva dirección

        newStreet.value = ''; // Limpia el campo de entrada
        newCity.value = ''; // Limpia el campo de entrada
        newState.value = ''; // Limpia el campo de entrada
        newZipCode.value = ''; // Limpia el campo de entrada
    } catch (error) {
        console.error('Error adding address:', error);
    }
};

const deleteAddress = async (addressId: number) => {
    try {
        await AddressService.deleteAddress(addressId);
        props.addresses = props.addresses.filter(address => address.addressId !== addressId); // Eliminar dirección de la lista localmente
    } catch (error) {
        console.error('Error deleting address:', error);
    }
};
</script>

<style scoped></style>
