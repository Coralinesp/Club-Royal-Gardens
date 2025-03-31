import { useState, useEffect } from 'react';
import '../FormularioAgregar.css'; // Asegúrate de importar el mismo archivo de estilos
import { IoAddCircleOutline } from "react-icons/io5";
import { updateMiembro } from '../db/supabasefunctions'; // Importa la función para actualizar

function FormularioEditar({ miembro, cerrarModal }) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [numero, setNumero] = useState('');
  const [cedula, setCedula] = useState('');
  const [membresia, setMembresia] = useState('');
  const [errorCedula, setErrorCedula] = useState('');

  // Se ejecuta cuando el componente se monta o cuando el miembro cambia
  useEffect(() => {
    if (miembro) {
      setNombre(miembro.nombre);
      setEmail(miembro.email);
      setNumero(miembro.numero);
      setCedula(miembro.cedula);
      setMembresia(miembro.membresia);
    }
  }, [miembro]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar la cédula antes de continuar
    const esCedulaValida = await validarCedula(cedula);
    if (!esCedulaValida) return; // Si la cédula no es válida, no continuar

    if (nombre && email && numero && cedula && membresia) {
      try {
        // Llamar a la función updateMiembro para actualizar en la base de datos
        await updateMiembro(miembro.id, { nombre, email, numero, cedula, membresia });
        alert("Miembro actualizado exitosamente");

        // Limpiar los campos
        cerrarModal(); // Cerrar el modal después de la actualización
      } catch (error) {
        alert("Hubo un error al actualizar el miembro: " + error.message);
      }
    } else {
      alert("Por favor, complete todos los campos.");
    }
  };

    // Función para validar la cédula usando la API
    const validarCedula = async (cedula) => {
      try {
        const response = await fetch(`https://api.digital.gob.do/v3/cedulas/${cedula}/validate`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
  
        if (!response.ok) {
          throw new Error('Error en la validación de la cédula');
        }
  
        const data = await response.json();
        if (!data.valid) {
          setErrorCedula('La cédula no es válida');
          return false;
        }
  
        setErrorCedula(''); // Limpiar cualquier error de cédula
        return true;
      } catch (err) {
        setErrorCedula('Hubo un problema al validar la cédula');
        return false;
      }
    };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button onClick={() => cerrarModal()} className="close-btn">X</button>
        <div className='addform-top'>
          <h2>Editar Miembro</h2>
          <p>Modifique los datos del miembro.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label>Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Número</label>
            <input
              type="text"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Cédula</label>
            <input
              type="text"
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
              required
            />
            {errorCedula && <p style={{ color: 'red' }}>{errorCedula}</p>} {/* Mostrar mensaje de error */}
          </div>
          <div className="form-group">
            <label>Membresía</label>
            <select
              value={membresia}
              onChange={(e) => setMembresia(e.target.value)}
              required
            >
              <option value="">Seleccionar...</option>
              <option value="Oro">Oro</option>
              <option value="Platino">Platino</option>
              <option value="Diamante">Diamante</option>
            </select>
          </div>
          <button type="submit" className="submit-btn">
            <IoAddCircleOutline /> Actualizar Miembro
          </button>
        </form>
      </div>
    </div>
  );
}

export default FormularioEditar;
