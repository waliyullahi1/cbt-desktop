<template>
  <div class="section-stack">

    <!--
      The current section.
      This is the paper that will animate away.
    -->
    <div
      class="section-page"
      :class="{
        'section-page-leaving': isAnimating
      }"
    >
      <component
        :is="currentComponent"
        @open-section="openSection"
      />
    </div>

  </div>
</template>


<script setup>

import {
  ref,
  computed
} from 'vue'


/*
|--------------------------------------------------------------------------
| The first section
|--------------------------------------------------------------------------
*/

const props = defineProps({

  initialComponent: {
    type: Object,
    required: true
  }

})


/*
|--------------------------------------------------------------------------
| Current component
|--------------------------------------------------------------------------
*/

const currentComponent =
  ref(props.initialComponent)


/*
|--------------------------------------------------------------------------
| Animation state
|--------------------------------------------------------------------------
*/

const isAnimating =
  ref(false)


/*
|--------------------------------------------------------------------------
| Open another section
|--------------------------------------------------------------------------
*/

const openSection = (component) => {

  /*
  |--------------------------------------------------------------------------
  | Prevent double click
  |--------------------------------------------------------------------------
  */

  if (isAnimating.value) {
    return
  }


  /*
  |--------------------------------------------------------------------------
  | Start paper animation
  |--------------------------------------------------------------------------
  */

  isAnimating.value = true


  /*
  |--------------------------------------------------------------------------
  | After animation,
  | replace current section
  |--------------------------------------------------------------------------
  */

  setTimeout(() => {

    currentComponent.value =
      component

    isAnimating.value =
      false

  }, 800)

}

</script>


<style scoped>

.section-stack {

  position: relative;

  width: 100%;

  min-height: 100vh;

  perspective: 1600px;

  overflow: hidden;

}


/*
|--------------------------------------------------------------------------
| Current section
|--------------------------------------------------------------------------
*/

.section-page {

  width: 100%;

  min-height: 100vh;

  transform-origin:
    top left;

  transform-style:
    preserve-3d;

  background: white;

}


/*
|--------------------------------------------------------------------------
| Paper is leaving
|--------------------------------------------------------------------------
*/

.section-page-leaving {

  animation:
    paperLeave
    800ms
    cubic-bezier(
      0.22,
      1,
      0.36,
      1
    )
    forwards;

}


/*
|--------------------------------------------------------------------------
| Paper animation
|--------------------------------------------------------------------------
*/

@keyframes paperLeave {

  0% {

    transform:
      rotateY(0deg)
      rotateX(0deg)
      translateX(0)
      translateY(0);

    opacity: 1;

  }


  30% {

    transform:
      rotateY(-15deg)
      rotateX(4deg)
      translateX(-10px)
      translateY(5px);

    opacity: 1;

  }


  60% {

    transform:
      rotateY(-45deg)
      rotateX(8deg)
      translateX(-50px)
      translateY(20px);

    opacity: 0.9;

  }


  100% {

    transform:
      rotateY(-90deg)
      rotateX(10deg)
      translateX(-150px)
      translateY(50px);

    opacity: 0;

  }

}

</style>