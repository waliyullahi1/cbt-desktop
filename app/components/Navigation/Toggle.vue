<template>
  <div class="flex md:hidden" >
    <div @click="$emit('revealMenu')" class="w-8">
      <div
        :class="isOpen 
          ? 'transition transform rotate-45 w-8 bg-primary' 
          : 'transition w-8 bg-primary'"
        class="block cursor-pointer"
        style="height: 3px;"
      ></div>

      <div
        :class="isOpen 
          ? 'transition transform -rotate-45 w-8 -mt-0.5 bg-primary' 
          : 'transition w-8 mt-1.5 bg-primary'"
        class="block cursor-pointer"
        style="height: 3px;"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isOpen: Boolean
  }
}
</script>
