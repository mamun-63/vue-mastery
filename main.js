// Global Channel- Event Bus
var eventBus = new Vue()

// Product components (Parent)
Vue.component('product', {
  props: {
    premium: {
      type: Boolean,
      required: true,
    },
  },

  template: `
  <div class="product">

    <div class="product-image">
      <img v-bind:src="image" alt="">
    </div>

    <div class="product-info">
      <h1>{{ title }}</h1>
      <p v-if="inStock">In Stock</p>
      <p v-else>Out of Stock</p>
      <p>User is premium: {{ premium }}<p>
      <p>Shipping: {{ shipping }}<p>

      <product-details :details="details"></product-details>

      <div v-for="(variant, index) in variants" :key="variant.variantId" class="color-box"
        :style="{ backgroundColor: variant.variantColor }" @mouseover="updateImage(index)">
      </div>

      <button v-on:click="addToCart" :disabled="!inStock" :class="{ disabledButton: !inStock }">Add to Cart</button>
      <button @click="removeFromCart">Remove from cart</button>
    </div>

    <product-tabs :reviews="reviews"></product-tabs>

  </div>
  `,

  data() {
    return {
      brand: 'Vue Mastery',
      product: 'Socks',
      selectedVariant: 0,
      details: ['80% cotton', '20% polyster', 'Gender-neutral'],
      variants: [
        {
          variantId: 2234,
          variantColor: 'green',
          variantImage: './assets/vmSocks-green-onWhite.jpg',
          variantQuantity: 10,
        },
        {
          variantId: 2235,
          variantColor: 'blue',
          variantImage: './assets/vmSocks-blue-onWhite.jpg',
          variantQuantity: 0,
        },
      ],
      reviews: [],
    }
  },

  methods: {
    addToCart() {
      this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
    },
    removeFromCart() {
      this.$emit(
        'remove-from-cart',
        this.variants[this.selectedVariant].variantId
      )
    },
    updateImage(index) {
      this.selectedVariant = index
      console.log(index)
    },
  },

  computed: {
    title() {
      return this.brand + ' ' + this.product
    },
    image() {
      return this.variants[this.selectedVariant].variantImage
    },
    inStock() {
      return this.variants[this.selectedVariant].variantQuantity
    },
    shipping() {
      if (this.premium) {
        return 'free'
      }
      return 2.99
    },
  },

  // life cycle hook, it runs as soon as component mounted to the DOM
  mounted() {
    eventBus.$on('review-submitted', productReview => {
      this.reviews.push(productReview)
    })
  },
})

//Create a new component for product-details with a prop of details.
Vue.component('product-details', {
  props: {
    details: {
      type: Array,
      required: true,
    },
  },

  template: `
    <ul>
      <li v-for="detail in details">{{ detail }}</li>
    </ul>
  `,
})

// product-review component
Vue.component('product-review', {
  template: `
    <form class="review-form" @submit.prevent="onSubmit">

    <p v-if="errors.length">
      <b>Please correct the following error(s):</b>
      <ul>
        <li v-for="error in errors">{{ error }}</li>
      </ul>
    </p>

      <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name">
      </p>
      <p>
        <label for="review">Review:</label>
        <textarea id="review" v-model="review"></textarea>
      </p>
      <p>
        <label for="rating">Rating:</label>
        <select id="rating" v-model.number="rating">
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
        </select>
      </p>

      <p>Would you recommend this product?</p>
      <label>
        Yes
        <input type="radio" value="Recommended" v-model="recommend"/>
      </label>
      <label>
        No
        <input type="radio" value="Not Recommended" v-model="recommend"/>
      </label>

      <p>
        <input type="submit" value="Submit">
      </p>

    </form>
  `,
  data() {
    return {
      name: null,
      review: null,
      rating: null,
      recommend: null,
      errors: [],
    }
  },
  methods: {
    onSubmit() {
      if (this.name && this.rating && this.review && this.recommend) {
        let productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating,
          recommend: this.recommend,
        }
        eventBus.$emit('review-submitted', productReview)
        this.name = null
        this.review = null
        this.rating = null
        this.recommend = null
      } else {
        if (!this.name) this.errors.push('Name required.')
        if (!this.review) this.errors.push('Review required.')
        if (!this.rating) this.errors.push('Rating required.')
        if (!this.recommend) this.errors.push('Recommendation required.')
      }
    },
  },
})

// product-tabs component
Vue.component('product-tabs', {
  props: {
    reviews: {
      type: Array,
      required: true,
    },
  },

  template: `
    <div>
      <span class="tab" 
            :class="{activeTab: selectedTab === tab}"
            v-for="(tab, index) in tabs" 
            :key="index"
            @click="selectedTab = tab">
        {{ tab }}
      </span>

      <div v-show="selectedTab === 'Reviews'">
        <p v-if="!reviews.length">There are no reviews yet.</p>
        <ul v-else>
          <li v-for="review in reviews">
            <p>{{ review.name }}</p>
            <p>Review: {{ review.rating }}</p>
            <p>{{ review.review }}</p>
            <p>{{ review.recommend }}</p>
          </li>
        </ul>
      </div>

      <product-review v-show="selectedTab === 'Make a Review'"></product-review>

    </div>
  `,
  data() {
    return {
      tabs: ['Reviews', 'Make a Review'],
      selectedTab: 'Reviews',
    }
  },
})

// Vue instance
var app = new Vue({
  el: '#app',
  data: {
    premium: true,
    cart: [],
  },
  methods: {
    updateCart(id) {
      this.cart.push(id)
    },
    removeItem(id) {
      this.cart.pop(id)
    },
  },
})
