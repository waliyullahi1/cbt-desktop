<template>

  <div
     class="  h-full   justify-center  pt items-center bg-cover w-full overflow-hidden bg-center"
  style="background-image: url('/image/background.png')"
  >
   
     <div class=" bg-black/5  h-full   flex flex-col justify-center items-center"  >
    <!-- Main Content -->
    <main class="h-fll  -translate-y-7   max-w-2/3  bg-ar-300 h-fit  bger-300 w-fl   overflow-y-auto">

      <!-- Top Activation Bar -->
      <section
        class="mx-4 mt-  flex   items-center justify-between
               rounded-xl  
                px-6 py-3
               shadow-sm backdrop-blur"
      >
        <div class="flex  items-center gap-3">

          <div
            class="flex h-7 w-7 items-center justify-center
                   rounded-full bg-yellow-400 text-white"
          >
            <Icon
              name="lucide:triangle-alert"
              class="h-6 w-6"
            />
          </div>

          <span class="font-semibold  text-xs text-green-700">
            Welcome to your learning journey
          </span>

        </div>

        <div class="hidden items-center gap-4 md:flex">

          <span
            class="rounded-md bg-yellow-400  text-xs px-5 py-1
                   font-bold text-gray-900"
          >
            Unlock Premium Learning
          </span>

          <button
            class="rounded-full text-xs bg-orange-500
                   px-4 py-1 font-bold text-white
                   transition hover:bg-orange-600"
          >
            Activate
          </button>

        </div>
      </section>


      <!-- Dashboard -->
      <section
        class="mx-4 mt-2 hidden  grid w-fit   h-fit 
               grid-cols-1 gap-3
               lg:grid-cols-4"
      >

        <!-- LEFT: Six Feature Cards -->
        <div 
          class="grid grid-cols-2 gap-2
                 sm:grid-cols-2
                 lg:col-span-2"
        >

          <button type="button" @click="openQuickPage(  item ) "
            v-for="item in dashboardItems"
            :key="item.title"
            :to="item.route"
           
            class="group flex min-h-[50px]
                   flex-col items-center
                   justify-center rounded-sm
                   p-3 text-center
                   transition-all duration-200
                   hover:-translate-y-1
                   hover:shadow-xl"
            :class="item.class"
          >

            <Icon
              :name="item.icon"
              class="mb-1    text-4xl
                     transition-transform
                     duration-200 font-semibold
                     group-hover:scale-110"
            />

            <h2 class="text-sm font-bold">
              {{ item.title }}
            </h2>

            <p class="mt- text-xs opacity-70">
              {{ item.description }}
            </p>

          </button>

        </div>


        <!-- RIGHT: Featured Area -->
        <div
          class="relative h-full
                 overflow-hidden rounded-xl
                 bg-slate-900
                 lg:col-span-2"
        >

          <!-- Background Image -->
          <img
            :src="slides[currentSlide].image"
            alt="Featured learning"
            class="absolute inset-0
                   h-full w-full
                   object-cover opacity-60"
          />

          <!-- Dark Overlay -->
          <div
            class="absolute inset-0
                   bg-gradient-to-t
                   from-black/90
                   via-black/30
                   to-transparent"
          />

          <!-- Content -->
          <div
            class="absolute inset-x-0 bottom-0
                   p-7 text-white"
          >

            <span
              class="inline-flex items-center gap-2
                     rounded-full bg-blue-600
                     px-3 py-1 text-xs font-bold"
            >
              <Icon
                name="lucide:sparkles"
                class="h-4 w-4"
              />

              Featured
            </span>

            <h2
              class="mt-4 text-xl
                     font-extrabold"
            >
              {{ slides[currentSlide].title }}
            </h2>

            <p
              class="mt-1 max-w-md text-xs
                     text-sm text-white/80"
            >
              {{ slides[currentSlide].description }}
            </p>

            <button
              class="mt-5 flex items-center
                     gap-2 rounded-lg
                     bg-blue-600 px-3 py-1 text-sm
                     font-bold
                     transition hover:bg-blue-700"
            >
              {{ slides[currentSlide].button }}

              <Icon
                name="lucide:arrow-right"
                class="h-5 w-5"
              />
            </button>

          </div>


          <!-- Previous -->
          <button
            @click="previousSlide"
            class="absolute left-4 top-1/2
                   flex h-10 w-10
                   -translate-y-1/2
                   items-center justify-center
                   rounded-full bg-black/40
                   text-white backdrop-blur
                   transition hover:bg-black/70"
          >
            <Icon
              name="lucide:chevron-left"
              class="h-6 w-6"
            />
          </button>


          <!-- Next -->
          <button
            @click="nextSlide"
            class="absolute right-4 top-1/2
                   flex h-10 w-10
                   -translate-y-1/2
                   items-center justify-center
                   rounded-full bg-black/40
                   text-white backdrop-blur
                   transition hover:bg-black/70"
          >
            <Icon
              name="lucide:chevron-right"
              class="h-6 w-6"
            />
          </button>


          <!-- Dots -->
          <div
            class="absolute bottom-5
                   right-6 flex gap-2"
          >

            <button
              v-for="(_, index) in slides"
              :key="index"
              @click="currentSlide = index"
              class="h-3 w-3 rounded-full
                     transition-all"
              :class="
                currentSlide === index
                  ? 'w-8 bg-blue-500'
                  : 'bg-white/50'
              "
            />

          </div>

        </div>

      </section>

