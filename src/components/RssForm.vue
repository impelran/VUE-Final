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
    </form>
  </template>
  
  <script>
  export default {
    name: 'RssForm',
    props: {
      feed: {
        type: Object,
        default: () => ({ title: '', url: '' }), // Default for adding
      },
      formTitle:{
          type:String,
          default:()=>"Add RSS Feed"
      }
    },
    emits: ['save'], // Emit an event when the form is successfully saved
    data() {
      return {
        title: this.feed.title,
        url: this.feed.url,
        errors: {
          title: '',
          url: '',
        },
      };
    },
    watch: {
      feed: {
        handler(newVal) {
            this.title = newVal.title;
            this.url = newVal.url
        },
        deep:true,
        immediate:true
      }
    },
    methods: {
      handleSubmit() {
        this.errors = { title: '', url: '' }; // Reset errors
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
          this.$emit('save', { title: this.title, url: this.url });
            this.title = ""
            this.url = ""
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .error {
    color: red;
    font-size: 0.8em;
  }
  form div{
      margin-bottom: 0.5rem;
  }
  </style>