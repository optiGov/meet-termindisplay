<template>
  <HeaderVue />

  <main>
    <div class="container-fluid fixedList">
      <div class="row text-start p-4 border-bottom border-2">
        <div class="col-2" style="padding-left: 25px">
          <strong>Ihr Aufruf</strong>
        </div>
        <div class="col-2" style="padding-left: 20px">
          <strong>Uhrzeit</strong>
        </div>
        <div class="col-2" style="padding-left: 20px">
          <strong>Dauer</strong>
        </div>
        <div class="col-3" style="padding-left: 12px">
          <strong>Raum</strong>
        </div>
        <div class="col-3" style="padding-left: 5px">
          <strong>Dienstleistung</strong>
        </div>
      </div>
      <div class="listGroup">
        <TermineList :key="componentKey" />
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
        <div
          class="modal-header bg-optigov text-white"
          :style="{ background: getColor }"
        >
          <h5 class="modal-title" id="staticBackdropLabel"
          :style="{ color: getTextColor }">Einstellungen</h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form>
              <button
                type="button"
                class="btn btn-light btn-lg w-100 border"
                @click="authApp()"
                v-if="!loggedIn || !loggedIn.length"
              >
                OptiGov-Authentifizierung starten
              </button>
              <!-- <button
                type="button"
                class="btn bg-optigov text-white disabled w-100 border"
                v-if="loggedIn"
              >
                Erfolgreich authentifiziert
              </button>
            <strong>Auth-Status: {{ loggedIn }}</strong>-->

            <div v-if="loggedIn">
              <div class="form-floating mb-3">
                <input
                  type="text"
                  class="form-control"
                  id="floatingInput"
                  placeholder="ID"
                  v-model="vid"
                />
                <label for="floatingInput">ID der Verwaltung</label>
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

              <div class="form-floating">
                <select
                  class="form-select"
                  id="floatingSelect"
                  aria-label="Floating label select example"
                  v-model="number"
                >
                  <option v-for="index in 20" :key="index" v-bind:value="index">
                    {{ index }}
                  </option>
                </select>
                <label for="floatingSelect">Anzahl an Terminen</label>
              </div>
              <br />
              <div class="form-floating">
                <select
                  class="form-select"
                  id="floatingSelect"
                  aria-label="Floating label select example"
                  v-model="textSize"
                >
                  <option value="1.0">Stufe 1</option>
                  <option value="1.5">Stufe 2</option>
                  <option value="2.0">Stufe 3</option>
                  <option value="2.5">Stufe 4</option>
                </select>
                <label for="floatingSelect">Schriftgröße auswählen</label>
              </div>
              <br />
              <div class="row">
                <div class="col-md-6">
                  <label for="exampleColorInput" class="form-label float-start"
                    >Hintergrundfarbe auswählen</label
                  >
                  <input
                    type="color"
                    class="form-control form-control-color w-100"
                    id="exampleColorInput"
                    title="Wähle eine Hintergrundfarbe aus"
                    v-model="color"
                  />
                </div>
                <div class="col-md-6">
                  <label for="exampleColorInput" class="form-label float-start"
                    >Textfarbe auswählen</label
                  >
                  <input
                    type="color"
                    class="form-control form-control-color w-100"
                    id="exampleColorInput"
                    title="Wähle eine Textfarbe aus"
                    v-model="textColor"
                  />
                </div>
              </div>

              <br />
              <label for="ColorInput" class="form-label float-start"
                >Auswahl der Mitarbeiter
                <!--{{ staff }}--></label
              >
              <select
                class="form-select"
                multiple
                aria-label="multiple select example"
                v-model="staff"
              >
                <option
                  v-for="item in mitarbeiter"
                  :key="item.id"
                  v-bind:value="item.id"
                >
                  {{ item.anrede.name }} {{ item.vorname }} {{ item.nachname }}
                </option>
              </select>
            </div>
          </form>
        </div>
        <div class="modal-footer" v-if="loggedIn">
          <button
            type="button"
            class="btn bg-optigov btn-lg w-100 text-white"
            :style="{ color: getTextColor, background: getColor }"
            @click="storeSettings()"
            v-if="loggedIn"
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
import moment from "moment";
import "bootstrap/dist/js/bootstrap.min.js";
import TermineList from "./components/TermineList.vue";
import HeaderVue from "./components/HeaderVue.vue";
import Str from "./js/Utils/Str";
import Base64 from "./js/Utils/base64";
import SHA256 from "./js/Utils/SHA256";

