<template>
  <div v-if="newsItem">
    <h2>{{ newsItem.title }}</h2>
    <img v-if="newsItem.imageUrl" :src="newsItem.imageUrl" alt="News Image" class="news-image" />
    <p v-html="newsItem.description"></p>
    <button @click="saveToPreferences">Save for Later</button>
    <router-link :to="{ path: `/news/${feedIndex}` }">Back to News List</router-link>
  </div>
  <div v-else>
    News item not found.
  </div>
</template>

<script>
import { parseRssFeed } from '../services/rssService';

export default {
  name: 'NewsDetail',
  props: {
    feedIndex: {
      type: [String, Number],
      required: true,
    },
    newsIndex: {
      type: [String, Number],
      required: true,
    },
  },
  data() {
    return {
      newsItem: null,
      feeds: []
    };
  },
  async created() {
    await this.loadNewsItem();
  },
  watch: {
    feedIndex: "loadNewsItem",
    newsIndex: "loadNewsItem"
  },
  methods: {
    async loadNewsItem() {
      const savedFeeds = localStorage.getItem('rssFeeds');
      if (savedFeeds) {
        this.feeds = JSON.parse(savedFeeds);
      } else {
        this.newsItem = null;
        return;
      }

      const feed = this.feeds[parseInt(this.feedIndex, 10)];

      if (!feed) {
        this.newsItem = null;
        return;
      }

      try {
          const newsItems = await parseRssFeed(feed.url);
          const index = parseInt(this.newsIndex, 10);
          if (isNaN(index) || index < 0 || index >= newsItems.length) {
              this.newsItem = null;
              return;
          }
        this.newsItem = newsItems[index];
        this.newsItem.feedUrl = feed.url;

      } catch (error) {
        console.error("Error loading news item:", error);
        this.newsItem = null;
      }
    },

    saveToPreferences() {
      if (!this.newsItem) return;
      let savedNews = JSON.parse(localStorage.getItem('savedNews') || '[]');
      const isDuplicate = savedNews.some(item => item.title === this.newsItem.title && item.link === this.newsItem.link);

      if (!isDuplicate) {
        savedNews.push(this.newsItem);
        localStorage.setItem('savedNews', JSON.stringify(savedNews));
        alert('News saved to preferences!');
      } else {
        alert('News already saved!');
      }
    },
  },
};
</script>

<style scoped>
.news-image {
  max-width: 100%;
  height: auto;
  margin-bottom: 10px;
  display: block;
}
</style>