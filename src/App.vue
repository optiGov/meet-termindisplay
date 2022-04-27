<template>
  <HeaderVue />

  <main>
    <div class="container-fluid fixedList">
      <div class="row text-start p-4 border-bottom border-2">
        <div class="col-2"><strong>Aufruf</strong></div>
        <div class="col-3"><strong>Uhrzeit</strong></div>
        <div class="col-3"><strong>Dauer</strong></div>
        <div class="col-4"><strong>Raum</strong></div>
      </div>
      <div class="listGroup">
        <TermineList />
      </div>
    </div>
  </main>

  <div class="position-fixed bottom-0 end-0 m-4">
    <button
      type="button"
      class="btn btn-light"
      data-bs-toggle="modal"
      data-bs-target="#staticBackdrop"
    >
      <i class="fa-solid fa-gear"></i>
    </button>
  </div>

  <!-- Settings Modal -->
  <div
    class="modal fade"
    id="staticBackdrop"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="staticBackdropLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-fullscreen-sm-down">
      <div class="modal-content">
        <div class="modal-header bg-dark text-white">
          <h5 class="modal-title" id="staticBackdropLabel">Einstellungen</h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form>
            <div class="form-floating mb-3">
              <input
                type="text"
                class="form-control"
                id="floatingInput"
                placeholder="ID"
                v-model="vid"
              />
              <label for="floatingInput">Verwaltungs-ID</label>
            </div>
            <div class="form-floating mb-3">
              <input
                type="text"
                class="form-control"
                id="floatingInput"
                placeholder="Eingang"
                v-model="titel"
              />
              <label for="floatingInput">Titel des Displays</label>
            </div>

            <div class="form-floating mb-3">
              <input
                type="text"
                class="form-control"
                id="floatingInput"
                placeholder="https://"
                v-model="url"
              />
              <label for="floatingInput">URL-API-Schnittstelle</label>
            </div>

            <div class="form-floating">
              <select
                class="form-select"
                id="floatingSelect"
                aria-label="Floating label select example"
                v-model="number"
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
              </select>
              <label for="floatingSelect">Anzahl an Termine</label>
            </div>
            <br />
            <label for="exampleColorInput" class="form-label text-start"
              >Theme-Farbe auswählen</label
            >
            <input
              type="color"
              class="form-control form-control-color w-100"
              id="exampleColorInput"
              value="#ffc107"
              title="Wähle eine Farbe aus"
            />
            <br />
            <select
              class="form-select"
              multiple
              aria-label="multiple select example"
              v-model="staff"
            >
              <option>Auswahl der Mitarbeiter</option>
              <option v-for="item in mitarbeiter" :key="item.mitarbeiter.id">
                {{ item.mitarbeiter.vorname }} {{ item.mitarbeiter.nachname }}
              </option>
            </select>
            <br />
            <p>
              <button type="button" class="btn btn-light w-100">
                <i class="fa-solid fa-chevrons-right"></i> OptiGov Anmeldung
              </button>
            </p>
          </form>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-dark btn-lg w-100"
            data-bs-dismiss="modal"
            @click="storeSettings()"
          >
            Speichern
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Store from "./store";
import "bootstrap/dist/js/bootstrap.min.js";
import TermineList from "./components/TermineList.vue";
import HeaderVue from "./components/HeaderVue.vue";

//const formTitel = localStorage.setItem('titel', "Titel eingeben");
/*const formUrl = localStorage.setItem(
  "optigov",
  "https://backend.optigov.de/core/api"
);*/

export default {
  name: "App",
  data() {
    return {
      termin: [],
      mitarbeiter: [],
      url: localStorage.getItem("url"),
      titel: localStorage.getItem("titel"),
      staff: [],
      vid: localStorage.getItem("vid"),
      number: localStorage.getItem("number"),
      color: localStorage.getItem("color"),
    };
  },
  components: {
    TermineList,
    HeaderVue,
  },
  computed: {
    getVid() {
      return Store.getters.getVid();
    },
    getTitel() {
      return Store.getters.getTitel();
    },
    getUrl() {
      return Store.getters.getUrl();
    },
    getNumber() {
      return Store.getters.getNumber();
    },
     getColor() {
      return Store.getters.getColor();
    },
  },
  methods: {
    storeSettings() {
      Store.mutations.setVid(this.vid);
      Store.mutations.setTitel(this.titel);
      Store.mutations.setUrl(this.url);
      Store.mutations.setNumber(this.number);
       Store.mutations.setColor(this.color);
      this.error = false;
    },
  },

  async mounted() {
    try {
      this.mitarbeiter = [];
      var result = await axios({
        method: "POST",
        url: this.getUrl,
        data: {
          query: `
                            {
alleTerminvereinbarungen {
   id
   termin
   status
   mitarbeiter {
     id
     vorname
     nachname
   }
 }
} `,
        },
      });
      this.mitarbeiter = result.data.data.alleTerminvereinbarungen;
      //console.log(result);
      //console.log(this.termin);
    } catch (error) {
      //console.error(error);
    }
  },
};
</script>

<style>
@import "~bootstrap/dist/css/bootstrap.min.css";
@import "~@fortawesome/fontawesome-free/css/all.min.css";

@font-face {
  font-family: "gotoMEDIA";
  src: url("assets/webfonts/gotoMEDIA/gotoMEDIA.eot?5fw36d");
  src: url("assets/webfonts/gotoMEDIA/gotoMEDIA.eot?#iefix5fw36d")
      format("embedded-opentype"),
    url("assets/webfonts/gotoMEDIA/gotoMEDIA.woff?5fw36d") format("woff"),
    url("assets/webfonts/gotoMEDIA/gotoMEDIA.ttf?5fw36d") format("truetype"),
    url("assets/webfonts/gotoMEDIA/gotoMEDIA.svg") format("svg");
  font-weight: normal;
  font-style: normal;
}

#app {
  font-family: "gotoMEDIA", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #000;
}

.navbar-brand h1 {
  font-weight: 600 !important;
  font-stretch: expanded;
}

ul.list-group.list-group-striped li:nth-of-type(odd) {
  background: #f8f9fa;
}
ul.list-group.list-group-striped li:nth-of-type(even) {
  background: #fff;
}

/* width */
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #fff;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #fff;
}

.fixedList {
  height: 100%;
  width: 100%;
  position: fixed;
  left: 0;
  right: 0;
  top: 124px;
}

.listGroup {
  overflow-x: hidden;
  overflow-y: hidden;
  height: 100%;
  width: 100%;
  position: fixed;
  top: 197px;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0;
}
</style>
