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
    };
  },
  methods: {
    //Datum aus der Datenquelle anpassen und nur die Uhrzeit ausgeben
    changeDateFormat(value) {
      if (value) {
        return moment(value).format("HH:MM");
      }
    },
    //Daten aus der API abholen und speichern
    async getData() {
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
      });
      this.termin = result.data.data.alleTerminvereinbarungen;
    },
  },
  computed: {
    //Termine nach der Uhrzeit sortieren
    getStaff() {
      return Store.getters.getStaff();
    },
    sortedTermins() {
      return (
        this.termin
          .filter((x) => {
            return (
              //ist das Datum des Termins = mit dem heutigen Datum?
              moment(new Date(x.termin)).format("YYYY-MM-DD") ===
              moment(new Date()).format("YYYY-MM-DD") &&
                //Ist die Uhrzeit des Termins größer als die aktuelle Uhrzeit
             moment(new Date()).isBetween(
                moment(new Date()).format("YYYY-MM-DD, HH:MM"), 
                moment(new Date(x.termin)).add(x.dauer, "minutes").format("YYYY-MM-DD, HH:MM")
              )
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
