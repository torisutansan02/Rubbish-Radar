<template>
  <div ref="userIn" class="userInput">
    <h1 style="text-align: center">Add Trash Can</h1>
    <h3 style="border-bottom: 0; text-align: center">
      Add trash from custom location
    </h3>
    <input v-model="additionalInfo" placeholder="Info About Location" />
    <input v-model="latit" placeholder="Latitude" />
    <input v-model="longit" placeholder="Longitude" />
    <br />
    <button id="leftButton" class="trashButtons" @click="addTrashCan">
      Add Trash Can
    </button>
    <!-- <p v-if="location">Trash can added at location: {{location.latitude}}, {{location.longitude}}</p> -->
    <button id="midButton" class="trashButtons" @click="addRecyclingBin">
      Add Recycling Bin
    </button>
    <!-- <p v-if="location">Recycling Bin added at location: {{location.latitude}}, {{location.longitude}}</p> -->
    <button id="rightButton" class="trashButtons" @click="addCombustible">
      Add Combustible Bin
    </button>
    <p v-if="location">
      Added at location: {{ location.latitude }}, {{ location.longitude }}
    </p>
  </div>
</template>

<script>
import { FirebaseError } from "firebase/app";
import Map from "../components/Map.vue";
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
  QuerySnapshot,
} from "firebase/firestore";
export default {
  components: { Map },
  data() {
    return {
      additionalInfo: "",
      location: null,
      locArray: [],
    };
  },
  methods: {
    async addCustom() {
      if ("geolocation" in navigator) {
        try {
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });

          this.location = {
            latitude: this.latit,
            longitude: this.longit,
            info: this.additionalInfo,
            type: this.binType,
            upvoteCount: 0,
            downvoteCount: 0,
          };

          const docReference = await addDoc(collection(db, "locations"), {
            location: this.location,
          });
          this.additionalInfo = "";
          this.latit = "";
          this.longit = "";
        } catch (error) {
          console.error("Error getting location: ", error);
        }
      } else {
        console.error("Location services not available in this browser");
      }
    },
    async addTrashCan() {
      if ("geolocation" in navigator) {
        try {
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });

          this.location = {
            latitude: this.latit,
            longitude: this.longit,
            info: this.additionalInfo,
            type: "Trash",
            upvoteCount: 0,
            downvoteCount: 0,
          };
          const docReference = await addDoc(collection(db, "locations"), {
            location: this.location,
          });
          this.additionalInfo = "";
          this.latit = "";
          this.longit = "";
        } catch (error) {
          console.error("Error getting location: ", error);
        }
      } else {
        console.error("Location services not available in this browser");
      }
    },
    async addRecyclingBin() {
      if ("geolocation" in navigator) {
        try {
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });

          this.location = {
            latitude: this.latit,
            longitude: this.longit,
            info: this.additionalInfo,
            type: "Recycle",
            upvoteCount: 0,
            downvoteCount: 0,
          };

          const docReference = await addDoc(collection(db, "locations"), {
            location: this.location,
          });
          this.additionalInfo = "";
          this.latit = "";
          this.longit = "";
        } catch (error) {
          console.error("Error getting location: ", error);
        }
      } else {
        console.error("Location services not available in this browser");
      }
    },
    async addCombustible() {
      if ("geolocation" in navigator) {
        try {
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });

          this.location = {
            latitude: this.latit,
            longitude: this.longit,
            info: this.additionalInfo,
            type: "Combustible",
            upvoteCount: 0,
            downvoteCount: 0,
          };

          const docReference = await addDoc(collection(db, "locations"), {
            location: this.location,
          });
          this.additionalInfo = "";
          this.latit = "";
          this.longit = "";
        } catch (error) {
          console.error("Error getting location: ", error);
        }
      } else {
        console.error("Location services not available in this browser");
      }
    },
  },
};
</script>
