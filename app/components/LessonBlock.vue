<template>

  <!-- ===================================================== -->
  <!-- HEADING -->
  <!-- ===================================================== -->

  <component
    v-if="block?.type === 'heading'"
    :is="`h${Math.min(block.level || 2, 6)}`"
    class="font-semibold text-slate-900"
    :class="{
      'mt-10 mb-3 text-2xl': (block.level || 2) === 2,
      'mt-8 mb-2 text-xl': (block.level || 2) === 3,
      'mt-6 mb-2 text-lg': (block.level || 2) >= 4
    }"
  >
    {{ block.text }}
  </component>


  <!-- ===================================================== -->
  <!-- PARAGRAPH -->
  <!-- ===================================================== -->

  <div
    v-else-if="block.type === 'paragraph'"
    class="mt-4"
  >
   
    <div
      class="text-[16px] leading-8 text-slate-700"
      v-html="block.text_html || block.text"
    ></div>

    <!-- Optional math -->
    <div
      v-if="block.math?.latex"
      class="mt-4 overflow-x-auto rounded-md bg-white px-4 py-5"
    >
      <div
        class="flex min-w-max justify-center text-slate-900"
        v-html="
          renderedMath(
            block.math.latex,
            block.math.display !== false
          )
        "
      ></div>
    </div>

  </div>


  <!-- ===================================================== -->
  <!-- DEFINITION -->
  <!-- ===================================================== -->

  <div
    v-else-if="block.type === 'definition'"
    class="mt-5 rounded-md border border-slate-200 bg-white px-5 py-4 shadow-sm"
  >

    <div class="mb-2 flex items-center gap-2">

      <div
        class="flex h-7 w-7 items-center justify-center rounded-md bg-navy/10"
      >
        <Icon
          name="lucide:book-open"
          class="h-4 w-4 text-navy"
        />
      </div>

      <span class="text-sm font-bold text-slate-800">
        {{ block.title || 'Definition' }}
      </span>

    </div>

    <div
      class="text-[15px] leading-7 text-slate-700"
      v-html="block.text_html || block.text"
    ></div>

    <!-- Optional math -->
    <div
      v-if="block.math?.latex"
      class="mt-4 overflow-x-auto rounded-md bg-slate-50 px-4 py-5"
    >
      <div
        class="flex min-w-max justify-center"
        v-html="
          renderedMath(
            block.math.latex,
            block.math.display !== false
          )
        "
      ></div>
    </div>

  </div>


  <!-- ===================================================== -->
  <!-- NOTE -->
  <!-- ===================================================== -->

  <div
    v-else-if="block.type === 'note'"
    class="mt-5 rounded-md border border-navy-soft/20 bg-navy-soft/5 px-4 py-3"
  >

    <div class="flex gap-2.5">

      <Icon
        name="lucide:info"
        class="mt-0.5 h-4 w-4 shrink-0 text-navy-soft"
      />

      <div class="min-w-0 flex-1">

        <div
          class="text-[14.5px] leading-6 text-slate-700"
          v-html="block.text_html || block.text"
        ></div>

        <div
          v-if="block.math?.latex"
          class="mt-4 overflow-x-auto rounded-md bg-white px-4 py-4"
        >
          <div
            class="flex min-w-max justify-center"
            v-html="
              renderedMath(
                block.math.latex,
                block.math.display !== false
              )
            "
          ></div>
        </div>

      </div>

    </div>

  </div>


  <!-- ===================================================== -->
  <!-- TIP -->
  <!-- ===================================================== -->

  <div
    v-else-if="block.type === 'tip'"
    class="mt-5 flex gap-3 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3"
  >

    <div
      class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100"
    >
      <Icon
        name="lucide:lightbulb"
        class="h-4 w-4 text-emerald-700"
      />
    </div>

    <div class="min-w-0 flex-1">

      <p class="mb-1 text-sm font-bold text-emerald-800">
        {{ block.title || 'Tip' }}
      </p>

      <div
        class="text-[14.5px] leading-6 text-emerald-900"
        v-html="block.text_html || block.text"
      ></div>

      <div
        v-if="block.math?.latex"
        class="mt-4 overflow-x-auto rounded-md bg-white px-4 py-4"
      >
        <div
          class="flex min-w-max justify-center"
          v-html="
            renderedMath(
              block.math.latex,
              block.math.display !== false
            )
          "
        ></div>
      </div>

    </div>

  </div>


  <!-- ===================================================== -->
  <!-- WARNING -->
  <!-- ===================================================== -->

  <div
    v-else-if="block.type === 'warning'"
    class="mt-5 flex gap-3 rounded-md border border-amber-200 bg-amber-50 px-4 py-3"
  >

    <div
      class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100"
    >
      <Icon
        name="lucide:triangle-alert"
        class="h-4 w-4 text-amber-700"
      />
    </div>

    <div class="min-w-0 flex-1">

      <p class="mb-1 text-sm font-bold text-amber-800">
        {{ block.title || 'Important' }}
      </p>

      <div
        class="text-[14.5px] leading-6 text-amber-900"
        v-html="block.text_html || block.text"
      ></div>

      <div
        v-if="block.math?.latex"
        class="mt-4 overflow-x-auto rounded-md bg-white px-4 py-4"
      >
        <div
          class="flex min-w-max justify-center"
          v-html="
            renderedMath(
              block.math.latex,
              block.math.display !== false
            )
          "
        ></div>
      </div>

    </div>

  </div>


  <!-- ===================================================== -->
  <!-- EXAMPLE -->
  <!-- ===================================================== -->

  <div
    v-else-if="block.type === 'example'"
    class="mt-5 rounded-md border-l-4 border-gold bg-slate-50 px-5 py-4"
  >

    <!-- Example title -->
    <p
      v-if="block.title"
      class="mb-3 text-sm font-bold text-slate-700"
    >
      {{ block.title }}
    </p>

    <!-- Example text -->
    <div
      v-if="block.text_html || block.text"
      class="text-[15px] leading-7 text-slate-700"
      v-html="block.text_html || block.text"
    ></div>

    <!-- ================================================= -->
    <!-- EXAMPLE MATH -->
    <!-- ================================================= -->

    <div
      v-if="block.math?.latex"
      class="mt-5 overflow-x-auto rounded-md bg-white px-4 py-6"
    >

      <div
        class="flex min-w-max justify-center text-slate-900"
        v-html="
          renderedMath(
            block.math.latex,
            block.math.display !== false
          )
        "
      ></div>

    </div>

  </div>


  <!-- ===================================================== -->
  <!-- STEPS -->
  <!-- ===================================================== -->

  <div
    v-else-if="block.type === 'steps'"
    class="mt-5 rounded-md border border-slate-200 bg-white p-5"
  >

    <p
      v-if="block.title"
      class="mb-4 text-sm font-bold text-slate-800"
    >
      {{ block.title }}
    </p>

    <ol class="space-y-5">

      <li
        v-for="(step, i) in (block.items || block.steps || [])"
        :key="i"
        class="flex gap-3"
      >

        <!-- Number -->
        <div
          class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy text-xs font-bold text-white"
        >
          {{ i + 1 }}
        </div>

        <!-- Step content -->
        <div class="min-w-0 flex-1 pt-0.5">

          <!-- String step -->
          <div
            v-if="typeof step === 'string'"
            class="text-[15px] leading-7 text-slate-700"
            v-html="step"
          ></div>

          <!-- Object step text -->
          <div
            v-else-if="step?.text_html || step?.text"
            class="text-[15px] leading-7 text-slate-700"
            v-html="step.text_html || step.text"
          ></div>

          <!-- Object step math -->
          <div
            v-if="step?.math?.latex"
            class="mt-3 overflow-x-auto rounded-md bg-slate-50 px-4 py-5"
          >

            <div
              class="flex min-w-max justify-center text-slate-900"
              v-html="
                renderedMath(
                  step.math.latex,
                  step.math.display !== false
                )
              "
            ></div>

          </div>

        </div>

      </li>

    </ol>

  </div>


  <!-- ===================================================== -->
  <!-- TABLE -->
  <!-- ===================================================== -->

  <div
    v-else-if="block.type === 'table'"
    class="mt-5 overflow-x-auto rounded-md border border-slate-200"
  >

    <table class="w-full border-collapse text-left text-sm">

      <thead>
        <tr class="bg-navy text-white">

          <th
            v-for="(head, i) in (block.headers || [])"
            :key="i"
            class="px-4 py-2.5 font-semibold"
          >
            {{ head }}
          </th>

        </tr>
      </thead>

      <tbody>

        <tr
          v-for="(row, ri) in (block.rows || [])"
          :key="ri"
          class="border-t border-slate-200"
          :class="
            ri % 2 === 1
              ? 'bg-slate-50'
              : 'bg-white'
          "
        >

          <td
            v-for="(cell, ci) in row"
            :key="ci"
            class="px-4 py-2.5 text-slate-700"
            v-html="cell"
          ></td>

        </tr>

      </tbody>

    </table>

    <p
      v-if="block.caption"
      class="border-t border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-500"
    >
      {{ block.caption }}
    </p>

  </div>


  <!-- ===================================================== -->
  <!-- LIST -->
  <!-- ===================================================== -->

  <component
    v-else-if="block.type === 'list'"
    :is="block.ordered ? 'ol' : 'ul'"
    class="mt-4 space-y-1.5 pl-5 text-[16px] leading-7 text-slate-700"
    :class="
      block.ordered
        ? 'list-decimal'
        : 'list-disc'
    "
  >

    <li
      v-for="(item, i) in (block.items_html || block.items || [])"
      :key="i"
    >

      <!-- Normal list item -->
      <div
        v-if="typeof item === 'string'"
        v-html="item"
      ></div>

      <!-- Object list item -->
      <template v-else>

        <div
          v-if="item.text_html || item.text"
          v-html="item.text_html || item.text"
        ></div>

        <div
          v-if="item.math?.latex"
          class="my-3 overflow-x-auto rounded-md bg-slate-50 px-4 py-4"
        >
          <div
            class="flex min-w-max justify-center"
            v-html="
              renderedMath(
                item.math.latex,
                item.math.display !== false
              )
            "
          ></div>
        </div>

      </template>

    </li>

  </component>


  <!-- ===================================================== -->
  <!-- QUESTION -->
  <!-- ===================================================== -->

  <div
    v-else-if="block.type === 'question'"
    class="mt-6 rounded-md border border-slate-200 bg-white shadow-sm"
  >

    <div
      class="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-5 py-3"
    >

      <div
        class="flex h-7 w-7 items-center justify-center rounded-full bg-navy text-xs font-bold text-white"
      >
        ?
      </div>

      <span class="text-sm font-bold text-slate-800">
        {{ block.title || 'Question' }}
      </span>

    </div>

    <div class="px-5 py-4">

      <!-- Question text -->
      <div
        v-if="block.text_html || block.text"
        class="text-[16px] leading-7 text-slate-700"
        v-html="block.text_html || block.text"
      ></div>

      <!-- Question math -->
      <div
        v-if="block.math?.latex"
        class="mt-4 overflow-x-auto rounded-md bg-slate-50 px-4 py-5"
      >

        <div
          class="flex min-w-max justify-center"
          v-html="
            renderedMath(
              block.math.latex,
              block.math.display !== false
            )
          "
        ></div>

      </div>

    </div>

  </div>


  <!-- ===================================================== -->
  <!-- ANSWER -->
  <!-- ===================================================== -->

  <div
    v-else-if="block.type === 'answer'"
    class="mt-3 rounded-md border border-emerald-200 bg-emerald-50 px-5 py-4"
  >

    <div class="mb-2 flex items-center gap-2">

      <Icon
        name="lucide:check-circle"
        class="h-4 w-4 text-emerald-600"
      />

      <span class="text-sm font-bold text-emerald-800">
        {{ block.title || 'Answer' }}
      </span>

    </div>

    <div
      v-if="block.text_html || block.text"
      class="text-[15px] leading-7 text-emerald-900"
      v-html="block.text_html || block.text"
    ></div>

    <div
      v-if="block.math?.latex"
      class="mt-4 overflow-x-auto rounded-md bg-white px-4 py-5"
    >

      <div
        class="flex min-w-max justify-center text-emerald-900"
        v-html="
          renderedMath(
            block.math.latex,
            block.math.display !== false
          )
        "
      ></div>

    </div>

  </div>
