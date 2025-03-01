<template>
    <div class="card">
        <DataTable
            v-if="data && data.length"
            :value="data"
            paginator
            :rows="5"
            :rowsPerPageOptions="[5, 10, 20, 50]"
            tableStyle="min-width: 50rem"
            responsiveLayout="stack"
            breakpoint="960px"
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            currentPageReportTemplate="{first} a {last} de {totalRecords}"
        >
            <template #header>
                <div class="flex flex-wrap items-center justify-between gap-2">
                    <span class="text-xl font-bold">{{ title }}</span>
                </div>
            </template>

            <template v-for="col in columns" :key="col.field">
                <Column v-if="col.type !== 'image'" :field="col.field" :header="col.header"></Column>

                <Column v-else :header="col.header">
                    <template #body="slotProps">
                        <img
                            v-if="slotProps.data[col.field]"
                            :src="slotProps.data[col.field]"
                            class="table-image"
                        />
                    </template>
                </Column>
            </template>

            <template #footer>
                Total: {{ data.length }} registros
            </template>
        </DataTable>
    </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

interface ColumnDefinition {
    field: string;
    header: string;
    type?: 'text' | 'image'; 
}

const props = defineProps<{
    data: Array<any>;
    columns: ColumnDefinition[];
    title: string;
}>();
</script>
