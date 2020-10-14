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

    <div class="cart">
      <p>Cart({{ cart }})</p>
    </div>

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
      cart: 0,
    }
  },

  methods: {
    addToCart() {
      this.cart += 1
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
})

var app = new Vue({
  el: '#app',
  data: {
    premium: true,
  },
})
