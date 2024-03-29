import { useEffect, useState } from "react";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  getIdToken,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import initializeAuth from "../Firebase/firebase.init";
import axios from "axios";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { addRole } from "../Redux/edubuddySlice";
import { reactLocalStorage } from "reactjs-localstorage";
initializeAuth();

const useFirebase = () => {
  const [user, setUser] = useState({});
  const [error, setError] = useState("");
  const [isLoading, setIsloading] = useState(true);
  const [admin, setAdmin] = useState(false);
  const [student, setStudent] = useState(false);
  const [teacher, setTeacher] = useState(false);
  const [role, setRole] = useState();
  const [data, setData] = useState([]);

  const dispatch = useDispatch();

  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";

  const [token, setToken] = useState("");
  const auth = getAuth();
  const googleProvider = new GoogleAuthProvider();

  const signInUsingGoogle = (navigate, location) => {
    setIsloading(true);
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const user = result?.user;
        saveOrReplaceUserToDb(
          user?.email,
          user?.displayName,
          user?.photoURL,
          navigate,
          location
        );
      })
      .catch((error) => {
        const errorMessage = error.message;
        setError(errorMessage);
      })
      .finally(() => setIsloading(false));
  };
  const resetPassword = (auth, email, navigate, location) => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Please Check Your Email Inbox",
          showConfirmButton: false,
          timer: 2000,
        }).then(function() {
          const destination = location?.state?.from || "/";
          navigate(destination);
        });
      })
      .catch((error) => {
        const errorMessage = error.message;
        Swal.fire({
          icon: "error",
          title: errorMessage,
          showConfirmButton: false,
          timer: 2000,
        });
        setError(errorMessage);
      })
      .finally(() => setIsloading(false));
  };

  const createNewUserUsingEmailPassword = (
    auth,
    email,
    password,
    displayName,
    navigate,
    location
  ) => {
    const URL = "https://teamssyaan.blob.core.windows.net/images/user.png";
    setIsloading(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then((res) => {
        sendEmailVerification(auth.currentUser);
        setUser(res.user);
        profileUpdate(displayName, URL);
        saveUserToDb(email, displayName, URL, navigate, location);
      })
      .catch((error) => {
        const errorMessage = error.message;
        Swal.fire({
          icon: "error",
          title: errorMessage,
          showConfirmButton: false,
          timer: 2000,
        });
        setError(errorMessage);
      })
      .finally(() => setIsloading(false));
  };

  const signInWithEmailPassword = (
    auth,
    email,
    password,
    navigate,
    location
  ) => {
    setIsloading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Login Successfull",
          showConfirmButton: false,
          timer: 2000,
        }).then(function() {
          const destination = location?.state?.from || "/";
          navigate(destination);
        });
      })

      .catch((error) => {
        const errorMessage = error.message;
        Swal.fire({
          icon: "error",
          title: errorMessage,
          showConfirmButton: false,
          timer: 2000,
        });
        setError(errorMessage);
      })
      .finally(() => setIsloading(false));
  };

  //update profile
  const profileUpdate = (name, URl) => {
    updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: URl,
    })
      .then(() => {})
      .catch((error) => {
        console.log(error);
      });
  };

  const saveUserToDb = (email, displayName, photoURL, navigate, location) => {
    const save = {
      email,
      displayName,
      photoURL,
    };
    axios
      .post(`https://research-backend-production.up.railway.app/signup`, save)
      .then(function(response) {
        Swal.fire({
          icon: "success",
          title: "Please Check Your Email Inbox to Verify New Account",
          showConfirmButton: true,
          timer: 3000,
        }).then(function() {
          const destination = location?.state?.from || "/login";
          navigate(destination);
        });
      })
      .catch(function(error) {
        Swal.fire({
          icon: "error",
          title: error,
          showConfirmButton: false,
          timer: 3000,
        });
        console.log(error);
      });
  };
  const saveOrReplaceUserToDb = (
    email,
    displayName,
    photoURL,
    navigate,
    location
  ) => {
    const save = { email, displayName, photoURL };
    axios
      .put(`https://research-backend-production.up.railway.app/login`, save)
      .then(function(response) {
        Swal.fire({
          icon: "success",
          title: "Login Successfull",
          showConfirmButton: false,
          timer: 2000,
        }).then(function() {
          const destination = location?.state?.from || "/";
          navigate(destination);
        });
      })
      .catch(function(error) {
        Swal.fire({
          icon: "error",
          title: error,
          showConfirmButton: false,
          timer: 2000,
        });
        console.log(error);
      });
  };

  const logOut = () => {
    signOut(auth)
      .then(() => {
        setUser({});
      })
      .catch((error) => {})
      .finally(() => setIsloading(false));
  };

  // is Admin
  useEffect(() => {
    setIsloading(true);
    const loadFUncion = async () => {
      await fetch(
        `https://research-backend-production.up.railway.app/getUserRole/${user.email}`
      )
        .then((res) => res.json())
        .then((data) => {
          setRole(data[0].role);
        })
        .finally(setIsloading(false));
    };
    loadFUncion();
  }, [user.email]);

  useEffect(() => {
    const unSubscribed = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setError("");
        getIdToken(user).then((idToken) => setToken(idToken));
      } else {
        setUser({});
      }
      setIsloading(false);
    });
    return () => unSubscribed;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);
  reactLocalStorage.setObject("user", user);
  const savedUser = reactLocalStorage.getObject("user");
  return {
    auth,
    user,
    error,
    signInUsingGoogle,
    createNewUserUsingEmailPassword,
    signInWithEmailPassword,
    logOut,
    isLoading,
    resetPassword,
    admin,
    student,
    teacher,
    token,
    role,
    savedUser,
  };
};

export default useFirebase;
