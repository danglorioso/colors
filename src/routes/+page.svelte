<script lang="ts">
  import { findClosest } from "$lib/color/match";
  import { toOKLCHString } from "../lib/color/convert";

  let input = $state("#0f172a");
  import type { MatchResult } from "$lib/types";

  let results = $state<MatchResult[]>([]);
  let targetOklch = $state("oklch(13.1% 0.028 256)");
  let copied = $state<string | null>(null);
  let hasError = $state(false);

  function oklchCss(c: { l: number; c: number; h: number }) {
    return `oklch(${c.l * 100}% ${c.c} ${c.h})`;
  }

  // Sync color picker when input is a plain 6-digit hex
  let pickerValue = $derived(/^#[0-9a-f]{6}$/i.test(input) ? input : "#000000");

  function run(value: string) {
    const trimmed = value.trim();
    if (!trimmed) { results = []; targetOklch = ""; hasError = false; return; }
    try {
      results = findClosest(trimmed, 5);
      targetOklch = toOKLCHString(trimmed);
      hasError = false;
    } catch {
      results = [];
      targetOklch = "";
      hasError = true;
    }
  }

  let debounceTimer: ReturnType<typeof setTimeout>;

  function onTextInput(e: Event) {
    const val = (e.target as HTMLInputElement).value;
    input = val;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => run(val), 150);
  }

  function onColorPick(e: Event) {
    const val = (e.target as HTMLInputElement).value;
    input = val;
    run(val);
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text);
    copied = text;
    setTimeout(() => (copied = null), 1400);
  }

  run(input);
</script>

<svelte:head>
  <title>Tailwind Color Match</title>
  <meta name="description" content="Find the closest Tailwind CSS colors to any input color using perceptual ΔE* distance in OKLab space." />
</svelte:head>

<div class="min-h-screen bg-zinc-950 text-white flex flex-col">
  <main class="flex-1 flex flex-col items-center px-4 pt-16 pb-12">

    <!-- Header -->
    <div class="text-center mb-10">
      <h1 class="text-4xl font-bold tracking-tight mb-2">Tailwind Color Match</h1>
      <p class="text-zinc-500 text-sm">Perceptual ΔE* matching · OKLab space</p>
    </div>

    <!-- Input card -->
    <div class="w-full max-w-sm mb-10">

      <!-- Clickable color swatch -->
      <label class="block cursor-pointer relative mb-3 group" title="Click to open color picker">
        <div
          class="h-40 rounded-2xl ring-1 ring-white/8 transition-all duration-300 group-hover:ring-white/20 group-hover:shadow-2xl"
          style="background-color: {targetOklch || '#18181b'};"
        ></div>
        <input
          type="color"
          value={pickerValue}
          on:input={onColorPick}
          class="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
        />
        <span class="absolute bottom-3 right-3 text-[10px] text-white/30 group-hover:text-white/60 transition-colors font-mono bg-black/30 backdrop-blur-sm rounded px-1.5 py-0.5">
          click to pick
        </span>
      </label>

      <!-- Text input -->
      <div class="relative">
        <input
          type="text"
          value={input}
          on:input={onTextInput}
          placeholder="hex, rgb(), hsl(), oklch()…"
          spellcheck="false"
          class="w-full bg-zinc-900 border {hasError ? 'border-red-500/40 text-red-300' : 'border-zinc-800 text-white'} rounded-xl px-4 py-3 text-sm font-mono placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
        />
        {#if hasError}
          <span class="absolute right-3 top-1/2 -translate-y-1/2 text-red-400/70 text-[11px] font-mono pointer-events-none">
            invalid
          </span>
        {/if}
      </div>
    </div>

    <!-- Results -->
    {#if results.length > 0}
      <div class="w-full max-w-2xl">
        <p class="text-[10px] text-zinc-600 uppercase tracking-widest mb-3 font-semibold px-0.5">
          Closest matches
        </p>
        <div class="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {#each results as r, i (r.name)}
            <button
              on:click={() => copy(r.name)}
              class="group relative rounded-xl overflow-hidden text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              title="Copy {r.name}"
            >
              <!-- Swatch -->
              <div class="h-24 sm:h-20" style="background-color: {oklchCss(r.color)};"></div>

              <!-- Label -->
              <div class="bg-zinc-900 border border-zinc-800/60 border-t-0 rounded-b-xl px-2.5 py-2">
                <div class="font-mono text-[11px] font-medium text-zinc-200 leading-snug truncate">
                  {r.name}
                </div>
                <div class="font-mono text-[10px] text-zinc-500 mt-0.5">
                  Δ {r.distance.toFixed(3)}
                </div>
              </div>

              <!-- Hover: copy overlay -->
              <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 bg-black/50 backdrop-blur-[1px]">
                {#if copied === r.name}
                  <span class="text-[11px] font-semibold text-green-400 tracking-wide">✓ copied</span>
                {:else}
                  <span class="text-[11px] font-medium text-white/90 tracking-wide">copy name</span>
                {/if}
              </div>

              <!-- Best match badge -->
              {#if i === 0}
                <div class="absolute top-2 left-2 backdrop-blur-sm text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-md {r.color.l > 0.6 ? 'bg-black/20 text-black/60' : 'bg-white/10 text-white/70'}">
                  best
                </div>
              {/if}
            </button>
          {/each}
        </div>
      </div>
    {/if}

  </main>

  <!-- Footer -->
  <footer class="border-t border-zinc-900 py-5 text-center">
    <p class="text-zinc-600 text-xs">
      Created by
      <a
        href="https://danglorioso.com"
        target="_blank"
        rel="noopener noreferrer"
        class="text-zinc-400 hover:text-white transition-colors duration-200"
      >Dan Glorioso</a>
      · © {new Date().getFullYear()}
    </p>
  </footer>
</div>
