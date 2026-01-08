<script lang="ts">
  import { findClosest } from "$lib/color/match";

  let input = $state("");
  let results = $state([]);

  function run() {
    try {
      results = findClosest(input, 5);
    } catch {
      results = [];
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

  <div class="flex flex-col space-y-2">
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
