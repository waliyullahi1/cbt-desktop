<script setup>
/* =========================================
   RUNTIME CONFIG
========================================= */

const config = useRuntimeConfig()

const projectName =
  config.public.projectName ||
  'Abanise Enterprises'

/* =========================================
   FOOTER LINKS
========================================= */

const buyerLinks = [
  {
    name: 'Search rental properties',
    to: '/search'
  },
  {
    name: 'Create search agent',
    to: '/auth?type=register-page'
  },
  {
    name: 'FAQ',
    to: '/'
  }
]

const landlordLinks = [
  {
    name: 'Partnerships for portals',
    to: '/auth'
  },
  {
    name: 'Partnerships for landlords',
    to: '/auth'
  }
]

const aboutLinks = [
  {
    name: 'About us',
    to: '/about-us'
  },
  {
    name: 'Terms and conditions',
    to: '/terms-and-conditions'
  },
  {
    name: 'Privacy policy',
    to: '/privacy-policy'
  },
  {
    name: 'Contact us',
    to: '/contact-us'
  },
  {
    name: 'Cookie settings',
    to: '/privacy-policy'
  }
]
</script>

<template>

  <footer
    class="w-full border-t border-accent-200 bg-primary text-white"
  >

    <Container
      :addTopBottomPadding="false"
      class="py-12"
    >

      <!-- ====================================
           FOOTER GRID
      ===================================== -->

      <div
        class="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4"
      >

        <!-- ====================================
             BUYERS & RENTERS
        ===================================== -->

        <div>

          <h3
            class="text-lg font-semibold tracking-wide"
          >
            Buyers & Renters
          </h3>

          <div class="mt-5 space-y-3">

            <NuxtLink
              v-for="link in buyerLinks"
              :key="link.name"
              :to="link.to"
              class="footer-link"
            >
              {{ link.name }}
            </NuxtLink>

          </div>

        </div>

        <!-- ====================================
             LANDLORDS
        ===================================== -->

        <div>

          <h3
            class="text-lg font-semibold tracking-wide"
          >
            Landlords & Portals
          </h3>

          <div class="mt-5 space-y-3">

            <NuxtLink
              v-for="link in landlordLinks"
              :key="link.name"
              :to="link.to"
              class="footer-link"
            >
              {{ link.name }}
            </NuxtLink>

          </div>

        </div>

        <!-- ====================================
             ABOUT
        ===================================== -->

        <div>

          <h3
            class="text-lg font-semibold tracking-wide"
          >
            About
          </h3>

          <div class="mt-5 space-y-3">

            <NuxtLink
              v-for="link in aboutLinks"
              :key="link.name"
              :to="link.to"
              class="footer-link"
            >
              {{ link.name }}
            </NuxtLink>

          </div>

        </div>

        <!-- ====================================
             LANGUAGE
        ===================================== -->

        <div>

          <h3
            class="text-lg font-semibold tracking-wide"
          >
            Language
          </h3>

          <div class="mt-5 space-y-3">

            <p class="footer-link">
              English
            </p>

          </div>

        </div>

      </div>

      <!-- ====================================
           BOTTOM
      ===================================== -->

      <div
        class="mt-12 flex md:flex-row flex-col  items-center justify-between gap-4 border-t border-white/20 pt-6 text-sm text-white/80 sm:flex-row"
      >

        <!-- LOGO -->
        <div class="md:flex block items-end gap-3">

          <NavigationLogo2 />

          <p>
            © {{ new Date().getFullYear() }}
            {{ projectName }}.
            All rights reserved.
          </p>

        </div>

        <!-- EXTRA -->
        <div class="md:flex block items-center gap-5">

          <NuxtLink
            to="/privacy-policy"
            class="footer-link-small"
          >
            Privacy
          </NuxtLink>

          <NuxtLink
            to="/terms-and-conditions"
            class="footer-link-small"
          >
            Terms
          </NuxtLink>

          <NuxtLink
            to="/contact-us"
            class="footer-link-small"
          >
            Support
          </NuxtLink>

        </div>

      </div>

    </Container>

  </footer>

</template>

<style scoped>

/* =========================================
   FOOTER LINKS
========================================= */

.footer-link {
  @apply block text-sm text-white/80 transition duration-300 hover:text-white;
}

/* =========================================
   SMALL LINKS
========================================= */

.footer-link-small {
  @apply text-xs text-white/70 transition duration-300 hover:text-white;
}

</style>