<script>
  export let data = {
    spinner: {
      name: "",
      twitter: "",
      youtube: "",
      board: "",
    },
    profilePicture: "",
    youtubeUsername: "",
  };
  const spinner = data.spinner;
  var twitterAt = "No Twitter found";
  if (spinner.twitter != "") {
    twitterAt = "@" + spinner.twitter.split("/")[3];
  }
  const profilePicture = data.profilePicture;
  const youtubeUsername = data.youtubeUsername;
</script>

<main class="bg-background-dark grid place-items-center my-20 mx-10 md:m-32">
  <div
    class="text-white border-background-light rounded-md border-2 flex flex-col items-center justify-center w-9/12 md:w-fit px-8 md:px-24 pb-8 md:pb-12"
  >
    <img
      src={profilePicture}
      alt={spinner.name + "'s profile picture"}
      class="-translate-y-1/2 rounded-full w-20 md:w-28 h-20 md:h-28"
    />
    <div class="flex flex-col gap-6 md:gap-10 overflow-hidden">
      <h1 class="font-semibold text-xl md:text-2xl text-center">
        {spinner.name}
      </h1>
      <div
        class="flex flex-col items-start justify-center gap-3 md:gap-4 text-center w-full"
      >
        <span class="flex gap-2 md:gap-3 items-center justify-start">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 md:h-8 w-6 md:w-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
            />
          </svg>
          <p class="md:text-lg">{spinner.board}</p></span
        >
        <span class="flex gap-2 md:gap-3 items-center justify-start">
          <img
            src="/twitter.svg"
            alt="twitter logo"
            class="h-6 md:h-8 w-6 md:w-8 inline"
          />
          {#if spinner.twitter != ""}
            <a href={spinner.twitter} class="block md:text-lg">{twitterAt}</a>
          {:else}
            <p class="italic md:text-lg">{twitterAt}</p>
          {/if}
        </span>
        <span class="flex gap-2 md:gap-3 items-center justify-start">
          <img
            src="/youtube.svg"
            alt="youtube logo"
            class="h-6 md:h-8 w-6 md:w-8"
          />
          {#if spinner.youtube != ""}
            <a href={spinner.youtube} class="block md:text-lg"
              >{youtubeUsername}</a
            >
          {:else}
            <p class="italic md:text-lg">No YouTube found</p>
          {/if}
        </span>
      </div>
    </div>
  </div>
</main>
