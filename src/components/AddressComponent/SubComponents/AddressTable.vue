<template>
    <v-table>
        <thead>
            <tr>
                <th class="text-left">ID</th>
                <th class="text-left">Address Line</th>
                <th class="text-left">City</th>
                <th class="text-left">State</th>
                <th class="text-left">ZIP Code</th>
                <th class="text-left"></th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="address in props.addresses" :key="address.addressId">
                <td>{{ address.addressId }}</td>
                <td>{{ address.street }}</td>
                <td>{{ address.city || 'N/A' }}</td>
                <td>{{ address.state || 'N/A' }}</td>
                <td>{{ address.zipCode || 'N/A' }}</td>
                <td>
                    <v-btn @click="$emit('edit', address)" color="warning" class="mr-2">Edit</v-btn>
                    <v-btn @click="$emit('delete', address.addressId)" color="error">Delete</v-btn>
                </td>
            </tr>
        </tbody>
    </v-table>
</template>

<script setup lang="ts">
import type { Address } from '@/interfaces/Address';

const props = defineProps<{ addresses: Address[] }>();
</script>
