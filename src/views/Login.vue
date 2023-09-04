<template>
  <!-- need at least 1 template or script to run -->
</template>
<!-- <template>
    <div id="login">
      <p>
        or Sign In with Google <br>
        <button class="social-button" @click="socialLogin" v-if="!isLoggedIn"> 
          <img alt="Google Logo" src="../assets/google-logo4.png">
        </button>
      </p>
    </div>
  </template>
  
  <script>
  import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
  
  export default {
    name: 'login',
    data() {
      return {
        email: '',
        password: '',
        isLoggedIn: false
      };
  <div id="login">
    <p>
      or Sign In with Google <br>
      <button class="social-button" @click="socialLogin" v-if="!isLoggedIn"> 
        <img alt="Google Logo" src="../assets/google-logo4.png">
      </button>
    </p>
  </div>
</template>

<script>
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export default {
  name: 'login',
  data() {
    return {
      email: '',
      password: '',
      isLoggedIn: false
    };
  },
  methods: {
    async login() {
      console.log('login passed');
      const auth = getAuth();
      try {
        const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password);
        this.isLoggedIn = true
        this.$router.replace('home');
      } catch (err) {
        alert('Error: ' + err.message);
      }
        const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password);
        this.isLoggedIn = true
        this.$router.replace('home');
    },
    methods: {
      async login() {
        console.log('login passed');
        const auth = getAuth();
        try {
          const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password);
          this.isLoggedIn = true
          this.$router.replace('home');
        } catch (err) {
          alert('Error: ' + err.message);
        }
      },
      async socialLogin() {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();
          const result = await signInWithPopup(auth, provider);
          this.$router.replace('home');
      },
    },
  };
  </script>
  
  <style scoped>
  .social-button {
    width: 50px;
    background: white;
    padding: 10px;
    border-radius: 50%;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,0.2);
    outline: 0;
    border: 0;
  }
  .social-button:active {
    box-shadow: 0 2px 4px 0 rgba(0,0,0,0.1);
  }
  .social-button img {
    width: 50%;
  }
  </style>
   -->