<!-- ===================================================== -->
<!-- DRAWING / DIAGRAM -->
<!-- ===================================================== -->

<figure
  v-else-if="block.type === 'diagram'"
  class="mt-5"
  :class="{
    'text-center': (block.align || 'center') === 'center',
    'text-left': block.align === 'left',
    'text-right': block.align === 'right'
  }"
>

  <div
    class="inline-block max-w-full overflow-x-auto rounded-md border border-slate-200 bg-white p-4"
  >

    <div
      class="[&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-w-full"
      :style="{
        width: block.width
          ? `${block.width}px`
          : '100%'
      }"
      v-html="sanitizedSvg(
        block.svg ||
        block.markup ||
        block.drawing ||
        ''
      )"
    ></div>

  </div>

  <figcaption
    v-if="block.caption"
    class="mt-1.5 text-xs text-slate-500"
  >
    {{ block.caption }}
  </figcaption>

</figure>

  <!-- ===================================================== -->
  <!-- IMAGE -->
  <!-- ===================================================== -->

  <figure
    v-else-if="block.type === 'image'"
    class="mt-5"
    :class="{
      'text-center': (block.align || 'center') === 'center',
      'text-left': block.align === 'left',
      'text-right': block.align === 'right'
    }"
  >
{{block.src}}
    <img
      :src="block.src"
      :alt="block.alt || ''"
      class="inline-block max-w-full rounded-md border border-slate-200"
    />

    <figcaption
      v-if="block.caption"
      class="mt-1.5 text-xs text-slate-500"
    >
      {{ block.caption }}
    </figcaption>

  </figure>


  <!-- ===================================================== -->
  <!-- SVG -->
  <!-- ===================================================== -->

  <figure
    v-else-if="block.type === 'svg'"
    class="mt-5"
    :class="{
      'text-center': (block.align || 'center') === 'center',
      'text-left': block.align === 'left',
      'text-right': block.align === 'right'
    }"
  >

    <div
      class="inline-block max-w-full overflow-x-auto rounded-md border border-slate-200 bg-white p-4 [&_svg]:mx-auto [&_svg]:h-auto [&_svg]:w-full [&_svg]:max-w-full"
      v-html="sanitizedSvg(block.markup || block.svg?.svg || block.svg)"
    ></div>

    <figcaption
      v-if="block.caption"
      class="mt-1.5 text-xs text-slate-500"
    >
      {{ block.caption }}
    </figcaption>

  </figure>


  <!-- ===================================================== -->
  <!-- CODE -->
  <!-- ===================================================== -->

  <div
    v-else-if="block.type === 'code'"
    class="mt-5 overflow-hidden rounded-md border border-slate-800 bg-slate-900"
  >

    <div
      v-if="block.title || block.language"
      class="flex items-center justify-between border-b border-slate-700 bg-slate-800 px-4 py-2"
    >

      <span class="text-xs font-medium text-slate-300">
        {{ block.title || block.language }}
      </span>

      <span
        v-if="block.language"
        class="text-xs uppercase tracking-wide text-slate-500"
      >
        {{ block.language }}
      </span>

    </div>

    <pre class="overflow-x-auto p-4 text-[13px] leading-6"><code
      class="hljs !bg-transparent"
      v-html="highlightedCode(block.code || block.text, block.language)"
    ></code></pre>

  </div>


  <!-- ===================================================== -->
