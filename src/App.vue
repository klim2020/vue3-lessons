<template>
  <div class="container mx-auto flex flex-col items-center bg-gray-100 p-4">
    <div
      v-if="loading"
      class="
        fixed
        w-100
        h-100
        opacity-80
        bg-purple-800
        inset-0
        z-50
        flex
        items-center
        justify-center
      "
    >
      <svg
        class="animate-spin -ml-1 mr-3 h-12 w-12 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
    <div class="container">
    <add-ticker @add-ticker="add"/>
      <div>
        <div>Filter: <input v-model="filter" v-on:keydown="page = 1" /></div>
        <button
          v-if="page > 1"
          @click="page = page - 1"
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
          Nazad
        </button>
        <button
          @click="page = page + 1"
          v-if="hasNextPage"
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
          Vpered
        </button>
      </div>
      <hr class="w-full border-t border-gray-600 my-4" />
      <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div
          @click="select(t)"
          :class="{
            'border-4': selected == t,
          }"
          v-for="t in filteredList"
          :key="t"
          class="
            bg-white
            overflow-hidden
            shadow
            rounded-lg
            border-purple-800 border-solid
            cursor-pointer
          "
        >
          <div class="px-4 py-5 sm:p-6 text-center">
            <dt class="text-sm font-medium text-gray-500 truncate">
              {{ t.name }} - USD
            </dt>
            <dd class="mt-1 text-3xl font-semibold text-gray-900">
              {{ t.price }}
            </dd>
          </div>
          <div class="w-full border-t border-gray-200"></div>
          <button
            @click.stop="handleDelete(t)"
            class="
              flex
              items-center
              justify-center
              font-medium
              w-full
              bg-gray-100
              px-4
              py-4
              sm:px-6
              text-md text-gray-500
              hover:text-gray-600 hover:bg-gray-200 hover:opacity-20
              transition-all
              focus:outline-none
            "
          >
            <svg
              class="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="#718096"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clip-rule="evenodd"
              ></path></svg
            >Удалить
          </button>
        </div>
      </dl>

    </div>
  </div>
</template>

<script>
//TODO Вынести график в отдельный компонент, добавить кнопку закрытть[X]
//7. x Наличие в состоянии зависимых данных.(5)
//2. при удалении остается подписка на загрузку с сервера[5]
//3. Количество запросов[5]
//4. Запросы напрямую внутри компонента [5]
//5. обработка ошибок api(5)
//6. x при удалении тикера не изменяется localstorage[4]
//10.localstorage и анонимные вкладки(4)
//1. x одинаковый код в watch [3]

//8.плохо выглядит график  если будет много цен(2)
//9.Магические строки и числа(url, 5сек залержки,ключи, количество на странице)[1]

//Параллельно,
// x График сломан если везде одинаковые значения
// x При удалении тикера остается выбор
import * as Api from "./api";
import AddTicker from "./components/AddTicker";


export default {
  name: "App",
  components: {AddTicker},
  data() {
    return {
      ticker: "BTC", //текст в поле для добавления
      filter: "", //текст в поле для фильтрации

      tickers: [],
      selected: false,
      graph: [],
      loading: true,
      showError: false,
      page: 1,
    };
  },
  computed: {
    pageStateOptions() {
      return {
        filter: this.filter,
        page: this.page,
      };
    },
    startIndex() {
      return (this.page - 1) * 6;
    },
    endIndex() {
      return this.page * 6;
    },
    hasNextPage() {
      return this.filteredTickers.length > this.endIndex;
    },
    filteredTickers() {
      return this.tickers.filter((f) => f.name.includes(this.filter));
    },
    //пагинация разбиение на блоки
    filteredList() {
      return this.filteredTickers.slice(this.startIndex, this.endIndex);
    },
    normalizegraph() {
      const min = Math.min(...this.graph);
      const max = Math.max(...this.graph);
      if (min === max) {
        return this.graph.map(() => 50);
      }
      return this.graph.map((price) => 5 + ((price - min) * 95) / (max - min));
    },
  },
  methods: {
    /**
     * Форматирует цену в зависимости от цены монеты
     * @date 2021-07-26
     * @param {any} price Цена монеты
     * @returns {any} Если больше 1 доллара, то округляет до 2-х знаков, если меньше, то до 2х ближайших знаков.
     */
    getPrice(price) {
      if (!price) {
        return "-";
      }
      if (price > 1) {
        return price.toFixed(2);
      } else {
        return price.toPrecision(2);
      }
    },

    //update tickers
    async updateTickers() {
      if (this.tickers.length == 0) {
        return;
      }

      const data = await Api.loadTicker(this.tickers.map((t) => t.name));

      this.tickers.forEach((ticker) => {
        const price = data[ticker.name.toUpperCase()];
        ticker.price = this.getPrice(1 / price);
        if (this.selected?.name == ticker.name.toUpperCase()) {
          this.graph.push(ticker.price);
        }
      });
    },
    add(that) {
      const newTicker = { name: that.ticker, price: "-" };
      const exists = this.tickers.find((t) => t.name == newTicker.name);
      if (exists) {
        this.showError = true;
        setInterval(() => {
          this.showError = false;
        }, 10000);
        return;
      }
      this.tickers = [...this.tickers, newTicker];
      localStorage.setItem("cryptonomicon-list", JSON.stringify(this.tickers));
      //this.updateTickers(newTicker.name);
      Api.subscribeToTickerUpdate(newTicker.name,()=>{})
      that.ticker = "";
      that.filter = "";
    },
    handleDelete(tickerToRemove) {
      this.tickers = this.tickers.filter((t) => t != tickerToRemove);
      if (this.selected?.name == tickerToRemove.name) {
        this.selected = false;
      }
    },
    select(ticker) {
      this.selected = ticker;
      this.graph = [];
    },

  },
  watch: {
    selected() {
      this.graph = [];
    },
    filteredList() {
      if (this.filteredList.length === 0 && this.page > 1) {
        this.page -= 1;
      }
    },
    //область для мониторинга изменения полей data
    filter() {
      this.page = 1;
    },
    pageStateOptions(v) {
      window.history.pushState(
        null,
        document.title,
        `${window.location.pathname}?filter=${v.filter}&page=${v.page}`
      );
    },
  },
  created() {
    //WSocket.init();
    const windowData = Object.fromEntries(
      new URL(window.location).searchParams.entries()
    );
    if (windowData.filter) {
      this.filter = windowData.filter;
    }
    if (windowData.page) {
      this.page = windowData.page;
    }

    const tickerdata = localStorage.getItem("cryptonomicon-list");
    if (tickerdata) {
      this.tickers = JSON.parse(tickerdata);
      setInterval(this.updateTickers, 10000);
    }
    this.loading = false;

  },
  mounted() {},
};
</script>
