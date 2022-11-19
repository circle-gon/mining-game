<template>
  <div class="field">
    <span v-if="title" class="field-title">{{ title }}</span>
    <Tooltip
      :display="`${value}`"
      :class="{ fullWidth: !title }"
      :direction="Direction.Down"
    >
      <input v-model="value" type="range" :min="min" :max="max" />
    </Tooltip>
  </div>
</template>

<script setup lang="ts">
import "components/common/fields.css";
import Tooltip from "features/tooltips/Tooltip.vue";
import { Direction } from "util/common";
import { computed, toRefs, unref } from "vue";

const _props = defineProps<{
  title?: string;
  modelValue?: number;
  min?: number;
  max?: number;
}>();
const props = toRefs(_props);
const emit = defineEmits<{
  (e: "update:modelValue", value: number): void;
}>();

const value = computed({
  get() {
    return String(unref(props.modelValue) || 0);
  },
  set(value: string) {
    emit("update:modelValue", Number(value));
  },
});
</script>

<style scoped>
.fullWidth {
  width: 100%;
}
</style>
