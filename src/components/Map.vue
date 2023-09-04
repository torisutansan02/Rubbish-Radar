<template>
  <div id="map"></div>
</template>

<script>
import { db } from "../firebaseResources";
import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";

export default {
  data() {
    return {
      additionalInfo: "",
      location: null,
      locArray: [],
    };
  },
  mounted() {
    if (!window.google) {
      // const script = document.createElement('script');
      // script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBkkgbhppn40r-DjzpnkAg0q7waZKQzsr8&callback=initMap&map_ids=4af310b3e8d84ead';
      // document.body.appendChild(script);
      // script.onload = this.initMap;
    } else {
      //this.initMap();
    }
  },
  methods: {
    goToUserInputPage() {
      this.$router.push("/UserInput");
    },

    async getLocations() {
      try {
        const locCollection = collection(db, "locations");
        const locationDocs = await getDocs(locCollection);
        this.locArray = locationDocs.docs.map((doc) => doc.data().location);
      } catch (error) {
        console.error("Error getting location: ", error);
      }
    },
  },
};
</script>

<style scoped>
div #map {
  height: 92vh;
  width: 92vw;
  color: black;
  margin-top: 5%;
}
</style>
