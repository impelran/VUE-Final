<template>
  <form @submit.prevent="handleSubmit">
    <h2>{{ formTitle }}</h2>
    <div>
      <label for="title">Title:</label>
      <input type="text" id="title" v-model="title" required>
      <span v-if="errors.title" class="error">{{ errors.title }}</span>
    </div>
    <div>
      <label for="url">URL:</label>
      <input type="url" id="url" v-model="url" required>
      <span v-if="errors.url" class="error">{{ errors.url }}</span>
    </div>
    <button type="submit">Save</button>
    <button type="button" v-if="!isFeedSaved" @click="saveToFeedPreferences">Save to Feed Preferences</button>
      <button type="button" v-if="isFeedSaved" @click="removeFromFeedPreferences">Remove from Feed Preferences</button>  </form>
</template>

<script>
export default {
  name: 'RssForm',
  props: {
  },
  emits: ['save'],
  data() {
    return {
      title:  '',
      url: '',
      errors: {
        title: '',
        url: '',
      },
      savedFeedPreferences: [],
        feeds:[],
        formTitle: "Add RSS Feed",
    };
  },
  watch: {
    savedFeedPreferences:{
          handler(newVal) {
              localStorage.setItem('savedFeedPreferences', JSON.stringify(newVal));
          },
          deep:true,
    },
      '$route.query': {
          handler: 'loadFeedToEdit',
          immediate: true
      }
  },
    computed: {
        isFeedSaved() {
            if (!this.title || !this.url) return false;
             return this.savedFeedPreferences.some(item => item.title === this.title && item.url === this.url);
        }
    },
    created() {
      this.loadFeedPreferences();
      this.loadFeeds()
    },
  methods: {
      loadFeeds(){
          const savedFeeds = localStorage.getItem('rssFeeds');
          if (savedFeeds) {
              this.feeds = JSON.parse(savedFeeds);
          }
      },
      loadFeedPreferences(){
          const savedFeedsPref = localStorage.getItem('savedFeedPreferences');
          if (savedFeedsPref) {
              this.savedFeedPreferences = JSON.parse(savedFeedsPref);
          }
      },
      loadFeedToEdit() {
          const index = this.$route.query.index;
          if (index !== undefined) {
              const savedFeeds = localStorage.getItem('rssFeeds');
              if (savedFeeds) {
                  const feeds = JSON.parse(savedFeeds);
                  if (index >= 0 && index < feeds.length) {
                      this.title = feeds[index].title;
                      this.url = feeds[index].url;
                      this.formTitle = "Edit RSS Feed"
                  }
              }
          }else{
              this.formTitle = "Add RSS Feed"
              this.title = ""
              this.url = ""
          }
      },
    handleSubmit() {
        this.errors = { title: '', url: '' };
        let isValid = true;

        if (!this.title.trim()) {
            this.errors.title = 'Title is required.';
            isValid = false;
        }
        if (!this.url.trim()) {
            this.errors.url = 'URL is required.';
            isValid = false;
        } else {
            try {
                new URL(this.url)
            } catch (error) {
                this.errors.url = 'URL is invalid.';
                isValid = false;
            }
        }
        if (isValid) {
            const index = this.$route.query.index;
            if(index !== undefined){
                const objIndex = this.feeds.findIndex((obj => obj.title === this.feeds[index].title && obj.url === this.feeds[index].url));
                this.feeds[objIndex].title = this.title
                this.feeds[objIndex].url = this.url
                localStorage.setItem('rssFeeds', JSON.stringify(this.feeds));

            }else{
                this.addOrUpdateFeed({ title: this.title, url: this.url });
            }
            this.$router.push(`/`);
        }


    },
      addOrUpdateFeed(newFeed) {
          this.feeds.push(newFeed);
          localStorage.setItem('rssFeeds', JSON.stringify(this.feeds));
      },
      saveToFeedPreferences() {
          if (!this.title || !this.url) return;
          const isDuplicate = this.savedFeedPreferences.some(item => item.title === this.title && item.url === this.url);
          if(!isDuplicate){
              this.savedFeedPreferences.push({ title: this.title, url: this.url });
              alert('Feed saved to preferences!');
          } else {
              alert("Feed already saved to preferences")
          }
      },
      removeFromFeedPreferences(){
          if (!this.title || !this.url) return;
          this.savedFeedPreferences = this.savedFeedPreferences.filter(item => !(item.title === this.title && item.url === this.url));
          alert("Feed removed from preferences")
      }
  },
};
</script>