<!---- Testing codwe-->
<div
  class="
    page-container
    mx-4
    mt-2
  "
>

  <section
    class=" h-96  max-w-7xl h- bg-amber-400 "
  >
    <div v-if="current === 1"  class=" w-full h-full ">
    page 1
    </div>
     <div  v-else-if="current === 2"  class=" w-full h-full ">
    page 2
    </div>
     <div  v-else-if="current === 3" class=" w-full h-full ">
    page 3
    </div>
  <div  v-if="isHomepage"  :class="[
      'page-sheet',
      {
        'page-turning': isAnimating
      }
    ]" class="absolute h-96  max-w-7xl">
    <!-- LEFT: Six Feature Cards -->

    <div
      class="
        grid
        grid-cols-2
        gap-2
        sm:grid-cols-2
        lg:col-span-2
      "
    >

      <button
        v-for="item in dashboardItems"
        :key="item.title"

        type="button"

        @click="openQuickPage(item)"

        class="
          group
          flex
          min-h-[50px]
          flex-col
          items-center
          justify-center
          rounded-sm
          p-3
          text-center
          transition-all
          duration-200
          hover:-translate-y-1
          hover:shadow-xl
        "

        :class="item.class"
      >

        <Icon
          :name="item.icon"

          class="
            mb-1
            text-4xl
            font-semibold
            transition-transform
            duration-200
            group-hover:scale-110
          "
        />

        <h2
          class="
            text-sm
            font-bold
          "
        >
          {{ item.title }}
        </h2>

        <p
          class="
            text-xs
            opacity-70
          "
        >
          {{ item.description }}
        </p>

      </button>

    </div>


    <!-- RIGHT: Featured Area -->

    <div
      class="
        relative
        h-full
        overflow-hidden
        rounded-xl
        bg-slate-900
        lg:col-span-2
      "
    >

      <img
        :src="
          slides[currentSlide].image
        "

        alt="Featured learning"

        class="
          absolute
          inset-0
          h-full
          w-full
          object-cover
          opacity-60
        "
      />


      <div
        class="
          absolute
          inset-0
          bg-gradient-to-t
          from-black/90
          via-black/30
          to-transparent
        "
      />


      <div
        class="
          absolute
          inset-x-0
          bottom-0
          p-7
          text-white
        "
      >

        <span
          class="
            inline-flex
            items-center
            gap-2
            rounded-full
            bg-blue-600
            px-3
            py-1
            text-xs
            font-bold
          "
        >

          <Icon
            name="lucide:sparkles"
            class="h-4 w-4"
          />

          Featured

        </span>


        <h2
          class="
            mt-4
            text-xl
            font-extrabold
          "
        >

          {{
            slides[currentSlide].title
          }}

        </h2>


        <p
          class="
            mt-1
            max-w-md
            text-sm
            text-white/80
          "
        >

          {{
            slides[currentSlide].description
          }}

        </p>


        <button
          class="
            mt-5
            flex
            items-center
            gap-2
            rounded-lg
            bg-blue-600
            px-3
            py-1
            text-sm
            font-bold
            transition
            hover:bg-blue-700
          "
        >

          {{
            slides[currentSlide].button
          }}

          <Icon
            name="lucide:arrow-right"
            class="h-5 w-5"
          />

        </button>

      </div>


      <!-- Previous -->

      <button
        @click="previousSlide"

        class="
          absolute
          left-4
          top-1/2
          flex
          h-10
          w-10
          -translate-y-1/2
          items-center
          justify-center
          rounded-full
          bg-black/40
          text-white
          backdrop-blur
          transition
          hover:bg-black/70
        "
      >

        <Icon
          name="lucide:chevron-left"
          class="h-6 w-6"
        />

      </button>


      <!-- Next -->

      <button
        @click="nextSlide"

        class="
          absolute
          right-4
          top-1/2
          flex
          h-10
          w-10
          -translate-y-1/2
          items-center
          justify-center
          rounded-full
          bg-black/40
          text-white
          backdrop-blur
          transition
          hover:bg-black/70
        "
      >

        <Icon
          name="lucide:chevron-right"
          class="h-6 w-6"
        />

      </button>


      <!-- Dots -->

      <div
        class="
          absolute
          bottom-5
          right-6
          flex
          gap-2
        "
      >

        <button
          v-for="(_, index) in slides"
          :key="index"

          @click="
            currentSlide = index
          "

          class="
            h-3
            w-3
            rounded-full
            transition-all
          "

          :class="
            currentSlide === index
              ? 'w-8 bg-blue-500'
              : 'bg-white/50'
          "
        />

      </div>

    </div>
  </div>
  </section>

