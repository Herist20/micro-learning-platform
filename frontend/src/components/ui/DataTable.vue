<template>
  <div class="data-table">
    <!-- Table Container -->
    <div class="data-table__container">
      <table class="data-table__table">
        <!-- Header -->
        <thead class="data-table__thead">
          <tr>
            <th v-if="selectable" class="data-table__th data-table__th--checkbox">
              <input
                type="checkbox"
                :checked="allSelected"
                @change="toggleSelectAll"
              />
            </th>

            <th
              v-for="column in columns"
              :key="column.key"
              :class="['data-table__th', `data-table__th--${column.align || 'left'}`]"
              :style="{ width: column.width }"
            >
              <button
                v-if="column.sortable"
                class="data-table__sort-btn"
                @click="handleSort(column.key)"
              >
                {{ column.label }}
                <span class="data-table__sort-icon">
                  {{ getSortIcon(column.key) }}
                </span>
              </button>
              <span v-else>{{ column.label }}</span>
            </th>
          </tr>
        </thead>

        <!-- Body -->
        <tbody v-if="!loading && displayData.length > 0" class="data-table__tbody">
          <tr
            v-for="(row, index) in displayData"
            :key="index"
            :class="['data-table__tr', { 'data-table__tr--selected': selectedRows.includes(index) }]"
          >
            <td v-if="selectable" class="data-table__td data-table__td--checkbox">
              <input
                type="checkbox"
                :checked="selectedRows.includes(index)"
                @change="toggleSelectRow(index)"
              />
            </td>

            <td
              v-for="column in columns"
              :key="column.key"
              :class="['data-table__td', `data-table__td--${column.align || 'left'}`]"
            >
              {{ column.formatter ? column.formatter(row[column.key], row) : row[column.key] }}
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Loading State -->
      <div v-if="loading" class="data-table__loading">
        <div class="data-table__spinner"></div>
        <p>Loading data...</p>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && displayData.length === 0" class="data-table__empty">
        <span class="data-table__empty-icon">📭</span>
        <p>No data available</p>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="pagination && !loading && displayData.length > 0" class="data-table__pagination">
      <div class="data-table__pagination-info">
        Showing {{ startItem }} to {{ endItem }} of {{ totalItems }} entries
      </div>

      <div class="data-table__pagination-controls">
        <button
          class="data-table__pagination-btn"
          :disabled="currentPage === 1"
          @click="goToPage(currentPage - 1)"
        >
          Previous
        </button>

        <button
          v-for="page in visiblePages"
          :key="page"
          :class="['data-table__pagination-btn', { 'data-table__pagination-btn--active': page === currentPage }]"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>

        <button
          class="data-table__pagination-btn"
          :disabled="currentPage === totalPages"
          @click="goToPage(currentPage + 1)"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { TableProps, TableSort } from '@/types/ui';

const props = withDefaults(defineProps<TableProps>(), {
  loading: false,
  selectable: false,
  hoverable: true,
  striped: true,
  bordered: false,
  pagination: true,
  pageSize: 10,
  currentPage: 1,
});

const emit = defineEmits<{
  'update:currentPage': [page: number];
  'sort': [sort: TableSort];
  'select': [selectedRows: number[]];
}>();

const sortState = ref<TableSort | null>(null);
const selectedRows = ref<number[]>([]);
const localPage = ref(props.currentPage);

const sortedData = computed(() => {
  if (!sortState.value) return props.data;

  const { key, order } = sortState.value;
  return [...props.data].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (aVal === bVal) return 0;
    const result = aVal > bVal ? 1 : -1;
    return order === 'asc' ? result : -result;
  });
});

const displayData = computed(() => {
  if (!props.pagination) return sortedData.value;

  const start = (localPage.value - 1) * props.pageSize;
  const end = start + props.pageSize;
  return sortedData.value.slice(start, end);
});

const totalItems = computed(() => props.totalItems || props.data.length);
const totalPages = computed(() => Math.ceil(totalItems.value / props.pageSize));

const startItem = computed(() => {
  return totalItems.value === 0 ? 0 : (localPage.value - 1) * props.pageSize + 1;
});