<!-- FORMULA / MATH -->
<!-- ===================================================== -->

<div
  v-else-if="block.type === 'formula' || block.type === 'math'"
  class="mt-5 overflow-x-auto rounded-md border border-slate-200 bg-white px-5 py-5"
  :class="block.display === false ? 'text-left' : 'text-center'"
>

  <p
    v-if="block.label"
    class="mb-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
  >
    {{ block.label }}
  </p>

  <div
    class="text-slate-800"
    v-html="
      renderedMath(
        block.latex || block.formula,
        block.display !== false
      )
    "
  ></div>

  <p
    v-if="block.caption"
    class="mt-3 text-left text-xs text-slate-500"
  >
    {{ block.caption }}
  </p>

</div>


<!-- ===================================================== -->
<!-- CHEMISTRY / CHEMICAL FORMULA -->
<!-- ===================================================== -->

<div
  v-else-if="block.type === 'chemistry' || block.type === 'math'"
  class="mt-5 overflow-x-auto rounded-md border border-slate-200 bg-white px-5 py-5"
  :class="block.display === false ? 'text-left' : 'text-center'"
>

  <p
    v-if="block.label"
    class="mb-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
  >
    {{ block.label }}
  </p>

  <div
    class="chemistry-formula text-slate-900"
    v-html="
      renderedMath(
        block.latex || block.formula || block.chemistry,
        block.display !== false
      )
    "
  ></div>

  <p
    v-if="block.caption"
    class="mt-3 text-left text-xs text-slate-500"
  >
    {{ block.caption }}
  </p>