</div>
      <!-- Bottom Quick Access -->
     <!-- Bottom Quick Access -->
      <section
        class="mx-4 mt-4 grid grid-cols-2 gap-3 pb-6 md:grid-cols-4"
      >
        <NuxtLink
          v-for="item in quickAccess"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-4 rounded-xl p-4 shadow-sm backdrop-blur transition hover:shadow-lg"
        >
          <Icon
            :name="item.icon"
            :class="['h-8 w-8', item.iconClass]"
          />

          <div>
            <h3 class="font-bold">
              {{ item.title }}
            </h3>

            <p class="text-xs text-gray-500">
              {{ item.description }}
            </p>
          </div>
        </NuxtLink>
      </section>

    </main>
  </div>

  </div>

</template>


<script setup>

import {
  ref
} from 'vue'

const isHomepage = ref(true)

//  type="button"

//             @click="
//               openQuickPage(
//                 item
//               )
//             "
/*
|--------------------------------------------------------------------------
| Import pages
|--------------------------------------------------------------------------
*/

import PracticeUTME
  from '~/components/PracticeUTME.vue'

import PracticeWAEC
  from '~/components/PracticeWAEC.vue'

import PracticeNECO
  from '~/components/PracticeNECO.vue'

import Classroom
  from '~/components/Classroom.vue'

import Marketplace
  from '~/components/Marketplace.vue'

import PastQuestions
  from '~/components/PastQuestions.vue'

import Performance
  from '~/components/Performance.vue'

import Leaderboard
  from '~/components/Leaderboard.vue'

import Quizzes
  from '~/components/Quizzes.vue'

import Teachers
  from '~/components/Teachers.vue'


/*
|--------------------------------------------------------------------------
| Navigation event
|--------------------------------------------------------------------------
*/

const emit = defineEmits([
  'navigate'
])


/*
|--------------------------------------------------------------------------
| Dashboard items
|--------------------------------------------------------------------------
*/

const dashboardItems = [

  {
    title:
      'Practice for UTME',

    description:
      'Prepare for JAMB CBT',

    icon:
      'lucide:rocket',

    class:
      'bg-indigo-100 text-indigo-900',

    component:
      PracticeUTME
  },


  {
    title:
      'Practice for WAEC',

    description:
      'Master WAEC past questions',

    icon:
      'lucide:book-open',

    class:
      'bg-pink-100 text-pink-900',

    component:
      PracticeWAEC
  },


  {
    title:
      'Practice for NECO',

    description:
      'Prepare for your NECO exam',

    icon:
      'lucide:graduation-cap',

    class:
      'bg-teal-100 text-teal-900',

    component:
      PracticeNECO
  },


  {
    title:
      'Classroom',

    description:
      'Learn from expert teachers',

    icon:
      'lucide:school',

    class:
      'bg-blue-100 text-blue-900',

    component:
      Classroom
  },


  {
    title:
      'Marketplace',

    description:
      'Discover courses and teachers',

    icon:
      'lucide:store',

    class:
      'bg-purple-100 text-purple-900',

    component:
      Marketplace
  },


  {
    title:
      'Past Questions',

    description:
      'Practice previous exam questions',

    icon:
      'lucide:file-question',

    class:
      'bg-orange-100 text-orange-900',

    component:
      PastQuestions
  }

]


/*
|--------------------------------------------------------------------------
| Slides
|--------------------------------------------------------------------------
*/

