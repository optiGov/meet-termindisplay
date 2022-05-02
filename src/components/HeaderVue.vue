<template>
  <header>
    <nav
      class="navbar navbar-expand-lg fixed-top navbar-light border-bottom"
      :style="{ background: getColor }"
    >
      <div class="container-fluid">
        <a class="navbar-brand p-4"
          ><h1 :style="{ color: getTextColor }">{{ getTitel }}</h1></a
        >
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item"></li>
          </ul>
          <div class="d-flex p-4">
            <div id="clock">
              <div id="time">
                <h1 :style="{ color: getTextColor }">
                  {{ localDate }},
                  {{ localTime }}
                  Uhr
                </h1>
              </div>
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
  },
  beforeMount() {
    //Datum und Uhrzeit vor dem Mount ausgeben
    this.showLocaleTime();
    this.showLocaleDate();
  },
};
</script>

<style scoped></style>