</div>

  <!-- ===================================================== -->
  <!-- VIDEO / EMBED -->
  <!-- ===================================================== -->

  <figure
    v-else-if="block.type === 'video'"
    class="mt-5"
  >

    <div
      v-if="isDirectVideo(block)"
      class="overflow-hidden rounded-md border border-slate-200 bg-black"
    >

      <video
        :src="block.src"
        :poster="block.poster"
        controls
        class="w-full"
      ></video>

    </div>

    <div
      v-else-if="safeEmbedUrl(block)"
      class="relative overflow-hidden rounded-md border border-slate-200 bg-black"
      style="padding-top: 56.25%"
    >

      <iframe
        :src="safeEmbedUrl(block)"
        class="absolute inset-0 h-full w-full"
        frameborder="0"
        referrerpolicy="strict-origin-when-cross-origin"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>

    </div>

    <div
      v-else
      class="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      Unsupported or unsafe video source.
    </div>

    <figcaption
      v-if="block.caption"
      class="mt-1.5 text-xs text-slate-500"
    >
      {{ block.caption }}
    </figcaption>

  </figure>


  <!-- ===================================================== -->
  <!-- QUOTE -->
  <!-- ===================================================== -->

  <div
    v-else-if="block.type === 'quote'"
    class="mt-5"
  >

    <blockquote
      class="border-l-4 border-slate-300 pl-4 text-[16px] italic leading-7 text-slate-600"
      v-html="block.text_html || block.text"
    ></blockquote>

    <div
      v-if="block.math?.latex"
      class="mt-4 overflow-x-auto rounded-md bg-slate-50 px-4 py-4"
    >
      <div
        class="flex min-w-max justify-center"
        v-html="
          renderedMath(
            block.math.latex,
            block.math.display !== false
          )
        "
      ></div>
    </div>

  </div>


  <!-- ===================================================== -->
  <!-- DIVIDER -->
  <!-- ===================================================== -->

  <hr
    v-else-if="block.type === 'divider'"
    class="my-8 border-slate-200"
  />


  <!-- ===================================================== -->
  <!-- QUIZ -->
  <!-- ===================================================== -->

  <QuizSystem
    v-else-if="block.type === 'quiz'"
    :questions="block.questions"
  />


  <!-- ===================================================== -->
  <!-- CALLOUT -->
  <!-- ===================================================== -->

  <div
    v-else-if="block.type === 'callout'"
    class="mt-5 rounded-md border px-5 py-4"
    :class="calloutClasses(block.style)"
  >

    <div class="flex gap-3">

      <div
        class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
        :class="calloutIconClasses(block.style)"
      >

        <Icon
          :name="calloutIcon(block.style)"
          class="h-4 w-4"
        />

      </div>

      <div class="min-w-0 flex-1">

        <p
          v-if="block.title"
          class="mb-1 text-sm font-bold"
          :class="calloutTitleClasses(block.style)"
        >
          {{ block.title }}
        </p>

        <div
          v-if="block.text_html || block.text"
          class="text-[14.5px] leading-7"
          :class="calloutTextClasses(block.style)"
          v-html="block.text_html || block.text"
        ></div>

        <div
          v-if="block.math?.latex"
          class="mt-4 overflow-x-auto rounded-md bg-white px-4 py-5"
        >

          <div
            class="flex min-w-max justify-center"
            v-html="
              renderedMath(
                block.math.latex,
                block.math.display !== false
              )
            "
          ></div>

        </div>

      </div>

    </div>

  </div>


  <!-- ===================================================== -->
  <!-- IMPORTANT -->
  <!-- ===================================================== -->

  <div
    v-else-if="block.type === 'important'"
    class="mt-5 overflow-hidden rounded-md border border-indigo-200 bg-indigo-50"
  >

    <div
      class="flex items-center gap-2 border-b border-indigo-200 bg-indigo-100 px-4 py-2.5"
    >

      <div
        class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600"
      >

        <Icon
          name="lucide:badge-alert"
          class="h-3.5 w-3.5 text-white"
        />

      </div>

      <span class="text-sm font-bold text-indigo-900">
        {{ block.title || 'Important' }}
      </span>

    </div>

    <div
      class="px-4 py-3 text-[14.5px] leading-7 text-indigo-950"
    >

      <div
        v-if="block.text_html || block.text"
        v-html="block.text_html || block.text"
      ></div>
      
      <div
        v-if="block.math?.latex"
        class="mt-4 overflow-x-auto rounded-md bg-white px-4 py-5"
      >

        <div
          class="flex min-w-max justify-center"
          v-html="
            renderedMath(
              block.math.latex,
              block.math.display !== false
            )
          "
        ></div>

      </div>

    </div>

  </div>


  <!-- ===================================================== -->
  <!-- CHECKLIST -->
  <!-- ===================================================== -->

  <div
    v-else-if="block.type === 'checklist'"
    class="mt-6 overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm"
  >

    <div
      class="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3"
    >

      <div class="flex items-center gap-2.5">

        <div
          class="flex h-7 w-7 items-center justify-center rounded-md bg-navy/10"
        >

          <Icon
            name="lucide:clipboard-check"
            class="h-4 w-4 text-navy"
          />

        </div>

        <div>

          <p class="text-sm font-bold text-slate-800">
            Learning Checklist
          </p>

          <p class="text-xs text-slate-500">
            Check each skill you can confidently do.
          </p>

        </div>

      </div>

      <div class="text-right">

        <p class="text-sm font-bold text-navy">
          {{ checkedCount }}/{{ checklistItems.length }}
        </p>

        <p class="text-[11px] text-slate-500">
          Completed
        </p>

      </div>

    </div>


    <!-- Progress -->
    <div class="h-1 bg-slate-100">

      <div
        class="h-full bg-navy transition-all duration-300"
        :style="{
          width: `${checklistProgress}%`
        }"
      ></div>

    </div>


    <!-- Checklist -->
    <div class="divide-y divide-slate-100">

      <label
        v-for="(item, index) in checklistItems"
        :key="item.key || index"
        class="flex cursor-pointer items-start gap-3 px-5 py-3.5 transition hover:bg-slate-50"
      >

        <input
          type="checkbox"
          v-model="checkedItems[item.key || index]"
          class="mt-1 h-4 w-4 shrink-0 cursor-pointer rounded border-slate-300 text-navy focus:ring-navy/30"
        />

        <span
          class="text-[14.5px] leading-6 transition"
          :class="
            checkedItems[item.key || index]
              ? 'text-slate-400 line-through'
              : 'text-slate-700'
          "
        >
          {{ item.text || item.label }}
        </span>

      </label>

    </div>


    <!-- Completion -->
    <div
      v-if="checklistItems.length && checkedCount === checklistItems.length"
      class="border-t border-emerald-200 bg-emerald-50 px-5 py-3"
    >

      <div class="flex items-center gap-2">

        <Icon
          name="lucide:circle-check"
          class="h-5 w-5 text-emerald-600"
        />

        <p class="text-sm font-semibold text-emerald-800">
          Excellent! You have checked all the learning objectives.
        </p>

      </div>

    </div>

  </div>


  <!-- ===================================================== -->
  <!-- UNKNOWN BLOCK -->
  <!-- ===================================================== -->

  <div
    v-else
    class="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
  >

    <div class="flex items-center gap-2 font-semibold">

      <Icon
        name="lucide:triangle-alert"
        class="h-4 w-4"
      />

      Unsupported lesson block:
      {{ block.type }}

    </div>

  </div>

