<template>
  <img class="binpic" src="../images/bins.png" alt="bins pic" />
  <div class="userLogin">
    <template v-if="!userLoggedIn">
      <h2 style="text-align: center">Login / Sign Up</h2>

      <p style="text-align: left">
        Email: &nbsp; &nbsp; &nbsp; &nbsp;
        <input
          v-model.trim="email"
          type="text"
          class="inputBox"
          placeholder="example@email.com"
        />
        <br />
        Password: &nbsp;
        <input
          v-model.trim="password"
          type="password"
          class="inputBox"
          placeholder="password"
        />
        <template v-if="password && password.length < 6" style="color: red">
          <br />Your password must be at least 6 characters
        </template>
      </p>

      <button class="social-button" @click="createUser">Create User</button>
      <br />
      <button class="social-button" @click="login">Login</button>
      <br />
      <br />
      or
      <br />
      <br />
      <button
        class="social-button"
        style="background-color: rgb(226, 226, 226)"
        @click="socialLogin"
      >
        <img alt="Google Logo" src="../assets/google-logo4.png" />
        &nbsp; &nbsp; Sign in with Google
      </button>
      <br />
      <br />

      <template v-if="userNotFound"> <br />User not found </template>
      <template v-if="invalidPassword"> <br />Invalid password </template>

      <!-- <p>
        <button class="social-button" @click="socialLogin">
          <img alt="Google Logo" src="../assets/google-logo4.png">
        </button>
      </p> -->
    </template>
    <template v-else>
      You are already signed in.
      <br />
      <br />
      <button class="trashButtons" @click="signOut">Sign Out</button>
    </template>
  </div>
</template>

<script>
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

const auth = getAuth();

export default {
  data() {
    return {
      email: null,
      password: null,
      userNotFound: false,
      invalidPassword: false,
      userLoggedIn: false,
    };
  },
  mounted() {
    const user = auth.currentUser;
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.userLoggedIn = true;
      } else {
        this.userLoggedIn = false;
      }
    });
  },
  methods: {
    async login() {
      try {
        this.userNotFound = false;
        this.invalidPassword = false;

        await signInWithEmailAndPassword(auth, this.email, this.password);
        this.userLoggedIn = true;
        this.$router.replace("/UserAuth");
      } catch (err) {
        if (err.code === "auth/wrong-password") {
          this.invalidPassword = true;
        } else if (err.code === "auth/user-not-found") {
          this.userNotFound = true;
        }
      }
    },
    async createUser() {
      try {
        this.userNotFound = false;
        this.invalidPassword = false;

        await createUserWithEmailAndPassword(auth, this.email, this.password);
        this.userLoggedIn = true;
        this.$router.replace("/UserAuth"); // Navigate to the sign-out page
      } catch (err) {
        console.error("Error in createUser", err);
      }
    },
    async signOut() {
      try {
        await signOut(auth);
        this.userLoggedIn = false;
      } catch (err) {
        console.error("Error in signOut", err);
      }
    },
    async socialLogin() {
      const provider = new GoogleAuthProvider();
      try {
        const result = await signInWithPopup(auth, provider);
        this.userLoggedIn = true;
        this.$router.replace("/UserAuth"); // Navigate to the sign-out page
      } catch (err) {
        console.error("Error in socialLogin", err);
      }
    },
  },
};
</script>

<style>
.userLogin {
  margin-top: 0%;
  width: 40%;
  min-height: 60%;
  padding: 3%;
  color: darkgray;
  position: absolute;
  /* background-image: url("../images/trashman.jpg"); 
    background-size: 100%;
    background-position-y: center;    */

  background-color: rgb(58, 58, 58);
  border-radius: 15%;
  box-shadow: 0 0 20px 5px rgba(15, 15, 15);
  /* border-width: 100%;
    border-style:solid;
    border-color:grey;
    border-bottom-width: 5%; */
}
.binpic {
  object-fit: fill;
  width: 100%;
  height: auto;
  opacity: 30%;
}
.social-button {
  background-color: #31c48d;
  color: black;
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  transition: background-color 0.3s ease;
  min-width: 180px;
  min-height: 30px;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 110%;
  margin-left: 2px;
  margin-right: 2px;
  margin-top: 2px;
  margin-bottom: 2px;
  max-width: 100%;
  width: 60%;
}
.social-button img {
  object-fit: contain;
  width: 7%;
  height: auto;
  text-align: left;
}
.inputBox {
  border-radius: 10px;
  box-shadow: 0 0 10px 2px rgba(15, 15, 15);
  border: 0;
}
</style>
