<template>
    <v-table>
        <thead>
            <tr>
                <th class="text-left">ID</th>
                <th class="text-left">Phone</th>
                <th class="text-left">Type</th>
                <th class="text-left">Country Code</th>
                <th class="text-left">Area Code</th>
                <th class="text-left"></th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="phone in props.phones" :key="phone.phoneId">
                <td>{{ phone.phoneId }}</td>
                <td>{{ phone.phoneNumber }}</td>
                <td>{{ phone.phoneType }}</td>
                <td>{{ phone.countryCode || 'N/A' }}</td>
                <td>{{ phone.areaCode || 'N/A' }}</td>
                <td class="flex justify-end items-center">
                    <v-btn @click="$emit('edit', phone)" variant="tonal" color="primary" class="mr-2">Edit&nbsp; <v-icon
                            icon="mdi-pencil"></v-icon></v-btn>
                    <v-btn @click="$emit('delete', phone.phoneId)" variant="tonal" color="error">Delete&nbsp;<v-icon
                            icon="mdi-delete"></v-icon>
                    </v-btn>
                </td>
            </tr>
        </tbody>
    </v-table>
</template>

<script setup lang="ts">
import type { Phone } from '@/interfaces/PhoneInterfaces';

const props = defineProps<{ phones: Phone[] }>();
</script>
