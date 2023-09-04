<template>
  <!-- <img src="../images/rubbish-radar-high-resolution-color-logo.png" alt="Rubbish_Radar_Logo_pic" 
    style = "width: 100%; top: 35px; object-fit: none; height: 400px; position: absolute;"> -->
  <img class="pollpic" src="../images/pollution.jpg" alt="pollution pic" />
  <img class="logo" src="../images/new_logo.png" alt="Rubbish_Radar_Logo_pic" />
  <!-- <a href="#mapArea">Go to Map</a>  
    <a href="#userIn">Add to Map</a> -->
  <div class="scrollButtonContainer">
    <button class="scrollButton" @click="scrollToMap">Go to Map</button>
    <button class="scrollButton" @click="scrollToUserIn">Add to Map</button>
  </div>

  <div ref="mapArea"><!-- to scroll to the map area --></div>
  <Map></Map>
  <body>
    <UserInputMap></UserInputMap>
    <div ref="userIn" class="userInput">
      <!-- <h1 style="text-align: center;">Add Trash Can</h1> -->
      <h3 style="border-bottom: 0; text-align: center">
        Add trash from your location
      </h3>
      <br />
      <input v-model="additionalInfo" placeholder="Info About Location" />
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
        Add Combustable Bin
      </button>
      <br />
      <p v-if="location">
        Added at location: {{ location.latitude }}, {{ location.longitude }}
      </p>
    </div>
  </body>
</template>

<script>
import { FirebaseError } from "firebase/app";
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
        "https://maps.googleapis.com/maps/api/js?key=AIzaSyBkkgbhppn40r-DjzpnkAg0q7waZKQzsr8&callback=initMap&map_ids=4af310b3e8d84ead";
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
      // let mapOptions = {
      //   center: { lat: 41, lng: -87 },
      //   zoom: 16,
      //   mapId: "74db84a2f64c1375",
      // }
      const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 41, lng: -87 },
        zoom: 16,
        mapId: "4af310b3e8d84ead",
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
                  " / " +
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
              <p>${locationVar}</p>
              <p>${type}</p>
              <p>(${latCoor}, ${longCoor})</p>
              <p>Upvote Count: ${upvoteVar}</p>
              <p>Downvote Count: ${downvoteVar}</p>
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

      //let greenMarker = "Rubbish-Radar/RubbishRadar/blob/master/src/images/greenMarker.png";
      //let myLatLng = new google.maps.LatLng(35.7148, 139.7967);
      //let staticMarker = new google.maps.Marker({
      //  position: myLatLng,
      //  title : "trashbin by Sensoji",
      //  icon: greenMarker
      //});
      // google.maps.event.addListener(staticMarker, 'click', function(){
      //   infoWindow.setContent('<p> this.locArray[i].info </p>' + '<br>' + '<button @click="upvote">Upvote</button>'
      //     + '<button @click="downvote">Downvote</button>');

      //   infoWindow.open(map, this);
      // });

      // google.maps.event.trigger(staticMarker, 'click');

      //staticMarker.setMap(map);
    },
    async addTrashCan() {
      if ("geolocation" in navigator) {
        try {
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });

          this.location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            info: this.additionalInfo,
            type: "Trash",
            upvoteCount: 0,
            downvoteCount: 0,
            userUpvotes: [],
            userDownvotes: [],
          };
          const docReference = await addDoc(collection(db, "locations"), {
            location: this.location,
          });
          this.additionalInfo = "";
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
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            info: this.additionalInfo,
            type: "Recycle",
            upvoteCount: 0,
            downvoteCount: 0,
            userUpvotes: [],
            userDownvotes: [],
          };

          const docReference = await addDoc(collection(db, "locations"), {
            location: this.location,
          });
          this.additionalInfo = "";
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
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            info: this.additionalInfo,
            type: "Combustible",
            upvoteCount: 0,
            downvoteCount: 0,
            userUpvotes: [],
            userDownvotes: [],
          };

          const docReference = await addDoc(collection(db, "locations"), {
            location: this.location,
          });
          this.additionalInfo = "";
        } catch (error) {
          console.error("Error getting location: ", error);
        }
      } else {
        console.error("Location services not available in this browser");
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
      // if(this.userLoggedIn){
      //   try {
      //     const docRef = doc(db, "locations", docID);
      //     const docSnap = await getDoc(docRef);

      //     const currentData = docSnap.data();
      //     const updateDownvote = currentData.location.downvoteCount + 1;

      //     await updateDoc(docRef, {
      //       'location.downvoteCount': updateDownvote,
      //     });
      //     console.log("Downvoted");
      //     await this.getLocations();
      //   } catch (error){
      //     console.log("Error downvoting: ", error);
      //   }
      // }
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
      const element = this.$refs.userIn;
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
.pollpic {
  object-fit: fill;
  width: 100%;
  height: 850px;
  margin-top: -1%;
  opacity: 60%;
}
.logo {
  position: absolute;
  object-fit: contain;
  width: 55%;
  height: auto;
  position: absolute;
  top: 5%;
  /* box-shadow: 0 0 10px 2px rgba(15, 15, 15); */
}
.scrollButton {
  text-align: center;
  background-color: #b9b9b999;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  text-decoration: none;
  display: block;
  transition: background-color 0.3s ease;
  font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
    "Lucida Sans", Arial, sans-serif;
  font-size: 130%;
  font-weight: 120%;
  width: 150px;
  height: 40px;
  margin-left: 100px;
  margin-right: 100px;
  margin-top: -170px;
  margin-bottom: 2px;
  position: relative;
  /* padding: 5%; */
  z-index: 99;
  box-shadow: 0 0 20px 5px rgba(15, 15, 15);
}
.scrollButton:hover {
  background-color: #b9b9b9bc;
  transition: 0.5s;
}
.scrollButton::after {
  position: absolute;
  content: "";
  width: 100%;
  height: 5px;
  top: 90%;
  left: 0;
  transition: transform 0.5s;
  transform: scaleX(0);
  transform-origin: center;
  background-color: #31c48d;
  border-radius: 30px;
}
.scrollButton:hover::after {
  transform: scaleX(1);
  transform-origin: center;
}
.scrollButton:active {
  background-color: rgba(255, 255, 255, 0.253);
}
.scrollButtonContainer {
  display: flex;
}
</style>