export default {
  name: "App",
  data() {
    return {
      termin: [],
      mitarbeiter: JSON.parse(localStorage.getItem("mitarbeiter")),
      url: Store.getters.getUrl(),
      titel: Store.getters.getTitel(),
      staff: JSON.parse(localStorage.getItem("staff")),
      vid: Store.getters.getVid(),
      number: Store.getters.getNumber(),
      color: Store.getters.getColor(),
      textColor: Store.getters.getTextColor(),
      textSize: Store.getters.getTextSize(),
      componentKey: 0,
      accessToken: Store.getters.getOAuthAccessToken(),
      refreshToken: Store.getters.getOAuthRefreshToken(),
      loggedIn: Store.getters.getLoggedIn(),
    };
  },
  components: {
    TermineList,
    HeaderVue,
  },
  methods: {
    async getParams() {
      //Parameter aus der URL ermitteln
      const url = new URL(window.location.href);
      const params = new URLSearchParams(url.search);
      const getcode = params.get("code");
      const getstate = params.get("state");

      //Überprüfen ob ein Wert übergeben wurde
      if (getcode === "") {
        console.log("");
      } else {
        //Wenn ja weiter
        //Überprüfen ob die erlangten Daten zu den bisher gespeicherten passen
        const vglstate = Store.getters.getOAuthState();
        //Wenn die Daten passen dann POST-Request an die Token-URL senden
        // check if state is equal the stored state
        if (getstate === vglstate) {
          // destroy state
          Store.mutations.setOAuthState("");
          Store.mutations.setStaff("");
          this.termin = "";

          // load code verifier
          const codeVerifier = Store.getters.getOAuthCodeVerifier();

          // create redirect url
          const redirectUrl =
            location.protocol + "//" + location.host + location.pathname;

          // get tokens by oauth code
          const response = await axios.post(
            window.config.oauth.endpoints.token,
            {
              grant_type: "authorization_code",
              client_id: 6,
              redirect_uri: redirectUrl,
              code_verifier: codeVerifier,
              code: getcode,
            }
          ); //Ende Axios

          const accesstoken = response.data.access_token;
          const refreshtoken = response.data.refresh_token;
          const expiredate = moment(new Date())
            .add("60", "seconds")
            .format("YYYY-MM-DD, HH:mm:ss"); //Ablaufdatum setzen und speichern

          Store.mutations.setOAuthAccessToken(accesstoken);
          Store.mutations.setOAuthRefreshToken(refreshtoken);
          Store.mutations.setOAuthExpireDate(expiredate);
          Store.mutations.setLoggedIn("true");
          this.loggedIn = "true";
          this.getMa(this.vid);
          console.log(this.loggedIn);

          this.forceRerender();
        }
      } // Ende if empty
    },
    //Authentificationprocess on OptiGov
    async authApp() {
      /// generate state
      const statee = Str.random(40);
      Store.mutations.setOAuthState(statee);
      console.log(statee);

      // generate code verifier
      const codeVerifier = Str.random(128);
      Store.mutations.setOAuthCodeVerifier(codeVerifier);

      // create code challenge
      const codeChallenge = Base64.encode(await SHA256.hash(codeVerifier));

      // create redirect url
      const redirectUrl =
        location.protocol + "//" + location.host + location.pathname;

      // set url in body
      this.url =
        window.config.oauth.endpoints.authorize +
        "?client_id=" +
        6 + //Client ID
        "&redirect_uri=" +
        encodeURIComponent(redirectUrl) +
        "&response_type=code" +
        "&scope=" +
        encodeURIComponent("terminvereinbarung.readonly") +
        "&state=" +
        statee +
        "&code_challenge=" +
        codeChallenge +
        "&code_challenge_method=" +
        "S256";

      // redirect to url
      window.location.href = this.url;
    },
    //TerminList-Component aktualisieren
    forceRerender() {
      this.componentKey += 1;
    },
    //Daten aus dem Formular speichern
    storeSettings() {
      //Mitarbeiterdaten aktualisieren
      this.getMa(this.vid);
      //neue Daten abrufen
      this.getParams();
      //TerminList-Component neuladen
      this.forceRerender();
      //Daten speichern
      Store.mutations.setVid(this.vid);
      Store.mutations.setTitel(this.titel);
      Store.mutations.setUrl(this.url);
      Store.mutations.setNumber(this.number);
      Store.mutations.setColor(this.color);
      Store.mutations.setTextColor(this.textColor);
      Store.mutations.setTextSize(this.textSize);
      Store.mutations.setStaff(this.staff);
      this.error = false;
    },
    async getMa(str) {
      if (this.loggedIn) {
        try {
          this.mitarbeiter = [];
          var result = await axios({
            method: "POST",
            url: window.config.apiUrl,
            data: {
              query: `
              {
              verwaltung(id: ${str}) {
                id
                name
                mitarbeiter {
                  id
                  vorname
                  nachname
                  name
                  anrede {
                    id
                    name
                  }
                }
              }
            } `,
            },
            headers: { Authorization: `Bearer ${this.accessToken}` },
          });
          this.mitarbeiter = result.data.data.verwaltung.mitarbeiter;
          Store.mutations.setMitarbeiter(this.mitarbeiter);
          //console.log(result);
          //console.log(this.termin);
        } catch (error) {
          Store.mutations.setStaff("");
          //console.error(error);
        }
      }
    },
  },
  computed: {
    getColor() {
      return Store.getters.getColor();
    },
    getTextColor() {
      return Store.getters.getTextColor();
    },
  },
  mounted() {
    //Daten zu Beginn abfragen
    //if auth ok
    this.getMa(this.vid);
    this.getParams();
  },
};
</script>

