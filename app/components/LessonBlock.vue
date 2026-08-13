<template>

  <!-- HEADING -->
  <component
    v-if="block.type === 'heading'"
    :is="`h${block.level || 2}`"
    class="font-semibold text-slate-900"
    :class="{
      'mt-10 mb-3 text-2xl': (block.level || 2) === 2,
      'mt-8 mb-2 text-xl': (block.level || 2) === 3,
      'mt-6 mb-2 text-lg': (block.level || 2) >= 4
    }"
  >
    {{ block.text }}
  </component>

  <!-- PARAGRAPH -->
  <p v-else-if="block.type === 'paragraph'" class="mt-4 text-[16px] leading-8 text-slate-700" v-html="block.text_html"></p>

  <!-- NOTE (colored info box) -->
  <div v-else-if="block.type === 'note'" class="mt-5 flex gap-2.5 rounded-md border border-navy-soft/20 bg-navy-soft/5 px-4 py-3">
    <Icon name="lucide:info" class="mt-0.5 h-4 w-4 shrink-0 text-navy-soft" />
    <div class="text-[14.5px] leading-6 text-slate-700" v-html="block.text_html"></div>
  </div>

  <!-- EXAMPLE ("Try it Yourself" style) -->
  <div v-else-if="block.type === 'example'" class="mt-5 rounded-md border-l-4 border-gold bg-slate-50 px-5 py-4">
    <p class="mb-2 text-sm font-bold text-slate-700">{{ block.title || 'Example' }}</p>
    <div class="font-['IBM_Plex_Mono',monospace] text-[14px] leading-7 text-slate-700" v-html="block.text_html"></div>
  </div>

  <!-- TABLE -->
  <div v-else-if="block.type === 'table'" class="mt-5 overflow-x-auto rounded-md border border-slate-200">
    <table class="w-full border-collapse text-left text-sm">
      <thead>
        <tr class="bg-navy text-white">
          <th v-for="(head, i) in block.headers" :key="i" class="px-4 py-2.5 font-semibold">{{ head }}</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, ri) in block.rows"
          :key="ri"
          class="border-t border-slate-200"
          :class="ri % 2 === 1 ? 'bg-slate-50' : 'bg-white'"
        >
          <td v-for="(cell, ci) in row" :key="ci" class="px-4 py-2.5 text-slate-700">{{ cell }}</td>
        </tr>
      </tbody>
    </table>
    <p v-if="block.caption" class="border-t border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-500">{{ block.caption }}</p>
  </div>

  <!-- LIST -->
  <component
    v-else-if="block.type === 'list'"
    :is="block.ordered ? 'ol' : 'ul'"
    class="mt-4 space-y-1.5 pl-5 text-[16px] leading-7 text-slate-700"
    :class="block.ordered ? 'list-decimal' : 'list-disc'"
  >
    <li v-for="(item, i) in block.items_html" :key="i" v-html="item"></li>
  </component>

  <!-- IMAGE -->
  <figure
    v-else-if="block.type === 'image'"
    class="mt-5"
    :class="{
      'text-center': (block.align || 'center') === 'center',
      'text-left': block.align === 'left',
      'text-right': block.align === 'right'
    }"
  >
    <img :src="block.src" :alt="block.alt || ''" class="inline-block max-w-full rounded-md border border-slate-200" />
    <figcaption v-if="block.caption" class="mt-1.5 text-xs text-slate-500">{{ block.caption }}</figcaption>
  </figure>

  <!-- QUOTE -->
  <blockquote v-else-if="block.type === 'quote'" class="mt-5 border-l-4 border-slate-300 pl-4 text-[16px] italic leading-7 text-slate-600" v-html="block.text_html"></blockquote>

  <!-- DIVIDER -->
  <hr v-else-if="block.type === 'divider'" class="my-8 border-slate-200" />

</template>

<script setup>
defineProps({
  block: { type: Object, required: true }
})
</script>
