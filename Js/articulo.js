const urlParams = new URLSearchParams(window.location.search);
const articleId = urlParams.get('id');

fetch('Js/data.json')
    .then(response => response.json())
    .then(articulos => {
        const articulo = articulos.find(a => a.id == articleId);
        if (articulo) {
            document.getElementById('titulo').textContent = articulo.titulo;
            document.getElementById('categoria').textContent = `Categoría: ${articulo.categoria}`;
            document.getElementById('etiquetas').textContent = `Etiquetas: ${articulo.etiquetas.join(', ')}`;
            document.getElementById('contenido').textContent = articulo.contenido;
        } else {
            document.body.innerHTML = "<h1>Artículo no encontrado</h1>";
        }
    });
