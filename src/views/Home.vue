<template>
  <img class="pollpic" src="../images/pollution.jpg" alt="pollution pic" />
  <img class="logo" src="../images/new_logo.png" alt="Rubbish_Radar_Logo_pic" />
  <div class="scrollButtonContainer">
    <button class="scrollButton" @click="scrollToMap">Go to Map</button>
  </div>

  <div ref="mapArea"></div>
  <Map></Map>
  <body>
    <div ref="userMap"></div>
    <UserInputMap></UserInputMap>
  </body>
</template>

<script>
import { auth } from "../firebaseResources";
import Map from "../components/Map.vue";
import { db } from "../firebaseResources";
import {
  collection,
  getFirestore,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  QuerySnapshot,
  updateDoc,
} from "firebase/firestore";
import UserInputMap from "../components/userInputMap.vue";
import { ref, toHandlers } from "vue";

export default {
  components: { Map, UserInputMap },
  data() {
    return {
      additionalInfo: "",
      location: null,
      locArray: [],
    };
  },
  async mounted() {
    const user = auth.currentUser;
    if (user) {
      this.userLoggedIn = true;
    }
    if (!window.google) {
      const script = document.createElement("script");
      script.src =
        "https://maps.googleapis.com/maps/api/js?key=AIzaSyA5myGcTPo74r9Wbuska9XYUaPcD47fsUQ&callback=initMap&map_ids=c843d678fb7a23f3";
      document.body.appendChild(script);
      script.onload = async () => {
        await this.getLocations();
        this.initMap();
      };
    } else {
      await this.getLocations();
      this.initMap();
    }
  },
  methods: {
    initMap() {
      const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 41, lng: -87 },
        zoom: 16,
        mapId: "c843d678fb7a23f3",
      });

      const infoWindow = new google.maps.InfoWindow({
        content: "",
        position: null,
        map,
      });

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent("Your Location");
            infoWindow.open(map);
            map.setCenter(pos);

            google.maps.event.addListener(map, "click", (mapsMouseEvent) => {
              infoWindow.close();
              infoWindow.setPosition(mapsMouseEvent.latLng);
              infoWindow.setContent(
                mapsMouseEvent.latLng.lat() +
                  ", " +
                  mapsMouseEvent.latLng.lng(),
              );
              infoWindow.open(map);
            });
          },
          () => {
            handleLocationError(true, infoWindow, map.getCenter());
          },
        );
      } else {
        handleLocationError(false, infoWindow, map.getCenter());
      }
      function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(
          browserHasGeolocation
            ? "Error: The Geolocation service failed."
            : "Error: Your browser doesn't support geolocation.",
        );
        infoWindow.open(map);
      }

      const collectionRef = collection(db, "locations");
      getDocs(collectionRef).then((querySnapshot) => {
        querySnapshot.forEach((document) => {
          const documentID = document.id;
          const docRef = doc(db, "locations", documentID);
          updateDoc(docRef, {
            id: documentID,
          });
        });
      });

      var iconBase = "http://maps.google.com/mapfiles/kml/paddle/";

      const icons = {
        Trash: {
          icon: iconBase + "blu-blank.png",
        },
        Recycle: {
          icon: iconBase + "grn-blank.png",
        },
        Combustible: {
          icon: iconBase + "pink-blank.png",
        },
      };

      for (let i = 0; i < this.locArray.length; i++) {
        let locationObj = this.locArray[i];
        let type = locationObj.location.type;
        let marker = new google.maps.Marker({
          position: new google.maps.LatLng(
            locationObj.location.latitude,
            locationObj.location.longitude,
          ),
          icon: icons[type].icon,
          map: map,
        });

        let locationVar = locationObj.location.info;
        let latCoor = locationObj.location.latitude;
        let longCoor = locationObj.location.longitude;
        let upvoteVar = locationObj.location.upvoteCount;
        let downvoteVar = locationObj.location.downvoteCount;

        google.maps.event.addListener(marker, "click", () => {
          infoWindow.setContent(`
              <div>${locationVar}</div>
              <div>${type}</div>
              <div>Upvotes: ${upvoteVar}</div>
              <div>Downvotes: ${downvoteVar}</div>
              <a href="https://google.com/maps/place/${latCoor},${longCoor}", target = "_blank"> View on Google Maps </a>
              ${
                this.userLoggedIn
                  ? `
              <button id="upvoteButton" class="trashButtons">Upvote</button>
              <button id="downvoteButton" class="trashButtons">Downvote</button> `
                  : ""
              }
            `);

          infoWindow.open(map, marker);
          google.maps.event.addListenerOnce(infoWindow, "domready", () => {
            document
              .getElementById("upvoteButton")
              .addEventListener("click", () => {
                this.upvote(locationObj.id);
              });
            document
              .getElementById("downvoteButton")
              .addEventListener("click", () => {
                this.downvote(locationObj.id);
              });
          });
        });
      }
    },
    async getLocations() {
      try {
        const locCollection = collection(db, "locations");
        const locationDocs = await getDocs(locCollection);
        locationDocs.forEach((doc) => {
          this.locArray = [...this.locArray, doc.data()];
        });
      } catch (error) {
        console.error("Error getting location: ", error);
      }
    },
    async upvote(docID) {
      if (this.userLoggedIn) {
        try {
          const currUser = auth.currentUser;
          const docRef = doc(db, "locations", docID);
          const docSnap = await getDoc(docRef);
          if (!docSnap.data().location.userUpvotes.includes(currUser.uid)) {
            const currentData = docSnap.data();
            const updateUpvote = currentData.location.upvoteCount + 1;
            const updatedUserArr = [
              ...currentData.location.userUpvotes,
              currUser.uid,
            ];
            await updateDoc(docRef, {
              "location.upvoteCount": updateUpvote,
              "location.userUpvotes": updatedUserArr,
            });
            console.log("Upvoted");
          }
        } catch (error) {
          console.log("Error upvoting: ", error);
        }
      }
    },
    async downvote(docID) {
      if (this.userLoggedIn) {
        try {
          const currUser = auth.currentUser;
          const docRef = doc(db, "locations", docID);
          const docSnap = await getDoc(docRef);
          if (!docSnap.data().location.userDownvotes.includes(currUser.uid)) {
            const currData = docSnap.data();
            const updateDownvote = currData.location.downvoteCount + 1;
            const updatedUserArr = [
              ...currData.location.userDownvotes,
              currUser.uid,
            ];
            await updateDoc(docRef, {
              "location.downvoteCount": updateDownvote,
              "location.userDownvotes": updatedUserArr,
            });
            console.log("Downvoted");
          }
        } catch (error) {
          console.log("Error downvoting: ", error);
        }
      }
    },
    scrollToMap() {
      const element = this.$refs.mapArea;
      const top = element.offsetTop;
      window.scrollTo({
        top: top,
        behavior: "smooth",
      });
    },
    scrollToUserIn() {
      const element = this.$refs.userMap;
      const top = element.offsetTop;
      window.scrollTo({
        top: top,
        behavior: "smooth",
      });
    },
  },
};
</script>

<style>
@media (min-width: 1024px) {
}
</style>
