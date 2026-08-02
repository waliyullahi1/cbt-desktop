<template>
<div      ref="calculator"
  class="fixed  z-50"
  :style="{
    left: `${position.x}px`,
    top: `${position.y}px`
  }">  
  <div
    class="w-[250px] bg-[#e2dff5] border border-gray-500 shadow-xl select-none"
  >
    <!-- Header -->
    <div
       class="h-11 bg-[#e7e8f8] border-b border-gray-300 flex justify-between items-center px-3 cursor-move"
      @mousedown="startDrag"
    >
      <span class="font-semibold text-sm text-blue-700">
        Calculator
      </span>

      <button
        class="bg-red-700 hover:bg-red-800  text-white w-10 h-5 flex justify-center items-center font-bold text-sm"
        @click="$emit('close')"
      >
        X
      </button>
    </div>

    <!-- Display -->
    <div class="p-2">
      <input
        ref="display"
        v-model="expression"
        readonly
        class="w-full h-12 border bg-white px-3 text-right text-lg font-semibold outline-none"
      />
    </div>

    <!-- Buttons -->
    <div class="grid grid-cols-5 gap-2 p-2">

      <template
        v-for="btn in buttons"
        :key="btn.text"
      >

        <button
          v-if="btn.text !== '='"
          @click="press(btn)"
          class=" h-10 bg-[#e6e5fa] border border-gray-300 hover:bg-green-100 active:scale-95 text-lg font-semibold transition"
        >
          {{ btn.text }}
        </button>

        <!-- Equals -->
        <button
          v-else
          @click="press(btn)"
          class="col-span-2 h-11 bg-[#e5e8fa] border border-gray-300 hover:bg-green-100 active:scale-95 text-lg font-semibold"
        >
          =
        </button>

      </template>

    </div>
  </div>
</div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'




const expression = ref("")
const display = ref(null)
const calculator = ref(null)

// Position
const position = reactive({
  x: 30,
  y: 50,
})

const dragging = ref(false)

let offsetX = 0
let offsetY = 0

function startDrag(e) {
  // Don't drag when clicking the close button
  if (e.target.tagName === "BUTTON") return

  dragging.value = true

  offsetX = e.clientX - position.x
  offsetY = e.clientY - position.y

  document.addEventListener("mousemove", drag)
  document.addEventListener("mouseup", stopDrag)
}

function drag(e) {
  if (!dragging.value || !calculator.value) return

  const width = calculator.value.offsetWidth
  const height = calculator.value.offsetHeight

  let x = e.clientX - offsetX
  let y = e.clientY - offsetY

  // Keep inside window
  x = Math.max(0, Math.min(x, window.innerWidth - width))
  y = Math.max(0, Math.min(y, window.innerHeight - height))

  position.x = x
  position.y = y
}

function stopDrag() {
  dragging.value = false

  document.removeEventListener("mousemove", drag)
  document.removeEventListener("mouseup", stopDrag)
}

onMounted(() => {
  window.addEventListener("keydown", keyboard)
})

onBeforeUnmount(() => {
  window.removeEventListener("keydown", keyboard)

  document.removeEventListener("mousemove", drag)
  document.removeEventListener("mouseup", stopDrag)
})

const buttons = [
  { text: '7', type: 'number' },
  { text: '8', type: 'number' },
  { text: '9', type: 'number' },
  { text: '/', type: 'operator' },
  { text: 'C', type: 'clear' },

  { text: '4', type: 'number' },
  { text: '5', type: 'number' },
  { text: '6', type: 'number' },
  { text: '*', type: 'operator' },
  { text: '√', type: 'sqrt' },

  { text: '1', type: 'number' },
  { text: '2', type: 'number' },
  { text: '3', type: 'number' },
  { text: '-', type: 'operator' },
  { text: 'x²', type: 'square' },

  { text: '0', type: 'number' },
  { text: '.', type: 'decimal' },
  { text: '+', type: 'operator' },
  { text: '=', type: 'equal' },
]

const operators = ['+', '-', '*', '/']

function append(value) {
  expression.value += value
}

function clearAll() {
  expression.value = ''
}

function lastChar() {
  return expression.value.slice(-1)
}

function isOperator(char) {
  return operators.includes(char)
}

function appendOperator(op) {

  if (expression.value === '') return

  if (isOperator(lastChar())) {
    expression.value =
      expression.value.slice(0, -1) + op
    return
  }

  append(op)
}

function appendDecimal() {

  const parts = expression.value.split(/[+\-*/]/)

  const current = parts[parts.length - 1]

  if (current.includes('.')) return

  if (
    expression.value === '' ||
    isOperator(lastChar())
  ) {
    append('0.')
    return
  }

  append('.')
}

function calculate() {

  if (expression.value === '') return

  try {

    let exp = expression.value

    if (isOperator(lastChar())) {
      exp = exp.slice(0, -1)
    }

    const result = Function('"use strict";return (' + exp + ')')()

    expression.value = String(result)

  } catch {

    expression.value = 'Error'

    setTimeout(() => {
      expression.value = ''
    }, 1000)
  }

}

function squareRoot() {

  if (expression.value === '') return

  calculate()

  const value = Number(expression.value)

  if (value < 0 || isNaN(value)) {
    expression.value = 'Error'
    return
  }

  expression.value = String(Math.sqrt(value))
}

function square() {

  if (expression.value === '') return

  calculate()

  const value = Number(expression.value)

  expression.value = String(value * value)
}

function press(btn) {

  switch (btn.type) {

    case 'number':
      append(btn.text)
      break

    case 'operator':
      appendOperator(btn.text)
      break

    case 'decimal':
      appendDecimal()
      break

    case 'clear':
      clearAll()
      break

    case 'equal':
      calculate()
      break

    case 'sqrt':
      squareRoot()
      break

    case 'square':
      square()
      break
  }

}

function keyboard(e) {

  if (/^[0-9]$/.test(e.key)) {
    append(e.key)
    return
  }

  if (operators.includes(e.key)) {
    appendOperator(e.key)
    return
  }

  if (e.key === '.') {
    appendDecimal()
    return
  }

  if (e.key === 'Enter') {
    calculate()
    return
  }

  if (e.key === 'Escape') {
    clearAll()
    return
  }

  if (e.key === 'Backspace') {
    expression.value = expression.value.slice(0, -1)
  }

}

onMounted(() => {
  window.addEventListener('keydown', keyboard)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', keyboard)
})
</script>