import { useState } from 'react';
import '../FormularioAgregar.css';
import { addMiembro } from '../db/supabasefunctions';
import { IoAddCircleOutline } from "react-icons/io5";

function FormularioAgregar({ agregarMiembro }) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [numero, setNumero] = useState('');
  const [cedula, setCedula] = useState('');
  const [membresia, setMembresia] = useState('');
  const [errorCedula, setErrorCedula] = useState('');

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

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      // Validar la cédula antes de continuar
      const esCedulaValida = await validarCedula(cedula);
      if (!esCedulaValida) return; // Si la cédula no es válida, no continuar
  
      if (nombre && email && numero && cedula && membresia) {
        try {
          // Llamar a la función addMiembro que se conecta a la base de datos
          await addMiembro({ nombre, email, numero, cedula, membresia });
          alert("Miembro agregado exitosamente");
  
          // Limpiar los campos después de agregar el miembro
          setNombre('');
          setEmail('');
          setNumero('');
          setCedula('');
          setMembresia('');
        } catch (error) {
          alert("Hubo un error al agregar el miembro: " + error.message);
        }
      } else {
        alert("Por favor, complete todos los campos.");
      }
    };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button onClick={() => agregarMiembro(null)} className="close-btn">X</button>
        <div className='addform-top'>
          <h2>Registrar Nuevo Miembro</h2>
        <p>Complete el formulario para registrar un nuevo miembro en el club.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label>Nombre</label>
            <input
              type="text"
              placeholder='Caroline Perez'
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder='cperez@gmail.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Número</label>
            <input
              type="text"
              placeholder='8497589952'
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Cédula</label>
            <input
              type="text"
              placeholder='003-4567890-2'
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
            <IoAddCircleOutline /> Agregar Miembro
          </button>
        </form>
      </div>
    </div>
  );
}

export default FormularioAgregar;
