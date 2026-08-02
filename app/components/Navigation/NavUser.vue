<template>
  <div class="relative z-[150] w-full">

    <!-- =========================
         NAVBAR
    ========================= -->
    <nav class="border-b bg-white transition-all duration-300">

      <div class="flex items-center justify-between py-3">

        <!-- LEFT -->
        <div class="flex items-center gap-8">

          <NavigationLogo
            @logoClicked="handleLogoClick"
          />

          <!-- DESKTOP LINKS -->
          <div class="hidden items-center gap-5 text-sm font-medium text-gray-600 md:flex">

            <NuxtLink
              v-for="link in links"
              :key="link.to"
              :to="link.to"
              class="transition hover:text-primary"
              :class="{
                'text-primary font-semibold': route.path === link.to
              }"
            >
              {{ link.name }}
            </NuxtLink>

          </div>

        </div>

        <!-- RIGHT -->
        <div class="flex items-center gap-5">

          <!-- ICONS -->
          <div class="hidden items-center gap-5 md:flex">

            <img
              src="/image/icon/notification.svg"
              class="w-5"
              alt="notification"
            />

            <img
              src="/image/icon/messages.svg"
              class="w-5"
              alt="messages"
            />

            <img
              src="/image/icon/question.svg"
              class="w-5"
              alt="help"
            />

          </div>

          <!-- PROFILE -->
          <button
            @click="toggleProfile"
            class="relative flex items-center"
          >

            <img
              :src="avatar"
              class="h-10 w-10 rounded-full border object-cover"
            />

            <span
              class="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500"
            />

          </button>

          <!-- MOBILE BUTTON -->
          <div class="md:hidden">

            <NavigationToggle
              :isOpen="menuOpen"
              @revealMenu="toggleMenu"
            />

          </div>

        </div>

      </div>

    </nav>

    <!-- =========================
         MOBILE MENU
    ========================= -->
    <Transition name="fade">

      <div
        v-if="menuOpen"
        class="fixed inset-0 z-[200] md:hidden"
      >

        <!-- OVERLAY -->
        <div
          class="absolute inset-0 bg-black/40 backdrop-blur-sm"
          @click="closeMenus"
        />

        <!-- DRAWER -->
        <div class="absolute left-0 top-0 h-screen w-[85%] max-w-[360px] overflow-y-auto bg-white shadow-2xl">

          <!-- HEADER -->
          <div class="flex items-center justify-between border-b px-6 py-5">

            <NavigationLogo
              @logoClicked="handleLogoClick"
            />

            <button
              @click="closeMenus"
              class="flex h-10 w-10 items-center justify-center rounded-full border"
            >
              <Icon
                name="heroicons:x-mark"
                class="h-6 w-6"
              />
            </button>

          </div>

          <!-- USER -->
          <div class="px-6 py-5">

            <div class="flex items-center gap-3 rounded-2xl bg-gray-100 p-3">

              <img
                :src="avatar"
                class="h-12 w-12 rounded-full object-cover"
              />

              <div>

                <p class="font-semibold">
                  {{ username }}
                </p>

                <p class="text-sm text-gray-500">
                  {{ role }}
                </p>

              </div>

            </div>

          </div>

          <!-- LINKS -->
          <div class="space-y-1 px-4 pb-10">

            <NuxtLink
              to="/"
              class="mobile-item"
            >
              <Icon
                name="heroicons:home"
                class="menu-icon"
              />
              Home
            </NuxtLink>

            <NuxtLink
              v-for="link in links"
              :key="link.to"
              :to="link.to"
              class="mobile-item"
            >
              <Icon
                :name="link.icon"
                class="menu-icon"
              />
              {{ link.name }}
            </NuxtLink>

            <NuxtLink
              to="/user/list/new"
              class="mobile-item"
            >
              <Icon
                name="heroicons:plus-circle"
                class="menu-icon"
              />
              Post Property
            </NuxtLink>

            <NuxtLink
              v-if="role !== 'user'"
              to="/user/dashboard"
              class="mobile-item"
            >
              <Icon
                name="heroicons:squares-2x2"
                class="menu-icon"
              />
              Dashboard
            </NuxtLink>

            <NuxtLink
              to="/user/settings"
              class="mobile-item"
            >
              <Icon
                name="heroicons:cog-6-tooth"
                class="menu-icon"
              />
              Settings
            </NuxtLink>

            <button
              @click="handleLogout"
              class="mobile-item w-full text-left"
            >
              <Icon
                name="heroicons:arrow-right-on-rectangle"
                class="menu-icon"
              />
              Logout
            </button>

          </div>

        </div>

      </div>

    </Transition>
<!-- =========================
     PROFILE DROPDOWN
