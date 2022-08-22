<script>
  import "../app.css";
</script>

<div class="min-h-screen bg-background-dark">
  <nav class="bg-background-dark border-b p-3 border-background-light">
    <img src="/text.png" alt="SpinnerDex logotype" class="h-8 md:h-16" />
  </nav>

  <slot />

  <footer
    class="fixed bottom-0 w-full flex items-center justify-center text-background-light p-1"
  >
    By Pops (FPSB) - 2022
  </footer>
</div>
