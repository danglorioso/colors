<script lang="ts">
  import { findClosest } from "$lib/color/match";
  import { toOKLCHString } from "../lib/color/convert";


  let input = $state("");
  let results = $state([]);
  let target_oklch = $state("oklch(50% 0 0)");

  function oklchToString(c) {
    if (!c || typeof c !== 'object' || c.l === undefined) return '';
    // Clamp values for safety
    const l = Math.max(0, Math.min(1, c.l)) * 100;
    const cVal = c.c ?? 0;
    const h = c.h ?? 0;
    return `oklch(${l}% ${cVal} ${h})`;
  }

  function run() {
    try {
      // Array of Tailwnind colors closest to input
      results = findClosest(input, 5);

      // Input color in OKLCH format as string
      target_oklch = toOKLCHString(input);
    } catch {
      results = [];
      target_oklch = '';
    }
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text);
  }

</script>

<svelte:head>
  <title>Tailwind CSS Color Matcher</title>
  <meta name="description" content="Find closest Tailwind colors to any input color using Euclidean distance in OKLCH space." />
    <meta property="og:title" content="Tailwind CSS Color Matcher" />
</svelte:head>

<main
  class="min-h-screen bg-slate-900 text-white flex flex-cols items-center gap-x-20 justify-center"
>
  <div class="space-y-4 w-80">
    <div>
      <h1 class="text-3xl font-bold mb-1">Tailwind Color Match</h1>
      <p class="text-sm text-stone-400 mb-6">Find closest Tailwind colors to any input color using Euclidean distance in OKLCH space.</p>
    </div>

    <input
      bind:value={input}
      placeholder="Input hex, RGB, HSL, or LAB color"
      class="w-full px-3 py-2 rounded text-black text-white border b-gray-200"
    />

    <button
      on:click={run}
      class="bg-emerald-600 hover:bg-emerald-700 p-2 rounded"
    >
      Convert
    </button>
  </div>

  <!-- Right column  -->
  <div class="flex flex-col space-y-2">
    <h1 class="text-2xl font-bold">Results</h1>

    <h2>Input Color:</h2>
    <!-- Block of input color -->
    <div
      class="w-20 h-20 border"
      style="background-color: {target_oklch};"
    ></div>

    <h2>Closest Results:</h2>
    {#each results as r}
      <div
        class="flex items-center gap-2 text-sm font-mono border-l-25 pl-2 pr-2 py-1 rounded group"
        style="
          border-left-color: oklch({r.color.l * 100}% {r.color.c} {r.color.h});
          background-color: oklch({r.color.l * 100}% {r.color.c} {r.color.h} / 0.10);
        "
      >
        <span class="flex-1">
          {r.name} — Δ {r.distance.toFixed(3)}
        </span>

        <button
          class="opacity-0 group-hover:opacity-100 transition text-xs px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700"
          on:click={() => copy(`${r.name}`)}
          title="Copy Tailwind class"
        >
          copy
        </button>
      </div>
    {/each}
  </div>
 </main>

<footer class="absolute bottom-0 w-full bg-slate-900 border-t border-white/10 mt-auto">
  <div class="max-w-6xl mx-auto px-6 py-4">
    <div class="flex flex-col items-center space-y-4">
      <!-- Main content -->
      <div class="text-center">
        <p class="text-white text-sm md:text-base mb-1">
          Created by
          <a
            href="https://danglorioso.com"
            target="_blank"
            rel="noopener noreferrer"
            class="text-white hover:text-yellow-200 font-medium transition-colors duration-300 underline decoration-white/60 hover:decoration-yellow-200 underline-offset-2"
          >
            Dan Glorioso
          </a>.
        </p>
        <p class="text-white/80 text-xs">
          © {new Date().getFullYear()} All rights reserved
        </p>
      </div>
    </div>
  </div>
</footer>