</template>


<script setup>

import { reactive, computed } from 'vue'
import DOMPurify from 'dompurify'
import hljs from 'highlight.js/lib/common'
import katex from 'katex'
import QuizSystem from './QuizSystem.vue'   // <-- Must exist or be provided

// These MUST be loaded or both the math and code blocks render broken:
// - katex.min.css positions every glyph in a formula and hides the
//   accessibility/MathML text copy. Without it you get every character
//   on its own line, followed by the raw text that should stay hidden.
// - the highlight.js theme colors the syntax tokens; without it code
//   blocks render as plain unstyled text.
// If you'd rather not duplicate these per-instance, move both imports
// to your app's global CSS entry point instead and delete them here.
import 'katex/dist/katex.min.css'
import 'highlight.js/styles/atom-one-dark.css'
import 'katex/contrib/mhchem'
const props = defineProps({
  block: {
    type: Object,
    required: true
  }
})

// ---------------------------------------------------------------
// SVG — sanitize before injecting via v-html. Only the safe SVG
// profile is allowed (no <script>, no event handlers, no <foreignObject>).
// ---------------------------------------------------------------
function sanitizedSvg (markup) {
  if (!markup) return ''
  return DOMPurify.sanitize(markup, {
    USE_PROFILES: { svg: true, svgFilters: true },
    FORBID_TAGS: ['foreignObject', 'script'],
    FORBID_ATTR: ['onload', 'onerror', 'onclick']
  })
}

