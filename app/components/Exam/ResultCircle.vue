<template>
  <div class="bg-white p-8 text-black">

    <!-- Top Bar -->

    <div class="flex justify-between items-center mb-10">

      <div class="flex gap-2 items-center">

        <div class="bg-green-800 text-white px-6 py-2">
          Format
        </div>

        <select class="border px-4 py-2 w-64">
          <option>Slip</option>
        </select>

      </div>

      <button
        class="bg-blue-600 text-white px-8 py-2 rounded-full"
      >
        Print
      </button>

    </div>

    <!-- Header -->

    <div class="flex items-center">

      <!-- Profile -->

      <div class="w-1/4">
        <Icon
          name="lucide:user-round"
          class="text-green-600 text-[90px]"
        />
      </div>

      <!-- Title -->

      <div class="flex-1 text-center">
        <h1
          class="font-bold text-[24px]"
          style="font-family: Times New Roman"
        >
          UTME
        </h1>

        <h2
          class="font-bold text-[28px]"
          style="font-family: Times New Roman"
        >
          Result Slip
        </h2>
      </div>

      <!-- Printed Date -->

      <div
        class="w-1/4 text-right font-bold"
        style="font-family: Times New Roman"
      >
        Date Printed:
        {{ printedDate }}
      </div>

    </div>

    <hr class="my-8">

    <!-- Examination Details -->

    <div
      class="text-[18px]"
      style="font-family: Times New Roman"
    >

      <h2 class="font-bold text-[24px] mb-5">
        Examination Details
      </h2>

      <div class="space-y-2">

        <div class="flex">
          <div class="w-40">
            Username:
          </div>

          <div>
            {{ username }}
          </div>
        </div>

        <div class="flex">
          <div class="w-40">
            Subject(s):
          </div>

          <div>
            {{ subjectNames }}
          </div>
        </div>

        <div class="flex">
          <div class="w-40">
            Exam Date:
          </div>

          <div>
            {{ examDate }}
          </div>
        </div>

      </div>

    </div>

    <!-- Candidate Result -->

    <div
      class="mt-12"
      style="font-family: Times New Roman"
    >

      <h2 class="font-bold text-[24px] mb-4">
        Candidate Result
      </h2>

      <table class="w-[700px]">

        <thead>

          <tr class="border-b">

            <th class="text-left text-[20px]">
              Subject
            </th>

            <th class="text-left text-[20px]">
              Score
            </th>

            <th class="text-left text-[20px]">
              Time Spent
            </th>

          </tr>

        </thead>

        <tbody>

          <tr
            v-for="subject in subjects"
            :key="subject.name"
          >
            <td class="py-1">
              {{ subject.name }}
            </td>

            <td>
              {{ subject.score }}
            </td>

            <td>
              {{ subject.timeSpent }}
            </td>
          </tr>

        </tbody>

        <tfoot>

          <tr class="border-t">

            <td class="pt-2">
              Aggregate
            </td>

            <td class="pt-2">
              Total:
              {{ totalScore }}/300
            </td>

            <td class="pt-2">
              Total:
              {{ totalTime }}
            </td>

          </tr>

        </tfoot>

      </table>

    </div>

  </div>
</template>