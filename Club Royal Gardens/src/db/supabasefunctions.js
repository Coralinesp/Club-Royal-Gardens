
import supaConetion from "../db/supabaseconfig";

// Obtener todos los miembros
export const getMiembros = async () => {
    const { data, error } = await supaConetion
    .from("Miembros")
    .select('*');
    if (error) throw error;
    return data;
  };


  // Actualizar un miembro por ID
export const updateMiembro = async (id, updatedFields) => {
    const { data, error } = await supaConetion
      .from("Miembros")
      .update(updatedFields)
      .eq("id", id);
    if (error) throw error;
    return data;
  };

  // Eliminar un miembro por ID
export const deleteMiembro = async (id) => {
    const { error } = await supaConetion.from("Miembros").delete().eq("id", id);
    if (error) throw error;
  };

 // Agregar un nuevo miembro
export const addMiembro = async (miembro) => {
  const { data, error } = await supaConetion.from("Miembros").insert([miembro]);
  if (error) throw error;
  return data;
};