// ---------------------------------------------------------------
// CODE — syntax highlight via highlight.js. Falls back to escaped
// plain text if the language isn't recognized.
// ---------------------------------------------------------------
function highlightedCode (code, language) {
  if (!code) return ''

  try {
    if (language && hljs.getLanguage(language)) {
      return hljs.highlight(code, { language }).value
    }
    return hljs.highlightAuto(code).value
  } catch (e) {
    // Fall back to escaped raw text so we never lose content.
    const div = document.createElement('div')
    div.textContent = code
    return div.innerHTML
  }
}

// ---------------------------------------------------------------
// FORMULA / MATH — render LaTeX via KaTeX. throwOnError is
// disabled so a malformed formula degrades to inline error text
// instead of crashing the page.
// ---------------------------------------------------------------
// ---------------------------------------------------------------
// MATH / LATEX
// ---------------------------------------------------------------

function renderedMath (latex, displayMode = true) {
  if (!latex) return ''

  try {
    return katex.renderToString(latex, {
      throwOnError: false,
      displayMode,
      strict: false,
      trust: false
    })
  } catch (error) {
    console.error('KaTeX error:', error)

    return `
      <span class="text-red-600 text-sm">
        Invalid formula
      </span>
    `
  }
}

// ---------------------------------------------------------------
// VIDEO — direct file vs. provider embed detection.
// ---------------------------------------------------------------
const DIRECT_VIDEO_EXTENSIONS = ['.mp4', '.webm', '.ogg', '.mov']

