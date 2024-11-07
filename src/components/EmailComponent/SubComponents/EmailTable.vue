<template>
    <v-table>
        <thead>
            <tr>
                <th class="text-left">ID</th>
                <th class="text-left">Email</th>
                <th class="text-left">Type</th>
                <th class="text-left"></th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="email in props.emails" :key="email.emailId">
                <td>{{ email.emailId }}</td>
                <td>{{ email.email }}</td>
                <td>{{ email.emailType }}</td>
                <td class="flex justify-end items-center">
                    <v-btn @click="$emit('edit', email)" variant="tonal" color="primary" class="mr-2">Edit&nbsp; <v-icon
                            icon="mdi-pencil"></v-icon></v-btn>
                    <v-btn @click="$emit('delete', email.emailId)" variant="tonal" color="error">Delete&nbsp;<v-icon
                            icon="mdi-delete"></v-icon>
                    </v-btn>
                </td>
            </tr>
        </tbody>
    </v-table>
</template>

<script setup lang="ts">
import type { Email } from '@/interfaces/EmailInterfaces';

const props = defineProps<{ emails: Email[] }>();
</script>
