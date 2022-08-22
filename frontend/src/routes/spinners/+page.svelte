<script>
  /** @type {import('./$types').PageData} */
  export let data;
  let spinners = Object.values(data);
  let displayedSpinners = [...spinners];
  let currentSearch = "";
  let boards = ["Any board", ...new Set(spinners.map((s) => s.board))];
  let currentBoard = "Any board";
  $: displayedSpinners = spinners.filter((spinner) => {
    return (
      spinner.key.toLowerCase().includes(currentSearch.toLowerCase()) &&
      (spinner.board === currentBoard || currentBoard === "Any board")
    );
  });
</script>

<main class="grid place-items-center p-8 gap-y-6 md:gap-y-8">
  <h1 class="font-bold text-white text-2xl md:text-4xl">
    Search for spinners here
  </h1>
  <form
    class="flex flex-col md:flex-row items-center justify-center gap-4 w-8/12 md:w-1/2"
  >
    <input
      type="text"
      bind:value={currentSearch}
      placeholder="Search"
      class="border-2 border-background-light bg-background-light rounded-sm md:rounded p-3 text-white  focus:border-primary flex-grow md:text-lg"
    />
    <select
      bind:value={currentBoard}
      class="border-2 border-background-light bg-background-light rounded-sm md:rounded p-3 text-white w-36 md:text-lg md:w-40"
    >
      {#each boards as board}
        <option value={board}>{board}</option>
      {/each}
    </select>
  </form>
  <div class="border border-background-light w-full" />
  <div class="w-10/12 md:w-1/3">
    <ul class="flex flex-col gap-2">
      {#each displayedSpinners as spinner}
        <a
          href={"/spinners/" + spinner.key}
          class="text-white grid grid-cols-[48%_min-content_48%] border-2 rounded-sm md:rounded border-background-light py-3 px-5 hover:border-primary"
        >
          <span
            class="col-start-1 col-span-1 text-start overflow-hidden text-ellipsis md:text-xl"
            >{spinner.name}</span
          >
          <span class="col-start-2 col-span-1 text-center md:text-xl">-</span>
          <span class="col-start-3 col-span-1 text-end md:text-xl"
            >{spinner.board ?? "Unknown"}</span
          >
        </a>
      {/each}
    </ul>
  </div>
</main>
