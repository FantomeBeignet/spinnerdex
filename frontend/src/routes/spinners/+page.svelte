<script>
  /** @type {import('./$types').PageData} */
  export let data;
  let spinners = Object.values(data);
  let displayedSpinners = [...spinners];
  console.log(spinners);
  let currentSearch = "";
  $: displayedSpinners = spinners.filter((spinner) => {
    return spinner.key.toLowerCase().includes(currentSearch.toLowerCase());
  });
  $: console.log(currentSearch);
</script>

<main class="grid place-items-center p-8 gap-y-6">
  <h1 class="font-bold text-white text-2xl">Search for spinners here</h1>
  <form class="">
    <input
      type="text"
      bind:value={currentSearch}
      placeholder="Search"
      class="border-2 border-background-light bg-background-light rounded-sm p-3 text-white  focus:border-primary"
    />
  </form>
  <div class="border border-background-light w-full" />
  <div class="w-10/12">
    <ul class="flex flex-col gap-2">
      {#each displayedSpinners as spinner}
        <a
          href={"/spinners/" + spinner.key}
          class="text-white grid grid-cols-[48%_min-content_48%] border-2 rounded-sm border-background-light py-3 px-5 hover:border-primary"
        >
          <span
            class="col-start-1 col-span-1 text-start overflow-hidden text-ellipsis"
            >{spinner.name}</span
          >
          <span class="col-start-2 col-span-1 text-center">-</span>
          <span class="col-start-3 col-span-1 text-end"
            >{spinner.board ?? "Unknown"}</span
          >
        </a>
      {/each}
    </ul>
  </div>
</main>
