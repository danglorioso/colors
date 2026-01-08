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
  class="min-h-screen bg-slate-900 text-white flex items-center justify-center"
>
  <div class="space-y-4 w-80">
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

    {#each results as r}
      <div class="text-sm text-emerald-400">
        {r.name} — Δ {r.distance.toFixed(3)}
      </div>
    {/each}
  </div>
</main>
