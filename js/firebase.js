// Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-app.js";
  import { getFirestore, collection, addDoc, onSnapshot, deleteDoc, doc, getDoc, updateDoc} from "https://www.gstatic.com/firebasejs/9.8.4/firebase-firestore.js";
  //import { getDatabase, ref, child, get } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-database.js"

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyAZciEG2HrzkXfLMD0hR7iXGq8XeltWbJ4",
    authDomain: "applistatareas-d6f8c.firebaseapp.com",
    projectId: "applistatareas-d6f8c",
    storageBucket: "applistatareas-d6f8c.appspot.com",
    messagingSenderId: "156251003700",
    appId: "1:156251003700:web:493869a81795318cc82361"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  //Conexión a la base de datos
  const db = getFirestore();
  //Guardar tareas
  const guardarTarea = (titulo, descripcion, responsable, estado) => {
    //console.log(titulo, descripcion, responsable, completada)
    addDoc(collection(db, 'ListaTareas'),{titulo, descripcion, responsable, estado});
  };
  //Obtener todas las tareas
  const obtenerTareas = (callback) => {
    onSnapshot(collection(db, 'ListaTareas'), callback);
  }
  //Selecciona una tarea para editarla
  const editarTarea = (id) => getDoc(doc(db, `ListaTareas/${id}`));
  //Selecciona una tarea para eliminarla
  const eliminarTarea = (id) => deleteDoc(doc(db, `ListaTareas/${id}`));

  const actualizarTarea = (id, nuevaTarea) => updateDoc(doc(db, `ListaTareas/${id}`), nuevaTarea);

export {guardarTarea, db, obtenerTareas, editarTarea, actualizarTarea, eliminarTarea};