function isDirectVideo (block) {
  if (!block.src) return false
  const lower = block.src.toLowerCase().split('?')[0]
  return DIRECT_VIDEO_EXTENSIONS.some(ext => lower.endsWith(ext))
}

// Only known, trusted embed providers are allowed. The iframe src
// is always built here from a validated ID — we never pass through
// an arbitrary user-supplied URL as the iframe src directly.
function safeEmbedUrl (block) {
  const provider = (block.provider || '').toLowerCase()
  const id = block.embedId

  if (provider === 'youtube' && /^[a-zA-Z0-9_-]{6,20}$/.test(id || '')) {
    return `https://www.youtube-nocookie.com/embed/${id}`
  }

  if (provider === 'vimeo' && /^[0-9]{4,15}$/.test(id || '')) {
    return `https://player.vimeo.com/video/${id}`
  }

  // Fallback: allow a raw url only if it already points at a
  // trusted embed host — anything else is rejected.
  if (block.url) {
    try {
      const parsed = new URL(block.url)
      const allowedHosts = [
        'www.youtube-nocookie.com',
        'player.vimeo.com'
      ]
      if (allowedHosts.includes(parsed.hostname)) {
        return parsed.toString()
      }
    } catch (e) {
      return null
    }
  }

  return null
}

// ---------------------------------------------------------------
// CALLOUT
// ---------------------------------------------------------------

