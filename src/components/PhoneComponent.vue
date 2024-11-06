<template>
    <div>
        <ul>
            <li v-for="phone in phones" :key="phone.phoneId">
                {{ phone.phoneNumber }}
                <button @click="deletePhone(phone.phoneId)">Delete</button>
            </li>
        </ul>
        <div>
            <input v-model="newPhoneNumber" placeholder="Enter new phone number" />
            <input v-model="countryCode" placeholder="Enter country code" />
            <input v-model="areaCode" placeholder="Enter area code" />
            <button @click="addPhone">Add Phone</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { PhoneService } from '@/services/phoneService';
import type { Phone } from '@/interfaces/Phone';

const props = defineProps<{ phones: Phone[], studentId: number }>();

const newPhoneNumber = ref('');
const phoneType = ref('MOBILE'); // Suponemos que el tipo de teléfono es "MOBILE"
const countryCode = ref('');
const areaCode = ref('');

const addPhone = async () => {
    try {
        const phone = await PhoneService.addPhone(props.studentId, newPhoneNumber.value, phoneType.value, countryCode.value, areaCode.value);
        props.phones.push(phone); // Actualiza la lista de teléfonos con el nuevo teléfono

        newPhoneNumber.value = ''; // Limpia el campo de entrada
        countryCode.value = ''; // Limpia el campo de entrada
        areaCode.value = ''; // Limpia el campo de entrada
    } catch (error) {
        console.error('Error adding phone:', error);
    }
};

const deletePhone = async (phoneId: number) => {
    try {
        await PhoneService.deletePhone(phoneId);
        props.phones = props.phones.filter(phone => phone.phoneId !== phoneId); // Eliminar teléfono de la lista localmente
    } catch (error) {
        console.error('Error deleting phone:', error);
    }
};
</script>

<style scoped></style>