<style>
@import "~bootstrap/dist/css/bootstrap.min.css";
@import "~@fortawesome/fontawesome-free/css/all.min.css";

@font-face {
  font-family: Rubik;
  font-style: normal;
  font-weight: 300;
  font-display: swap;
  src: url(assets/fonts/Rubik-Light.a511edd8.ttf);
  unicode-range: U+0900-097f, U+1cd0-1cf6, U+1cf8-1cf9, U+200c-200d, U+20a8,
    U+20b9, U+25cc, U+a830-a839, U+a8e0-a8fb;
}
@font-face {
  font-family: Rubik;
  font-style: normal;
  font-weight: 300;
  font-display: swap;
  src: url(assets/fonts/Rubik-Light.a511edd8.ttf);
  unicode-range: U+0100-024f, U+0259, U+1e??, U+2020, U+20a0-20ab, U+20ad-20cf,
    U+2113, U+2c60-2c7f, U+a720-a7ff;
}
@font-face {
  font-family: Rubik;
  font-style: normal;
  font-weight: 300;
  font-display: swap;
  src: url(assets/fonts/Rubik-Light.a511edd8.ttf);
  unicode-range: U+00??, U+0131, U+0152-0153, U+02bb-02bc, U+02c6, U+02da,
    U+02dc, U+2000-206f, U+2074, U+20ac, U+2122, U+2191, U+2193, U+2212, U+2215,
    U+feff, U+fffd;
}

@font-face {
  font-family: Rubik;
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(assets/fonts/Rubik-Regular.4b3f0681.ttf);
  unicode-range: U+0900-097f, U+1cd0-1cf6, U+1cf8-1cf9, U+200c-200d, U+20a8,
    U+20b9, U+25cc, U+a830-a839, U+a8e0-a8fb;
}
@font-face {
  font-family: Rubik;
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(assets/fonts/Rubik-Regular.4b3f0681.ttf);
  unicode-range: U+0100-024f, U+0259, U+1e??, U+2020, U+20a0-20ab, U+20ad-20cf,
    U+2113, U+2c60-2c7f, U+a720-a7ff;
}
@font-face {
  font-family: Rubik;
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(assets/fonts/Rubik-Regular.4b3f0681.ttf);
  unicode-range: U+00??, U+0131, U+0152-0153, U+02bb-02bc, U+02c6, U+02da,
    U+02dc, U+2000-206f, U+2074, U+20ac, U+2122, U+2191, U+2193, U+2212, U+2215,
    U+feff, U+fffd;
}

