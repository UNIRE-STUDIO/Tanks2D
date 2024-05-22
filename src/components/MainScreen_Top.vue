<script>
  export default {
    methods: {
        goToPage(){
            window.location.href = "http://unire.su";
        }
    }
  }
</script>

<template>
    <div class="panel">
        <button class="btn-mini" @click="goToPage()">
            <svg width="35" height="36" viewBox="0 0 35 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.3125 29.3H12.9063V20H22.0938V29.3H26.6875V15.35L17.5 8.375L8.3125 15.35V29.3ZM5.25 32.4V13.8L17.5 4.5L29.75 13.8V32.4H19.0313V23.1H15.9688V32.4H5.25Z" fill="#161618"/>
            </svg>
        </button>
    </div>
</template>

<style scoped>
    .panel{
        display: flex;
    }
</style>