<template>
  <div v-if="newsItem">
   <h2>{{ newsItem.title }}</h2>
   <img v-if="newsItem.imageUrl" :src="newsItem.imageUrl" alt="News Image" />
   <p v-html="newsItem.description"></p>
   <button @click="saveToPreferences">Save for Later</button>
   <router-link :to="{ path: `/news/${feedIndex}` }">Back to News List</router-link>
  </div>
  <div v-else>
   News item not found.
  </div>
  </template>
  
  <script>
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
       feeds:[]
   };
  },
  async created() {
     await this.loadNewsItem()
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
  
       }else{
           this.newsItem = null;
           return;
       }
       const feed = this.feeds[parseInt(this.feedIndex, 10)];
  
       if (!feed) {
         this.newsItem = null;
         return;
       }
       const newsItems = await this.fetchNews(feed.url)
     const index = parseInt(this.newsIndex, 10);
     if (isNaN(index) || index < 0 || index >= newsItems.length) {
       this.newsItem = null;
       return;
     }
     this.newsItem = newsItems[index];
       this.newsItem.feedUrl = feed.url
   },
     async fetchNews(url){
         try {
             const response = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
             if (!response.ok) {
                 throw new Error(`HTTP error! status: ${response.status}`);
             }
             const text = await response.text();
             const parser = new DOMParser();
             const xmlDoc = parser.parseFromString(text, "text/xml");
             const items = xmlDoc.querySelectorAll("item");
             const newsItems = [];
             items.forEach(item => {
                 const title = item.querySelector("title")?.textContent;
                 const link = item.querySelector("link")?.textContent;
                 let description = item.querySelector("description")?.textContent;
                 let imageUrl = null
  
                 if(description){
                     const doc = new DOMParser().parseFromString(description, "text/html");
                     const img = doc.querySelector('img');
                     if(img){
                         imageUrl = img.getAttribute('src');
                         img.remove();
                         description = doc.body.innerHTML
                     }
                 }

                 if(!imageUrl){
                     const enclosure = item.querySelector("enclosure");
                     if (enclosure) {
                         imageUrl = enclosure.getAttribute('url')
                     }
                 }
  
                 newsItems.push({
                     title,
                     link,
                     description,
                     imageUrl
                 });
             });
             return newsItems
  
         } catch (error) {
             console.error("Error parsing RSS feed:", error);
             throw error;
         }
     },
   saveToPreferences() {
       if(!this.newsItem) return
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
  img {
  max-width: 100%;
  height: auto;
  }
</style>