@font-face {
  font-family: Rubik;
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url(assets/fonts/Rubik-Medium.6fa3da85.ttf);
  unicode-range: U+0900-097f, U+1cd0-1cf6, U+1cf8-1cf9, U+200c-200d, U+20a8,
    U+20b9, U+25cc, U+a830-a839, U+a8e0-a8fb;
}
@font-face {
  font-family: Rubik;
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url(assets/fonts/Rubik-Medium.6fa3da85.ttf);
  unicode-range: U+0100-024f, U+0259, U+1e??, U+2020, U+20a0-20ab, U+20ad-20cf,
    U+2113, U+2c60-2c7f, U+a720-a7ff;
}
@font-face {
  font-family: Rubik;
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url(assets/fonts/Rubik-Medium.6fa3da85.ttf);
  unicode-range: U+00??, U+0131, U+0152-0153, U+02bb-02bc, U+02c6, U+02da,
    U+02dc, U+2000-206f, U+2074, U+20ac, U+2122, U+2191, U+2193, U+2212, U+2215,
    U+feff, U+fffd;
}

@font-face {
  font-family: Rubik;
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(assets/fonts/Rubik-SemiBold.a840e539.ttf);
  unicode-range: U+0900-097f, U+1cd0-1cf6, U+1cf8-1cf9, U+200c-200d, U+20a8,
    U+20b9, U+25cc, U+a830-a839, U+a8e0-a8fb;
}
@font-face {
  font-family: Rubik;
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(assets/fonts/Rubik-SemiBold.a840e539.ttf);
  unicode-range: U+0100-024f, U+0259, U+1e??, U+2020, U+20a0-20ab, U+20ad-20cf,
    U+2113, U+2c60-2c7f, U+a720-a7ff;
}
@font-face {
  font-family: Rubik;
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(assets/fonts/Rubik-SemiBold.a840e539.ttf);
  unicode-range: U+00??, U+0131, U+0152-0153, U+02bb-02bc, U+02c6, U+02da,
    U+02dc, U+2000-206f, U+2074, U+20ac, U+2122, U+2191, U+2193, U+2212, U+2215,
    U+feff, U+fffd;
}

@font-face {
  font-family: Rubik;
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(assets/fonts/Rubik-Bold.11598c28.ttf);
  unicode-range: U+0900-097f, U+1cd0-1cf6, U+1cf8-1cf9, U+200c-200d, U+20a8,
    U+20b9, U+25cc, U+a830-a839, U+a8e0-a8fb;
}
@font-face {
  font-family: Rubik;
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(assets/fonts/Rubik-Bold.11598c28.ttf);
  unicode-range: U+0100-024f, U+0259, U+1e??, U+2020, U+20a0-20ab, U+20ad-20cf,
    U+2113, U+2c60-2c7f, U+a720-a7ff;
}
@font-face {
  font-family: Rubik;
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(assets/fonts/Rubik-Bold.11598c28.ttf);
  unicode-range: U+00??, U+0131, U+0152-0153, U+02bb-02bc, U+02c6, U+02da,
    U+02dc, U+2000-206f, U+2074, U+20ac, U+2122, U+2191, U+2193, U+2212, U+2215,
    U+feff, U+fffd;
}

#app {
  font-family: Rubik, -apple-system, system-ui, BlinkMacSystemFont, Segoe UI,
    Roboto, Helvetica Neue, Arial, sans-serif;
  font-weight: 300;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #000;
}

strong {
  font-weight: 600;
}

h1 {
  font-weight: 500;
}

h2 {
  font-weight: 400;
}

.navbar-brand h1 {
  font-weight: 700 !important;
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

.bg-optigov {
  background: #506de2;
}
</style>
