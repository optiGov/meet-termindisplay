<template>
  <TransitionGroup
    name="list"
    tag="ul"
    class="list-group list-group-striped rounded-0"
  >
    <li
      class="list-group-item text-start p-5"
      v-for="item in sortedTermins"
      :key="item"
    >
      <div class="row">
        <div class="col-2">
          <h2 :style="{ 'font-size': getTextSize + 'rem' }">
            <span
              style="font-weight: 500; padding: 10px; border-radius: 5px"
              :style="{ color: getTextColor, background: getColor }"
              >T-0{{ item.id }}</span
            >
          </h2>
        </div>
        <div class="col-2">
          <h2 :style="{ 'font-size': getTextSize + 'rem' }">
            {{ changeDateFormat(item.termin) }} Uhr
            <!--{{ item.termin }}-->
          </h2>
        </div>
        <div class="col-2">
          <h2 :style="{ 'font-size': getTextSize + 'rem' }">
            {{ item.dauer }} min.
          </h2>
        </div>
        <div class="col-3">
          <h2 :style="{ 'font-size': getTextSize + 'rem' }" class="over">
            {{ item.mitarbeiter.raum }}
          </h2>
        </div>
        <div class="col-3">
          <h2 :style="{ 'font-size': getTextSize + 'rem' }" class="over">
            {{ item.dienstleistung.leistungsbezeichnung }}
          </h2>
        </div>
      </div>
    </li>
    <li
      v-if="!sortedTermins.length"
      class="p-5"
      :style="{ 'font-size': getTextSize + 'rem' }"
    >
      Keine bevorstehenden Termine
    </li>
  </TransitionGroup>
</template>

<script>
import Store from "../store";
import axios from "axios";
import moment from "moment";

export default {
  name: "TermineList",
  data() {
    return {
      termin: [],
      staff: localStorage.getItem("staff"),
      accessToken: localStorage.getItem("oauthAccessToken"),
      refreshToken: localStorage.getItem("oauthRefreshToken"),
      expireDate: localStorage.getItem("oauthExpireDate"),
      componentKey: 0,
      loggedIn: localStorage.getItem("loggedIn"),
    };
  },
  methods: {
    forceRerender() {
      this.componentKey += 1;
    },
    //Datum aus der Datenquelle anpassen und nur die Uhrzeit ausgeben
    changeDateFormat(value) {
      if (value) {
        return moment(String(value)).format("HH:mm");
      }
    },
    //Daten aus der API abholen und speichern
    async getData() {
      if (
        moment(new Date()).format("YYYY-MM-DD, HH:mm:ss") >=
        moment(this.expireDate).format("YYYY-MM-DD, HH:mm:ss")
      ) {
        //Wenn Token nicht gültig, dann neuen Token generieren
        Store.mutations.setLoggedIn("");

        // get tokens by oauth code
        const response = await axios.post(window.config.oauth.endpoints.token, {
          grant_type: "refresh_token",
          client_id: 6,
          refresh_token: this.refreshToken,
        }); //Ende Axios

        const accesstoken = response.data.access_token;
        const refreshtoken = response.data.refresh_token;
        const expiredate = moment(new Date())
          .add("60", "seconds")
          .format("YYYY-MM-DD, HH:mm:ss"); //Ablaufdatum setzen und speichern

        Store.mutations.setOAuthAccessToken(accesstoken);
        this.accessToken = accesstoken;
        Store.mutations.setOAuthRefreshToken(refreshtoken);
        this.refreshToken = refreshtoken;
        Store.mutations.setOAuthExpireDate(expiredate);
        this.expireDate = expiredate;
        
        this.forceRerender();
      } else {
        if (this.expireDate === "") {
          console.log("expireDate empty");
        } else {
          //Wenn Token noch gültig dann Daten abholen
          this.termin = [];
          var result = await axios({
            method: "POST",
            url: window.config.apiUrl,
            data: {
              query: `
            {
              alleTerminvereinbarungen {
                id
                termin
                dauer
                buerger_name
                buerger_email
                buerger_telefon
                notiz
                status
                dienstleistung {
                  id
                  leistungsbezeichnung
                }
                mitarbeiter {
                  id
                  vorname
                  nachname
                  name
                  gebaeude{
                    name
                    strasse
                    hausnummer
                    plz
                  }
                  raum
                }
              }
            }`,
            },
            headers: { Authorization: `Bearer ${this.accessToken}` },
          });
          this.termin = result.data.data.alleTerminvereinbarungen;
          Store.mutations.setLoggedIn("true");
        } //if empty
      } // if expired
    },
  },
  computed: {
    //Termine nach der Uhrzeit sortieren
    getStaff() {
      return Store.getters.getStaff();
    },
    sortedTermins() {
      //Prüfen ob Einträge vorhanden, wenn nicht dann
      if (this.termin === "") {
        return "Keine Einträge";
      } else {
        //Wenn Einträge vorhanden, diese holen, filtern und sortieren
        return (
          this.termin
            .filter((x) => {
              return (
                //ist das Datum des Termins = mit dem heutigen Datum?
                moment(new Date(x.termin)).format("YYYY-MM-DD") ===
                  moment(new Date()).format("YYYY-MM-DD") &&
                //Ist die Uhrzeit des Termins größer als die aktuelle Uhrzeit
                moment(new Date()).isBetween(
                  moment(new Date()).format("YYYY-MM-DD, HH:mm"),
                  moment(new Date(x.termin))
                    .add(x.dauer, "minutes")
                    .format("YYYY-MM-DD, HH:mm")
                ) &&
                x.status === "BESTAETIGT"
              );
            })
            .filter((el) => {
              //Nur die Termine von den ausgewählten Mitarbeitern ausgeben
              return this.getStaff.includes(el.mitarbeiter.id);
            })
            //Anzahl an Terminen anzeigen
            .slice(0, Store.getters.getNumber())
            //Daten sortiert nach Uhrzeit anzeigen
            .sort((a, b) => {
              return new Date(a.termin) - new Date(b.termin);
            })
        );
      }//Ende if empty
    },
    //Hintergrundfarbe auslesen
    getColor() {
      return Store.getters.getColor();
    },
    //Textfarbe auslesen
    getTextColor() {
      return Store.getters.getTextColor();
    },
    //Textgröße auslesen
    getTextSize() {
      return Store.getters.getTextSize();
    },
  },
  mounted() {
    //Daten zu Beginn abfragen
    this.getData();
  },
  created() {
    //Daten im Intervall alle 5 Minuten (= 300000 Milisekunden) abfragen
    setInterval(
      function () {
        this.getData();
        this.sortedTermins();
      }.bind(this),
      300000
    );
  },
};
</script>

<style scoped>
/* Transition Styles */
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease-in;
  opacity: 1;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
}

.list-leave-active {
  position: absolute;
}

.over {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 250px;
}
</style>
