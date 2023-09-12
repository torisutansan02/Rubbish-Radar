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
    } else {
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
  height: 100vh;
  width: 100%;
  color: black;
}
</style>
