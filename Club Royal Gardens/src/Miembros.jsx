import { useState, useEffect } from 'react';
import './Miembros.css'
import Logo from './assets/Logo.png'
import { IoAddCircleOutline, IoTrashBinOutline, IoPencilOutline } from "react-icons/io5";
import { getMiembros, updateMiembro, deleteMiembro } from "./db/supabasefunctions.js";
import FormularioAgregar from './Components/FormularioAgregar.jsx';
import FormularioEditar from './Components/FormularioEditar.jsx';

function Miembros() {
  const [miembros, setMiembros] = useState([]); 
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formularioModo, setFormularioModo] = useState(''); // 'agregar' o 'editar'
  const [miembroAEditar, setMiembroAEditar] = useState(null);

  useEffect(() => {
    fetchMiembros();
  }, []);

  const fetchMiembros = async () => {
    try {
      const data = await getMiembros();
      setMiembros(data);
    } catch (error) {
      console.error('Error al obtener miembros:', error.message);
    }
  };


  const getMembresiaStyle = (membresia) => {
    switch (membresia.toLowerCase()) {
      case 'oro':
        return 'oro';
      case 'platino':
        return 'platino';
      case 'diamante':
        return 'diamante';
      default:
        return '';
    }
  };

  const handleDelete = (id) => {
      console.log(`Eliminar miembro con ID: ${id}`);
      deleteMiembro(id);
      fetchMiembros(); 
    };


 
    const handleAgregarMiembro = async (nuevoMiembro) => {
      try {
        await addMiembroWithProcedure(nuevoMiembro); // Usando el stored procedure
        fetchMiembros(); // Actualiza la lista de miembros
        setMostrarFormulario(false); // Cierra el formulario
      } catch (error) {
        console.error('Error al agregar miembro:', error.message);
      }
    };
    

  const handleEdit = (miembro) => {
    setMiembroAEditar(miembro);
    setFormularioModo('editar'); // Establecemos que el formulario es para editar
    setMostrarFormulario(true); // Mostramos el formulario
  };

  return (
    <>
      <div className='Main-container'> 
        <div className='top'>
          <div className='Logo'>
            <img src={Logo} />
          </div>
          <div className='title-club'>
            <h1>Club Royal Gardens</h1>
          </div>
        </div>  

        <div className='CRUD'>
          <div className='CRUD-TOP'>
            <div className='crud-top2'>
               <h1>Miembros Registrados</h1>
               <button className='add' onClick={() => {
                setFormularioModo('agregar'); 
                setMostrarFormulario(!mostrarFormulario);
              }}><IoAddCircleOutline className='add-icon'/>Agregar Miembro</button>
            </div>
          </div>
        
          <div className='CRUD-BOTTOM'>
            <div className='tabla'>
              <table className='miembros-table'>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Número</th>
                    <th>Cédula</th>
                    <th>Membresía</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {miembros.map((miembro) => (
                    <tr key={miembro.id}>
                      <td>{miembro.id}</td>
                      <td>{miembro.nombre}</td>
                      <td>{miembro.email}</td>
                      <td>{miembro.numero}</td>
                      <td>{miembro.cedula}</td>
                      <td> 
                        <div className={getMembresiaStyle(miembro.membresia)}>
                          {miembro.membresia}
                        </div>
                      </td>

                      <td className='acciones'> {/* Columna de botones */}
                        <button onClick={() => handleEdit(miembro)} className='edit-btn'>
                          <IoPencilOutline />
                        </button>
                        <button onClick={() => handleDelete(miembro.id)} className='delete-btn'>
                          <IoTrashBinOutline />
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
         {/* Mostrar el formulario de acuerdo con el modo */}
         {mostrarFormulario && formularioModo === 'editar' && miembroAEditar && (
        <FormularioEditar
          miembro={miembroAEditar}
          cerrarModal={() => setMostrarFormulario(false)}
        />
      )}

      {mostrarFormulario && formularioModo === 'agregar' && (
        <FormularioAgregar
          agregarMiembro={(miembro) => {
            handleAgregarMiembro(miembro);
            setMostrarFormulario(false);
          }}
        />
      )}
    </>
  )
}

export default Miembros
