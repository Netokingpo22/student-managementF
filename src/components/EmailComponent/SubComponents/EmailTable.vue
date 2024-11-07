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
                <td>
                    <v-btn @click="$emit('edit', email)" color="warning" class="mr-2">Edit</v-btn>
                    <v-btn @click="$emit('delete', email.emailId)" color="error">Delete</v-btn>
                </td>
            </tr>
        </tbody>
    </v-table>
</template>

<script setup lang="ts">
import type { Email } from '@/interfaces/Email';

const props = defineProps<{ emails: Email[] }>();
</script>
