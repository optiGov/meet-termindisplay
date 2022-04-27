<template>
  <header>
    <nav
      class="navbar navbar-expand-lg fixed-top navbar-light bg-light border-bottom"
      style="background: #ffc107 !important"
    >
      <div class="container-fluid">
        <a class="navbar-brand p-4"
          ><h1>{{ getTitel }}</h1></a
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
                <h1>
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
      tag.localDate = new Date().toLocaleDateString();
    },
  },
  computed: {
    //Titel aus dem Store holen
    getTitel() {
      //return localStorage.getItem("titel");
      return Store.getters.getTitel();
    },
    getColor() {
      //return localStorage.getItem("titel");
      return Store.getters.getColor();
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
