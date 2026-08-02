<script setup>
import {ref,computed, watch, onMounted, onUnmounted } from "vue"
import { useRouter, useRoute } from "vue-router"
import { useRuntimeConfig } from "#app"


/* =========================
   COMPOSABLES
========================= */

const router = useRouter()
const route = useRoute()
const config = useRuntimeConfig()

const auth = useAuth()
const { $toast } = useNuxtApp()



/* =========================
   CONSTANTS
========================= */

const defaultAvatar = "/image/icon/avatar.svg"


const navLinks = [
  {
    name: "Dashboard",
    to: "/user/dashboard",
    icon: "heroicons:squares-2x2",
    hideOnMd:false
  },
  {
    name: "Properties",
    to: "/user/list",
    icon: "heroicons:building-office-2",
    hideOnMd:false

  },
  {
  name: "Orders",
  to: "/user/orders",
  icon: "heroicons:shopping-bag",
  hideOnMd: true
},
  {
    name: "Payments",
    to: "/user/payment",
    icon: "heroicons:credit-card",
    badge: "New",
    hideOnMd:false,

  },
  {
    name: "Earnings",
    to: "/user/earnings",
    icon: "heroicons:banknotes",
    hideOnMd:false,

  },
  {
    name: "Inspections",
    to: "/user/inspections",
    icon: "heroicons:calendar-days",
    hideOnMd: true
  },
  {
    name: "Settings",
    to: "/user/settings",
    icon: "heroicons:cog-6-tooth",
    hideOnMd:true,
  }
]


/* =========================
   STATE
========================= */

const menuOpen = ref(false)
const profileOpen = ref(false)



/* =========================
   COMPUTED
========================= */

const currentUser = computed(() => {
  return auth.value?.user || {}
})


const avatar = computed(() => {
  return currentUser.value.avatar || defaultAvatar
})


const username = computed(() => {
  return currentUser.value.firstName || "User"
})


const userRole = computed(() => {
  return currentUser.value.roles || "User"
})



/* =========================
   MENU
========================= */


const closeMenus = () => {

  menuOpen.value = false
  profileOpen.value = false

}


const toggleMobileMenu = () => {

  menuOpen.value = !menuOpen.value

  if(menuOpen.value){
    profileOpen.value = false
  }

}



const toggleProfile = () => {

  profileOpen.value = !profileOpen.value

  if(profileOpen.value){
    menuOpen.value = false
  }

}



/* =========================
   LOGO
========================= */

const goHome = () => {
  router.push("/")
}



/* =========================
   LOGOUT
========================= */

const handleLogout = async()=>{

  try{


    const res = await fetch(
      `${config.public.api_url}/auth/logout`,
      {
        method:"POST",
        credentials:"include",
        headers:{
          "Content-Type":"application/json"
        }
      }
    )


    const data = await res.json()


    if(!res.ok){
 auth.value.user = null
    auth.value.authenticated = false
    auth.value.checked = false
      return $toast.error(
        data.message || "Logout failed"
      )

    }



    auth.value.user = null
    auth.value.authenticated = false
    auth.value.checked = false


    closeMenus()


    $toast.success(
      data.message || "Logout successful"
    )


    router.push("/")



  }catch(error){

    $toast.error(
      error.message || "Something went wrong"
    )

  }

}



/* =========================
   ROUTE WATCH
========================= */

watch(
  ()=>route.fullPath,
  ()=>{
    closeMenus()
  }
)



/* =========================
   BODY SCROLL LOCK
========================= */


watch(
  menuOpen,
  value=>{

    if(process.client){

      document.body.style.overflow =
        value ? "hidden" : ""

    }

  }
)



onMounted(()=>{})


onUnmounted(()=>{

  if(process.client){
    document.body.style.overflow=""
  }

})

</script>

<template>

  <div class="w-full">


<!-- =========================
     NAVBAR