const slides = [

  {

    title:
      'Prepare. Practice. Succeed.',

    description:
      'Build your confidence with thousands of practice questions and expert lessons.',

    button:
      'Start Practicing',

    image:
      '/image/student.jpg'

  },


  {

    title:
      'Learn from Expert Teachers',

    description:
      'Join teachers, explore courses and learn at your own pace.',

    button:
      'Explore Marketplace',

    image:
      '/image/teacher.jpg'

  },


  {

    title:
      'Your Exam Success Starts Here',

    description:
      'Prepare for UTME, WAEC, NECO and other examinations.',

    button:
      'Explore Exams',

    image:
      '/image/exam.jpg'

  }

]


/*
|--------------------------------------------------------------------------
| Quick access
|--------------------------------------------------------------------------
*/

const quickAccess = [

  {

    title:
      'Performance',

    description:
      'Track your progress',

    icon:
      'lucide:chart-no-axes-combined',

    iconClass:
      'text-blue-600',

    component:
      Performance

  },


  {

    title:
      'Leaderboard',

    description:
      'See top students',

    icon:
      'lucide:trophy',

    iconClass:
      'text-yellow-600',

    component:
      Leaderboard

  },


  {

    title:
      'Quizzes',

    description:
      'Test your knowledge',

    icon:
      'lucide:brain',

    iconClass:
      'text-purple-600',

    component:
      Quizzes

  },


  {

    title:
      'Teachers',

    description:
      'Find expert teachers',

    icon:
      'lucide:users',

    iconClass:
      'text-green-600',

    component:
      Teachers

  }

]


/*
|--------------------------------------------------------------------------
| Slider
|--------------------------------------------------------------------------
*/

const currentSlide =
  ref(0)


const nextSlide = () => {

  currentSlide.value =

    (
      currentSlide.value + 1
    )
    %
    slides.length

}


const previousSlide = () => {

  currentSlide.value =

    (
      currentSlide.value - 1
      +
      slides.length
    )
    %
    slides.length

}


/*
|--------------------------------------------------------------------------
| Open dashboard page
|--------------------------------------------------------------------------
*/

// const openPage = (
//   item
// ) => {

//   if (
//     !item.component
//   ) {

//     return

//   }


//   emit(
//     'navigate',
//     {

//       component:
//         item.component

//     }
//   )

// }

const current = ref(0)
// import { ref } from 'vue'

const isAnimating = ref(false)


const openQuickPage = (item) => {

  /*
   * Start the paper animation
   */

  isAnimating.value = true
  current.value = 1

  /*
   * Wait for animation to finish
   */

  setTimeout(() => {

    /*
     * Now open the child component
     */

    emit('navigate', {
      component: item.component
    })


    /*
     * Reset
     */

    isAnimating.value = false

  }, 900)

}


/*
|--------------------------------------------------------------------------
| Open quick access page
|--------------------------------------------------------------------------
*/

// const openQuickPage = (
//   item
// ) => {


//   if (
//     !item.component
//   ) {

//     return

//   }


//   emit(
//     'navigate',
//     {

//       component:
//         item.component

//     }
//   )

// }

</script>

<style scoped>

.page-container {

  /*
   * Creates 3D depth
   */

  perspective:
    1600px;

}


/*
|--------------------------------------------------------------------------
| Your entire dashboard section becomes one paper
|--------------------------------------------------------------------------
*/

.page-sheet {

  position:
    relative;

  transform-origin:
    top left;

  transform-style:
    preserve-3d;

  transition:
    transform
    900ms
    cubic-bezier(
      0.22,
      1,
      0.36,
      1
    );

}


/*
|--------------------------------------------------------------------------
| The paper is turning away
|--------------------------------------------------------------------------
*/

.page-sheet.page-turning {

  transform:

    rotateY(
      -75deg
    )

    rotateX(
      8deg
    )

    translateX(
      -20px
    )

    translateY(
      20px
    );

}


/*
|--------------------------------------------------------------------------
| Optional: make the paper look like it is lifting
|--------------------------------------------------------------------------
*/

.page-sheet.page-turning::after {

  content:
    '';

  position:
    absolute;

  inset:
    0;

  pointer-events:
    none;

  background:
    linear-gradient(
      90deg,
      rgba(0,0,0,0.0),
      rgba(0,0,0,0.15),
      rgba(0,0,0,0.45)
    );

  opacity:
    1;

  transition:
    opacity
    900ms
    ease;

}

</style>