========================= -->
<Transition name="fade">

  <div
    v-if="profileOpen"
    class="fixed inset-0 z-[300]"
  >

    <div
      class="absolute inset-0 bg-black/20"
      @click="closeMenus"
    />

    <div
      class="absolute right-4 top-16 w-64 rounded-2xl bg-white shadow-xl"
    >

      <!-- USER INFO -->
      <div class="flex items-center gap-3 border-b p-4">

        <img
          :src="avatar"
          class="h-10 w-10 rounded-full object-cover"
        />

        <div>

          <p class="text-sm font-semibold">
            {{ username }}
          </p>

          <p class="text-xs text-gray-500">
            {{ hiddenEmail }}
          </p>

        </div>

      </div>

      <!-- MENU LINKS -->
      <div class="space-y-2 p-3">

        <NuxtLink
          v-if="role === 'user'"
          to="/user/profile/edit"
          class="menu-link"
        >
          Upgrade Account
        </NuxtLink>

        <NuxtLink
          v-if="role !== 'user'"
          to="/user/dashboard"
          class="menu-link"
        >
          Dashboard
        </NuxtLink>

        <NuxtLink
          to="/user/list"
          class="menu-link"
        >
         Properties
        </NuxtLink>

        <NuxtLink
          to="/user/list/new"
          class="menu-link"
        >
          Post Property
        </NuxtLink>

        <NuxtLink
          to="/user/list/orders"
          class="menu-link"
        >
         Orders
        </NuxtLink>

        

        <NuxtLink
          to="/user/profile/edit"
          class="menu-link"
        >
          Profile
        </NuxtLink>

        <NuxtLink
          to="/user/settings"
          class="menu-link"
        >
          Settings
        </NuxtLink>

      </div>

      <!-- LOGOUT -->
      <div class="border-t p-3">

        <button
          @click="handleLogout"
          class="menu-link w-full text-left"
        >
          Logout
        </button>

      </div>

    </div>

  </div>

</Transition>

</div>
</template>
<script setup>
import {
  ref,
  computed,
  watch,
  onMounted,
  onUnmounted
} from "vue"

import {
  useRouter,
  useRoute
} from "vue-router"

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

const links = [
  {
    name: "Properties",
    to: "/search",
    icon: "heroicons:building-office-2"
  },
  {
    name: "Agents",
    to: "/agent",
    icon: "heroicons:user-group"
  },
  {
    name: "About Us",
    to: "/about-us",
    icon: "heroicons:information-circle"
  },
  {
    name: "Contact Us",
    to: "/contact-us",
    icon: "heroicons:phone"
  },
  {
    name: "Privacy Policy",
    to: "/privacy-policy",
    icon: "heroicons:shield-check"
  }
]

/* =========================
   STATE
========================= */

const preview = ref("")
const menuOpen = ref(false)
const profileOpen = ref(false)

/* =========================
   COMPUTED
========================= */

const user = computed(() => {
  return auth.value?.user || {}
})

const avatar = computed(() => {
  return (
    preview.value ||
    user.value.avatar ||
    defaultAvatar
  )
})

const username = computed(() => {
  return user.value.firstName || "User"
})

const role = computed(() => {
  return user.value.roles || "User"
})

const hiddenEmail = computed(() => {
  const email = user.value.email

  if (!email) {
    return ""
  }

  const [name, domain] = email.split("@")

  return (
    name.slice(0, 4) +
    "*".repeat(5) +
    "@" +
    domain
  )
})

/* =========================
   MENU METHODS
========================= */

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value

  if (menuOpen.value) {
    profileOpen.value = false
  }
}

const toggleProfile = () => {
  profileOpen.value = !profileOpen.value

  if (profileOpen.value) {
    menuOpen.value = false
  }
}

const closeMenus = () => {
  menuOpen.value = false
  profileOpen.value = false
}

const handleLogoClick = () => {
  router.push("/")
}

/* =========================
   LOGOUT
========================= */

const handleLogout = async () => {
  try {
    const response = await fetch(
      `${config.public.api_url}/auth/logout`,
      {
        method: "POST",
        credentials: "include"
      }
    )

    const data = await response.json()

    if (!response.ok) {
      console.log( data.message);
      auth.value.user = null
    auth.value.authenticated = false
    auth.value.checked = false
    window.location.reload();
      return $toast.error(
        data.message || "Logout failed"
      )
    }

    auth.value.user = null
    auth.value.authenticated = false
    auth.value.checked = false
    window.location.reload();
    closeMenus()

    $toast.success(
      data.message || "Logout successful"
    )
  } catch (error) {
    $toast.error(
      error.message || "Something went wrong"
    )
  }
}

/* =========================
   FETCH AVATAR
========================= */

const fetchAvatar = async () => {
  try {
    const res = await fetch(
      `${config.public.api_url}/profile/avatar`,
      {
        credentials: "include"
      }
    )

    const data = await res.json()

    if (data.success) {
      preview.value = data.avatar
    }
  } catch (error) {
    console.error(error)
  }
}

/* =========================
   WATCHERS
========================= */

watch(
  () => route.fullPath,
  () => {
    closeMenus()
  }
)

watch(
  menuOpen,
  (value) => {
    if (process.client) {
      document.body.style.overflow =
        value ? "hidden" : ""
    }
  }
)

/* =========================
   LIFECYCLE
========================= */

onMounted(() => {
  fetchAvatar()
})

onUnmounted(() => {
  if (process.client) {
    document.body.style.overflow = ""
  }
})
</script>




<style scoped>


.mobile-item{

@apply flex items-center gap-4 rounded-xl px-4 py-3 text-gray-700 transition hover:bg-gray-100;

}


.menu-icon{

@apply h-5 w-5 text-gray-500;

}



.menu-link{

@apply block rounded-lg px-3 py-2 text-sm transition hover:bg-gray-100;

}




.fade-enter-active,
.fade-leave-active{

transition:opacity .3s ease;

}


.fade-enter-from,
.fade-leave-to{

opacity:0;

}





</style>