========================= -->

  <nav class="relative z-50 border-b bg-white">


    <div class="mx-auto flex items-center justify-between px-4 py-3">


    <!-- LEFT -->
    <div class="flex items-center gap-4">


      <!-- MOBILE BUTTON -->
      <div class="md:hidden">
         <NavigationToggle :isOpen="menuOpen" @revealMenu="toggleMobileMenu"/>
      </div>

       <!-- LOGO -->

      <NavigationLogo @logoClicked="goHome" />



    <!-- DESKTOP LINKS -->

    <div class=" hidden items-center gap-2 md:flex" >
      <template v-for="link in navLinks"  :key="link.to" >
        <NuxtLink  v-if="!link.hideOnMd"   :to="link.to"   class="desktop-link hidden"
          :class="[ 'desktop-link', route.path === link.to ? 'active-link' : '', link.hideOnMd ? 'hidden' : 'hidden ']">
          <Icon :name="link.icon" class="h-4 w-4"/>
        
          <span>{{link.name}}</span>
          
          <span  v-if="link.badge"  class="rounded-full bg-green-100 px-2 py-1 text-[10px] font-semibold text-green-700">
          {{link.badge}}
          </span>


        </NuxtLink>
    </template>
    </div>


    </div>





    <!-- RIGHT -->

    <div  class="flex items-center gap-5"  >


      <button class="hidden md:block hover:text-secondary">

        <Icon name="heroicons:bell" class="h-5 w-5"/>

      </button>

      <button class="hidden md:block hover:text-secondary" >

        <Icon name="heroicons:chat-bubble-left-right" class="h-5 w-5"/>

      </button>

      <!-- PROFILE BUTTON -->

      <button  @click="toggleProfile" class="relative flex items-center" aria-label="Profile menu" >
        <img :src="avatar" class="h-10 w-10 rounded-full object-cover" alt="profile"/>
        <span class="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500"/>
      </button>


    </div>


    </div>

  </nav>


      <!-- =========================
      MOBILE OVERLAY
      ========================= -->
      <Transition name="fade">

      <div v-if="menuOpen" class="fixed inset-0 z-[190] bg-black/50 backdrop-blur-sm md:hidden" @click="closeMenus"/>

      </Transition>
      <!-- =========================
      MOBILE SIDEBAR
      ========================= -->

      <Transition name="slide">
          <aside v-if="menuOpen" class="fixed left-0 top-0 z-[200] h-screen w-[85%] max-w-[340px] overflow-y-auto bg-white shadow-xl md:hidden" >



            <!-- HEADER -->
            <div class="sticky top-0 flex items-center justify-between border-b bg-white px-5 py-5">

                <NavigationLogo  @logoClicked="goHome" />
              <button @click="closeMenus" class="flex h-10 w-10 items-center justify-center rounded-full border">
                <Icon name="heroicons:x-mark" class="h-6 w-6" />
                </button>


            </div>

            <!-- USER INFO -->

            <div class="border-b px-5 py-5">


              <div class="flex items-center gap-3">


                <img :src="avatar" class="h-12 w-12 rounded-full object-cover"/>


                <div>
                  <p class="font-semibold"> {{username}} </p>
                  <p class="text-sm text-gray-500"> {{userRole}}</p>
                </div>


              </div>


            </div>

          <!-- MOBILE LINKS -->

            <div class="space-y-1 p-4"  >


            <NuxtLink  v-for="link in navLinks"  :key="link.to" :to="link.to" class="mobile-link"  >
              <Icon :name="link.icon"  class="menu-icon" />
              <div  class="flex flex-1 items-center justify-between" >


                  <span>{{link.name}} </span>
                  <span v-if="link.badge" class="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700" >
                  {{link.badge}}
                  </span>


              </div>
            </NuxtLink>

            <div class="my-4 border-t"/>
              <button @click="handleLogout" class="mobile-link w-full text-red-500" >
                <Icon name="heroicons:arrow-right-on-rectangle" class="menu-icon text-red-500" />
                Logout
              </button>
            </div>

          </aside>


      </Transition>

      <!-- =========================
      PROFILE DROPDOWN
      ========================= -->


    <Transition name="fade">


    <div  v-if="profileOpen"  class="fixed inset-0 z-[250]"  >
      <div class="absolute inset-0"  @click="closeMenus" />

      <div class="absolute right-5 top-16 w-64 overflow-hidden rounded-2xl bg-white shadow-xl"  >



      <!-- USER -->

        <div  class="flex items-center gap-3 border-b p-4" >
            <img  :src="avatar"class="h-10 w-10 rounded-full object-cover" />
            <div>

              <p class="font-semibold">  {{username}} </p>
              <p class="text-xs text-gray-500">  {{userRole}}   </p>


            </div>


        </div>

    <!-- LINKS -->

    <div class="p-3">

      <NuxtLink v-for="link in navLinks" :key="link.to" :to="link.to" class="dropdown-link"  >
      <Icon :name="link.icon"  class="h-4 w-4"/>{{link.name}}
      </NuxtLink>
    </div>






    <!-- LOGOUT -->


    <div
    class="border-t p-3"
    >


    <button
    @click="handleLogout"
    class="dropdown-link w-full text-red-500"
    >


    <Icon
    name="heroicons:arrow-right-on-rectangle"
    class="h-4 w-4"
    />


    Logout


    </button>


    </div>



    </div>


    </div>


    </Transition>



  </div>


</template>






<style scoped>


/* =========================
 TRANSITIONS
========================= */


.fade-enter-active,
.fade-leave-active{
transition:opacity .25s ease;
}


.fade-enter-from,
.fade-leave-to{
opacity:0;
}



.slide-enter-active,
.slide-leave-active{
transition:transform .3s ease;
}


.slide-enter-from,
.slide-leave-to{
transform:translateX(-100%);
}





/* =========================
 DESKTOP NAV
========================= */


.desktop-link{

@apply flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-gray-100;

}


.desktop-link.router-link-active{

@apply text-secondary;

}





/* =========================
 MOBILE LINKS
========================= */


.mobile-link{

@apply flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition hover:bg-gray-100;

}



.menu-icon{

@apply h-5 w-5;

}





/* =========================
 DROPDOWN
========================= */


.dropdown-link{

@apply flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition hover:bg-gray-100;

}


</style>