function calloutClasses (style = 'info') {
  const classes = {
    info: 'border-blue-200 bg-blue-50',
    success: 'border-emerald-200 bg-emerald-50',
    warning: 'border-amber-200 bg-amber-50',
    danger: 'border-red-200 bg-red-50',
    neutral: 'border-slate-200 bg-slate-50',
    purple: 'border-purple-200 bg-purple-50'
  }

  return classes[style] || classes.info
}

function calloutIconClasses (style = 'info') {
  const classes = {
    info: 'bg-blue-100 text-blue-700',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
    neutral: 'bg-slate-100 text-slate-700',
    purple: 'bg-purple-100 text-purple-700'
  }

  return classes[style] || classes.info
}

function calloutTitleClasses (style = 'info') {
  const classes = {
    info: 'text-blue-800',
    success: 'text-emerald-800',
    warning: 'text-amber-800',
    danger: 'text-red-800',
    neutral: 'text-slate-800',
    purple: 'text-purple-800'
  }

  return classes[style] || classes.info
}

function calloutTextClasses (style = 'info') {
  const classes = {
    info: 'text-blue-900',
    success: 'text-emerald-900',
    warning: 'text-amber-900',
    danger: 'text-red-900',
    neutral: 'text-slate-700',
    purple: 'text-purple-900'
  }

  return classes[style] || classes.info
}

function calloutIcon (style = 'info') {
  const icons = {
    info: 'lucide:info',
    success: 'lucide:check-circle',
    warning: 'lucide:triangle-alert',
    danger: 'lucide:circle-alert',
    neutral: 'lucide:message-square',
    purple: 'lucide:sparkles'
  }

  return icons[style] || icons.info
}


// ===============================================================
// CHECKLIST
// ===============================================================

const checkedItems = reactive({})

const checklistItems = computed(() => {
  return Array.isArray(props.block?.items)
    ? props.block.items
    : []
})

const checkedCount = computed(() => {
  return checklistItems.value.filter((item, index) => {
    const key = item.key || index
    return checkedItems[key] === true
  }).length
})

const checklistProgress = computed(() => {
  if (!checklistItems.value.length) {
    return 0
  }

  return Math.round(
    (checkedCount.value / checklistItems.value.length) * 100
  )
})
</script>

<style>
/* =========================================================
   KATEX / MATRIX
========================================================= */

.katex-display {
  margin: 0 !important;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 0.5rem 0;
}

.katex {
  font-size: 1.1em;
}

/* Large matrices */
.katex .bmatrix,
.katex .pmatrix,
.katex .vmatrix {
  font-size: 1.05em;
}

/* Prevent large matrices from breaking */
.katex-display .katex {
  max-width: 100%;
}

/* Mobile */
@media (max-width: 640px) {
  .katex {
    font-size: 1em;
  }

  .katex-display {
    overflow-x: auto;
    padding-left: 0.25rem;
    padding-right: 0.25rem;
  }
}
</style>