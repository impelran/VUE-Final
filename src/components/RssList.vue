<template>
  <div>
    <h2>RSS Feeds</h2>
    <ul>
      <li v-for="(feed, index) in feeds" :key="index">
        <span @click="showNews(index)" class="feed-link">{{ feed.title }}</span>
          <button @click="editFeed(index)">Edit</button>
        <button @click="deleteFeed(index)">Delete</button>
      </li>
    </ul>
      <div v-if="feeds.length === 0">No RSS feeds added yet.</div>
  </div>
</template>

<script>
import RssForm from './RssForm.vue';

export default {
  name: 'RssList',
  components: {
    RssForm,
  },
  data() {
    return {
      feeds: [],
      selectedFeed: { title: '', url: '' },
      formTitle:"Add Rss Feed"
    };
  },
  created() {
    const savedFeeds = localStorage.getItem('rssFeeds');
    if (savedFeeds) {
      this.feeds = JSON.parse(savedFeeds);
    }
  },
    watch:{
      feeds:{
          handler(newVal){
              localStorage.setItem('rssFeeds', JSON.stringify(newVal));
          },
          deep:true
      }
    },
  methods: {
    addOrUpdateFeed(newFeed) {
      if(this.selectedFeed.title !=="" && this.selectedFeed.url !==""){
          const objIndex = this.feeds.findIndex((obj => obj.title === this.selectedFeed.title && obj.url === this.selectedFeed.url));
          this.feeds[objIndex].title = newFeed.title
          this.feeds[objIndex].url = newFeed.url
          this.selectedFeed = { title: '', url: '' }
          this.formTitle = "Add Rss Feed"

      }else{
          this.feeds.push(newFeed);
      }
        this.$router.push(`/`);
    },
      editFeed(index){
          this.$router.push({ path: '/add-feed', query: { index } });
      },
      deleteFeed(index) {
          if (confirm('Are you sure you want to delete this feed?')) {
              this.feeds.splice(index, 1);
          }
      },
    showNews(index) {
      this.$router.push(`/news/${index}`);
    },
  },
};
</script>

<style scoped>
.feed-link {
  cursor: pointer;
  color: blue;
  text-decoration: underline;
}
ul{
    list-style: none;
    padding: 0;
}
li{
    display: flex;
    align-items: center;
    margin-bottom: 0.7rem;
    gap: 0.5rem;
}
</style>