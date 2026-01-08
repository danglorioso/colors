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
</script>

<main
  class="min-h-screen bg-slate-900 text-white flex flex-cols items-center gap-x-20 justify-center"
>
  <div class="space-y-4 w-80">
    <h1 class="text-3xl font-bold">Tailwind Color Match</h1>
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
      <div class="text-sm text-emerald-400 font-mono border-l-40 pl-2"
      style="
        border-left-color: oklch(
          {r.color.l * 100}% 
          {r.color.c} 
          {r.color.h}
        );
      ">
        {r.name} — Δ {r.distance.toFixed(3)}
      </div>
    {/each}
  </div>
</main>
