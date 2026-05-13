import fs from 'fs';
import path from 'path';

/**
 * Elimina todos los archivos en el mismo directorio que tienen el mismo nombre base.
 * 
 * @param filePath - Ruta completa del archivo original.
 */
export const deleteFileWithDoubleExtensions = (filePath: string) => {
    const dir = path.dirname(filePath); // Obtener el directorio del archivo
    const baseName = path.basename(filePath, path.extname(filePath)); // Obtener el nombre base sin extensión

    // Leer todos los archivos en el directorio
    fs.readdir(dir, (err, files) => {
        if (err) {
            console.error(`Error reading directory ${dir}:`, err);
            return;
        }

        // Filtrar archivos que tienen el mismo nombre base
        const filesToDelete = files.filter(file =>
            path.basename(file, path.extname(file)) === baseName
        );

        // Eliminar todos los archivos encontrados
        filesToDelete.forEach(file => {
            const filePathToDelete = path.join(dir, file);
            fs.unlink(filePathToDelete, (error) => {
                if (error) {
                    console.error(`Error deleting file ${filePathToDelete}:`, error);
                }
            });
        });
    });
};