const endItem = computed(() => {
  return Math.min(localPage.value * props.pageSize, totalItems.value);
});

const visiblePages = computed(() => {
  const pages: number[] = [];
  const maxVisible = 5;
  let start = Math.max(1, localPage.value - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages.value, start + maxVisible - 1);

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});

const allSelected = computed(() => {
  return displayData.value.length > 0 && selectedRows.value.length === displayData.value.length;
});

const handleSort = (key: string) => {
  if (!sortState.value || sortState.value.key !== key) {
    sortState.value = { key, order: 'asc' };
  } else {
    sortState.value.order = sortState.value.order === 'asc' ? 'desc' : 'asc';
  }
  emit('sort', sortState.value);
};

const getSortIcon = (key: string) => {
  if (!sortState.value || sortState.value.key !== key) return '⇅';
  return sortState.value.order === 'asc' ? '↑' : '↓';
};

const toggleSelectAll = () => {
  if (allSelected.value) {
    selectedRows.value = [];
  } else {
    selectedRows.value = displayData.value.map((_, index) => index);
  }
  emit('select', selectedRows.value);
};

const toggleSelectRow = (index: number) => {
  const idx = selectedRows.value.indexOf(index);
  if (idx > -1) {
    selectedRows.value.splice(idx, 1);
  } else {
    selectedRows.value.push(index);
  }
  emit('select', selectedRows.value);
};

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    localPage.value = page;
    emit('update:currentPage', page);
  }
};
</script>

<style scoped>
.data-table {
  width: 100%;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.data-table__container {
  overflow-x: auto;
}

.data-table__table {
  width: 100%;
  border-collapse: collapse;
}

.data-table__thead {
  background: var(--bg-tertiary);
  border-bottom: 2px solid var(--border-color);
}

.data-table__th {
  padding: var(--spacing-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
}

.data-table__th--left {
  text-align: left;
}

.data-table__th--center {
  text-align: center;
}

.data-table__th--right {
  text-align: right;
}

.data-table__th--checkbox {
  width: 40px;
  text-align: center;
}

.data-table__sort-btn {
  background: transparent;
  border: none;
  padding: 0;
  font: inherit;
  color: inherit;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  transition: color var(--transition-fast);
}

.data-table__sort-btn:hover {
  color: var(--color-primary);
}

.data-table__sort-icon {
  font-size: 0.875em;
}

.data-table__tbody {
}

.data-table__tr {
  border-bottom: 1px solid var(--border-color);
  transition: background var(--transition-fast);
}

.data-table__tr:hover {
  background: var(--bg-tertiary);
}

.data-table__tr--selected {
  background: var(--color-primary-50);
}

.data-table__td {
  padding: var(--spacing-md);
  font-size: var(--font-size-base);
  color: var(--text-primary);
}

.data-table__td--left {
  text-align: left;
}

.data-table__td--center {
  text-align: center;
}

.data-table__td--right {
  text-align: right;
}

.data-table__td--checkbox {
  width: 40px;
  text-align: center;
}

.data-table__loading,
.data-table__empty {
  padding: var(--spacing-3xl);
  text-align: center;
  color: var(--text-secondary);
}

.data-table__spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-primary-200);
  border-top-color: var(--color-primary);
  border-radius: var(--radius-full);
  animation: spin 0.8s linear infinite;
  margin: 0 auto var(--spacing-md);
}

.data-table__empty-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: var(--spacing-md);
}

.data-table__pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md);
  border-top: 1px solid var(--border-color);
  background: var(--bg-secondary);
}

.data-table__pagination-info {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.data-table__pagination-controls {
  display: flex;
  gap: var(--spacing-xs);
}

.data-table__pagination-btn {
  padding: var(--spacing-sm) var(--spacing-md);
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  color: var(--text-primary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.data-table__pagination-btn:hover:not(:disabled) {
  background: var(--bg-elevated);
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.data-table__pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.data-table__pagination-btn--active {
  background: var(--gradient-primary);
  border-color: transparent;
  color: white;
}
</style>
