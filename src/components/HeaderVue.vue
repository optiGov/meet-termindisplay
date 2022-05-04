<template>
  <header>
    <nav
      class="navbar navbar-expand-lg fixed-top navbar-light border-bottom"
      style="height: 120px"
      :style="{ background: getColor }"
    >
      <div class="container-fluid">
        <a class="navbar-brand p-4"
          ><h1
            :style="{ color: getTextColor, 'font-size': getTextSize + 'rem' }"
          >
            {{ getTitel }}
          </h1></a
        >

        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item"></li>
        </ul>
        <div class="d-flex p-4 d-none d-lg-block">
          <div id="clock">
            <div id="time">
              <h1
                :style="{
                  color: getTextColor,
                  'font-size': getTextSize + 'rem',
                }"
              >
                {{ localDate }},
                {{ localTime }}
                Uhr
              </h1>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import Store from "../store";

export default {
  name: "HeaderVue",
  data() {
    return {
      localTime: "",
      localDate: "",
      textSize: localStorage.getItem("textSize"),
    };
  },
  methods: {
    //Uhrzeit anzeigen
    showLocaleTime: function () {
      var time = this;
      setInterval(function () {
        time.localTime = new Date().toLocaleTimeString();
      }, 1000);
    },
    //Datum anzeigen
    showLocaleDate: function () {
      var tag = this;
      tag.localDate = new Date().toLocaleDateString("de-DE", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    },
  },
  computed: {
    //Titel, Hintergrund- und Textfarbe aus dem Store holen
    getTitel() {
      return Store.getters.getTitel();
    },
    getColor() {
      return Store.getters.getColor();
    },
    getTextColor() {
      return Store.getters.getTextColor();
    },
    getTextSize() {
      var size = Store.getters.getTextSize();
      var resu = parseInt(size) + 0.5;
      return resu;
    },
  },
  beforeMount() {
    //Datum und Uhrzeit vor dem Mount ausgeben
    this.showLocaleTime();
    this.showLocaleDate();
  },
};
</script>

<style scoped></style>
