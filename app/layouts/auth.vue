<script setup>
import { computed, watch } from 'vue'

const route = useRoute()
const auth = useAuth()

/*
|--------------------------------------------------------------------------
| ROUTE META
|--------------------------------------------------------------------------
*/

const access = computed(() => route.meta.access)
const sellerOnly = computed(() => route.meta.sellerOnly)
const isPrivateRoute = computed(() => route.meta.isPrivateRoute)

/*
|--------------------------------------------------------------------------
| AUTH CHECK
|--------------------------------------------------------------------------
*/

// watch(
//   () => auth.value.checked,
//   async (checked) => {

//     if (!checked) return

//     /*
//     |--------------------------------------------------------------------------
//     | PRIVATE ROUTE
//     |--------------------------------------------------------------------------
//     */

//     if (isPrivateRoute.value && !auth.value.authenticated) {
//       return await navigateTo('/auth')
//     }

//     /*
//     |--------------------------------------------------------------------------
//     | SELLER ONLY ROUTE
//     |--------------------------------------------------------------------------
//     */

//     if (sellerOnly.value) {

//       // not logged in
//       if (!auth.value.authenticated) {
//         return await navigateTo('/auth')
//       }

//       // logged in but normal user
//       if (auth.value.user?.roles === 'user') {
//         return await navigateTo('/profile/edit')
//       }

//     }

//   },
//   {
//     immediate: true
//   }
// )
</script>

<template>
  <div>
  <SignIn v-if="auth?.showLoginModal"/> 
    <!-- SELLER NAVBAR -->
    <NavigationSellerNavBar
      v-if="
        auth.authenticated &&
        auth.user?.roles !== 'user' &&
        access === 'seller'
      "
    />

    <!-- LOGGED IN USER NAV -->
    <NavigationNavUser
      v-else-if="auth.authenticated"
    />

    <!-- GUEST NAV -->
    <NavigationNavbar
      v-else
    />

    <slot />

  </div>
</template>