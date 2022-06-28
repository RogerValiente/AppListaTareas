import {
    guardarTarea,
    db,
    obtenerTareas,
    editarTarea,
    actualizarTarea,
    eliminarTarea
} from './firebase.js'
import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/9.8.4/firebase-firestore.js";

const contenedorTareas = document.getElementById('tablaTareas')
const datos = document.getElementById('formulario');
let estadoEditar = false;
let id = '';

window.addEventListener('DOMContentLoaded', async () => {

    // Se obtienen los datos de firebase una sola vez
    const querySnapshot = await getDocs(collection(db, "ListaTareas"));

    obtenerTareas((querySnapshot) => {
        let tablaTarea = '';
        querySnapshot.forEach((doc) => {

            const datos = doc.data();

            tablaTarea += `
        <tr>
            <td>${doc.id.substr(0,2) + doc.id.replace(/[^0-9]+/g, "")}</td>
            <td>${datos.titulo}</td>
            <td>${datos.descripcion}</td>
            <td>${datos.responsable}</td>
            <td>${datos.estado}</td>
            <td>
                <a class="btn btn-primary btn-sm btnEditar" data-id="${doc.id}"><i class="bi bi-pencil-square"></i> Editar</a> |          
                <a class="btn btn-danger btn-sm btnEliminar" data-id="${doc.id}"><i class="bi bi-trash-fill"></i> Eliminar</a>
            </td>            
        </tr>
      `
        });
        contenedorTareas.innerHTML = tablaTarea;

        //Editar tarea
        const btnEditar = contenedorTareas.querySelectorAll('.btnEditar')
        
        btnEditar.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const doc = await editarTarea(e.target.dataset.id);
                const tarea = doc.data();

                datos['Texttitulo'].value = tarea.titulo;
                datos['TextDescripcion'].value = tarea.descripcion;
                datos['textResponsable'].value = tarea.responsable;
                datos['cboSelect'].value = tarea.estado;
                datos['btnGuardar'].innerText = 'Actualizar';

                estadoEditar = true;
                id = doc.id;                
            })
        })
        //Eliminar tarea
        const btnEliminar = contenedorTareas.querySelectorAll('.btnEliminar')
        btnEliminar.forEach(btn => {
            btn.addEventListener('click', (e) => {
                //Mensaje de confirmación
                Swal.fire({
                    title: 'Seguro de que desea eliminar la tarea?',
                    showCancelButton: true,
                    confirmButtonText: 'Confirmar',
                }).then((result) => {
                    if (result.isConfirmed) {
                        eliminarTarea(e.target.dataset.id);
                        Swal.fire('Eliminar!', 'La tarea fue eliminada con éxito', 'success')
                    }
                })
            })
        })
    })
})

//Validaciones de los campos
function Validaciones() {
    var resultado = true;

    if (datos['Texttitulo'].value === "") {
        swal.fire('Error de validación', 'Debe ingresar un titulo', 'error');
        resultado = false;
        return resultado;
    }

    if (datos['TextDescripcion'].value === "") {
        swal.fire('Error de validación', 'Debe ingresar una descripción', 'error');
        resultado = false;
        return resultado;
    }

    if (datos['textResponsable'].value === "") {
        swal.fire('Error de validación', 'Debe ingresar un responsable', 'error');
        resultado = false;
        return resultado;
    }

    if (datos['cboSelect'].value === "Seleccionar") {
        swal.fire('Error de validación', 'Debe seleccionar una opcion en la columna estado', 'error');
        resultado = false;
        return resultado;
    }

    return resultado;
}

//Para guardar o actualizar una tarea
datos.addEventListener('submit', (e) => {
    e.preventDefault();
    const titulo = datos['Texttitulo'];
    const descripcion = datos['TextDescripcion'];
    const responsable = datos['textResponsable'];
    const estado = datos['cboSelect'];

    //1. Validar los campos
    var _validacion = Validaciones();
    if (!_validacion) {
        return;
    }

    if (estadoEditar) {
        actualizarTarea(id, {
            titulo: titulo.value,
            descripcion: descripcion.value,
            responsable: responsable.value,
            estado: estado.value
        });       
        swal.fire('Actualizar', 'La tarea fue actualizada con éxito', 'success');
         estadoEditar = false;
    } else {
        guardarTarea(titulo.value, descripcion.value, responsable.value, estado.value);
        swal.fire('Guardar', 'La tarea fue creada con éxito', 'success');
    }

    //Limpiar los campos
    datos.reset();
    //Actualizo el nombre del boton
    datos['btnGuardar'].innerText = 'Guardar';
})