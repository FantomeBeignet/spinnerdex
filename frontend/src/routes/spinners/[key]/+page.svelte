<script>
  export let data = {
    spinner: {
      name: "",
      twitter: "",
      youtube: "",
      board: "",
    },
    profilePicture: "",
  };
  const spinner = data.spinner;
  var twitterAt = "No Twitter found";
  if (spinner.twitter != "") {
    twitterAt = "@" + spinner.twitter.split("/")[3];
  }
  const profilePicture = data.profilePicture;
</script>

<main class="bg-background-dark grid place-items-center mt-20 mx-10">
  <div
    class="text-white border-background-light rounded-md border-2 flex flex-col items-center justify-center w-9/12 px-8 pb-8"
  >
    <img
      src={profilePicture}
      alt={spinner.name + "'s profile picture"}
      class="-translate-y-1/2 rounded-full w-20 h-20"
    />
    <div class="flex flex-col gap-6 overflow-hidden">
      <h1 class="font-semibold text-xl text-center">{spinner.name}</h1>
      <div
        class="flex flex-col items-start justify-center gap-2 text-center w-full overflow-hidden"
      >
        <p>{spinner.board}</p>
        <span class="flex gap-2 items-center justify-start">
          <img src="/twitter.svg" alt="twitter logo" class="h-6 w-6 inline" />
          {#if spinner.twitter != ""}
            <a href={spinner.twitter} class="block">{twitterAt}</a>
          {:else}
            <p>{twitterAt}</p>
          {/if}
        </span>
        <span class="flex gap-2 items-center justify-start">
          <img src="/youtube.svg" alt="youtube logo" class="h-6 w-6" />
          {#if spinner.youtube != ""}
            <a
              href={spinner.youtube}
              class="block text-ellipsis whitespace-nowrap overflow-hidden"
              >YouTube link</a
            >
          {:else}
            <p>No YouTube found</p>
          {/if}
        </span>
      </div>
    </div>
  </div>
</main>
