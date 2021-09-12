<template>
  <section>
    <div class="flex">
      <div class="max-w-xs">
        <label for="wallet" class="block text-sm font-medium text-gray-700"
        >Тикер {{ ticker }}</label
        >
        <div class="mt-1 relative rounded-md shadow-md">
          <input
              v-on:keydown.enter="add()"
              v-model="ticker"
              type="text"
              name="wallet"
              id="wallet"
              class="
                  block
                  w-full
                  pr-10
                  border-gray-300
                  text-gray-900
                  focus:outline-none focus:ring-gray-500 focus:border-gray-500
                  sm:text-sm
                  rounded-md
                "
              placeholder="Например DOGE"
          />
        </div>
        <div
            class="flex bg-white shadow-md p-1 rounded-md shadow-md flex-wrap"
        >
              <span
                  v-for="(val, idx) in findelems(allowedTickers, ticker)"
                  :key="idx"
                  @click="ticker = val.Symbol"
                  class="
                  inline-flex
                  items-center
                  px-2
                  m-1
                  rounded-md
                  text-xs
                  font-medium
                  bg-gray-300
                  text-gray-800
                  cursor-pointer
                "
              >
                {{ val.Symbol }}
              </span>
        </div>
        <div v-if="showError" class="text-sm text-red-600">
          Такой тикер уже добавлен
        </div>
      </div>
    </div>
    <hr class="w-full border-t border-gray-600 my-4" />
    <button
        v-on:click="add()"
        type="button"
        class="
            my-4
            inline-flex
            items-center
            py-2
            px-4
            border border-transparent
            shadow-sm
            text-sm
            leading-4
            font-medium
            rounded-full
            text-white
            bg-gray-600
            hover:bg-gray-700
            transition-colors
            duration-300
            focus:outline-none
            focus:ring-2
            focus:ring-offset-2
            focus:ring-gray-500
          "
    >
      <!-- Heroicon name: solid/mail -->
      <svg
          class="-ml-0.5 mr-2 h-6 w-6"
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="#ffffff"
      >
        <path
            d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
        ></path>
      </svg>
      Добавить
    </button>
  </section>
</template>

<script>
import * as Api from "../api";

export default {
  name: "AddTicker",
  props:[],
  data (){
    return {
      allowedTickers: [],
      ticker: "BTC", //текст в поле для добавления
    }
  },
  methods:{
    add(){
      this.$emit('add-ticker',this);
    },
    /**
     * поиск в обект -  ищет значения в объекте возвращает вхождения но количество не больше @length
     * @date 2021-07-25
     * @param {any} from - обхект в котором производится поиск {a:{},b:{}...}
     * @param {any} text
     * @param {any} length=4
     * @returns {any}
     */
    findelems(from, text, length = 4) {
      if (text == "") {
        return [];
      }
      let i = 0;
      let res = [];
      //100 оцентное совпадение
      const val = Object.getOwnPropertyNames(from).find((key) => {
        return from[key].Symbol == text;
      });
      if (val) {
        i++;
        res.push(from[val]);
      }
      const arr = Object.getOwnPropertyNames(from).filter((key) => {
        if (from[key].Symbol?.indexOf(text) != -1) {
          i++;
        }
        return (
            from[key].Symbol?.indexOf(text) != -1 &&
            i <= length &&
            from[key] != from[val]
        );
      });
      arr.forEach((key) => {
        res.push(from[key]);
      });
      return res;
    },
  },
  created() {
    Api.loadData().then((f) => {
      this.allowedTickers = f;
      this.loading = false;
    });
  }
}
</script>

<style scoped>

</style>