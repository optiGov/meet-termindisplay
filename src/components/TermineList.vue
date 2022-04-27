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
          <h2>
            <strong>T-0{{ item.id }}</strong>
          </h2>
        </div>
        <div class="col-3">
          <h2>{{ changeDateFormat(item.termin) }} Uhr</h2>
        </div>
        <div class="col-3">
          <h2>{{ item.dauer }} min.</h2>
        </div>
        <div class="col-4">
          <h2>{{ item.mitarbeiter.raum }}</h2>
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
      interval: undefined,
    };
  },
  methods: {
    //Datum aus der Datenquelle anpassen und nur die Uhrzeit ausgeben
    changeDateFormat(value) {
      if (value) {
        return moment(String(value)).format("hh:mm");
      }
    },
    //Daten aus der API abholen und speichern
    async getData() {
      this.termin = [];
      var result = await axios({
        method: "POST",
        url: this.getUrl,
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
     gebaeude{
       name
       strasse
       hausnummer
       plz
     }
     raum
   }
 }
}
                        `,
        },
      });
      this.termin = result.data.data.alleTerminvereinbarungen;
    },
  },
  computed: {
    //Termine nach der Uhrzeit sortieren
    sortedTermins() {
      return this.termin.slice(0, Store.getters.getNumber()).sort((a, b) => {
        return new Date(a.termin) - new Date(b.termin);
      });
    },
    //Url aus dem Store holen
    getUrl() {
      return Store.getters.getUrl();
    },
  },
  mounted() {
    //Daten zu Beginn abfragen
    this.getData();
  },
  created() {
    //Daten im Intervall alle 5 Minuten abfragen
    setInterval(
      function () {
        return this.getData();
      }.bind(this),
      50000
    );
  },

  //Daten aus der Datenquelle abfragen
  /*async mounted() {
    try {
      this.termin = [];
      var result = await axios({
        method: "POST",
        url: this.getUrl,
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
     gebaeude{
       name
       strasse
       hausnummer
       plz
     }
     raum
   }
 }
}
                        `,
        },
      });
      this.termin = result.data.data.alleTerminvereinbarungen;
      //console.log(result);
      //console.log(this.termin);
    } catch (error) {
      //console.error(error);
    }
  },*/
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
</style>
