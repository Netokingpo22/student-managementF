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
                <td>{{ phone.countryCode || 'N/A' }}</td> <!-- Campo de código de país -->
                <td>{{ phone.areaCode || 'N/A' }}</td> <!-- Campo de código de área -->
                <td>
                    <v-btn @click="$emit('edit', phone)" color="warning" class="mr-2">Edit</v-btn>
                    <v-btn @click="$emit('delete', phone.phoneId)" color="error">Delete</v-btn>
                </td>
            </tr>
        </tbody>
    </v-table>
</template>

<script setup lang="ts">
import type { Phone } from '@/interfaces/Phone';

const props = defineProps<{ phones: Phone[] }>();
</script>
