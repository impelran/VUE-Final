<template>
    <div>
      <h2>Saved News</h2>
  
      <input type="text" v-model="searchTerm" placeholder="Search saved news..." />
  
      <div v-if="filteredNews.length === 0">No matching news found.</div>
      <div v-else>
        <div v-for="(newsItem, index) in filteredNews" :key="index" class="news-item">
          <h3><a :href="newsItem.link" target="_blank" rel="noopener noreferrer">{{ newsItem.title }}</a></h3>
          <img v-if="newsItem.imageUrl" :src="newsItem.imageUrl" alt="News Image" class="news-image" />
          <p v-html="newsItem.description"></p>
          <button @click="removeFromPreferences(index)">Remove</button>
        </div>
      </div>
  
        <h2>Saved Feeds</h2>
        <div v-if="savedFeedPreferences.length === 0">No feeds saved yet.</div>
        <div v-else>
            <ul>
                <li v-for="(feed, index) in savedFeedPreferences" :key="index">
                    <span>{{ feed.title }} ({{ feed.url }})</span>
                    <button @click="removeFromFeedPreferences(index)">Remove</button>
                </li>
            </ul>
        </div>
    </div>
</template>
  
<script>
  export default {
    name: 'Preferences',
    data() {
      return {
        savedNews: [],
          savedFeedPreferences:[],
        feeds:[],
        searchTerm: '',
      };
    },
    created() {
      this.loadPreferences();
      this.loadFeedPreferences()
    },
    watch:{
        savedNews: {
            handler(newVal) {
                localStorage.setItem('savedNews', JSON.stringify(newVal));
            },
            deep:true
        },
        savedFeedPreferences:{
            handler(newVal) {
                localStorage.setItem('savedFeedPreferences', JSON.stringify(newVal));
            },
            deep:true,
        }
    },
    computed: {
      filteredNews() {
        const term = this.searchTerm.toLowerCase().trim();
        if (!term) {
          return this.savedNews;
        }
  
        return this.savedNews.filter(newsItem => {
          const title = newsItem.title.toLowerCase();
          const descriptionText = newsItem.description
            ? this.stripHtml(newsItem.description).toLowerCase()
            : '';
          return title.includes(term) || descriptionText.includes(term);
        });
      },
  },
    methods: {
      loadPreferences() {
          const savedFeeds = localStorage.getItem('rssFeeds');
          if(savedFeeds){
              this.feeds = JSON.parse(savedFeeds)
          }
      },
        loadFeedPreferences(){
            const savedFeedsPref = localStorage.getItem('savedFeedPreferences');
            if (savedFeedsPref) {
                this.savedFeedPreferences = JSON.parse(savedFeedsPref);
            }
        },
      removeFromPreferences(index) {
        this.savedNews.splice(index, 1);
  
      },
      removeFromFeedPreferences(index){
          this.savedFeedPreferences.splice(index, 1)
      },
        stripHtml(html) {
            let doc = new DOMParser().parseFromString(html, 'text/html');
            return doc.body.textContent || "";
        }
    },
  };
</script>