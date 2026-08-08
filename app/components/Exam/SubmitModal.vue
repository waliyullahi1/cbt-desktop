<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        @click.self="close"
      >
        <div class="w-full max-w-md rounded-lg bg-white shadow-xl">
          <!-- Header -->
          <div class="flex items-center justify-between border-b px-6 py-4">
            <div class="flex items-center gap-3">
              <div
                class="flex h-10 w-10 items-center justify-center rounded-full bg-green-100"
              >
                <Icon
                  name="lucide:circle-check-big"
                  class="text-xl text-green-600"
                />
              </div>

              <div>
                <h2 class="text-lg font-bold">Submit Exam</h2>
                <p class="text-sm text-slate-500">
                  Confirm your submission
                </p>
              </div>
            </div>

            <button @click="close">
              <Icon name="lucide:x" class="text-xl" />
            </button>
          </div>

          <!-- Body -->
          <div class="px-6 py-5">
            <p class="text-slate-700">
              Are you sure you want to submit your exam?
            </p>

            <p class="mt-2 text-sm text-slate-500">
              After submission you will not be able to change your answers.
            </p>
          </div>

          <!-- Footer -->
          <div class="flex justify-end gap-3 border-t px-6 py-4">
            <button
              @click="close"
              class="rounded-md border px-4 py-2 text-sm font-medium hover:bg-slate-50"
            >
              Continue Exam
            </button>

            <button
              @click="submitExam"
              class="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
              Submit Exam
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits([
  "update:modelValue",
  "submit",
]);

function close() {
  emit("update:modelValue", false);
}

function submitExam() {
  emit("submit");
  emit("update:modelValue", false);
}
</script>