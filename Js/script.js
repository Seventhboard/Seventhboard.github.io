fetch('Js/data.json')
    .then(response => response.json())
    .then(articulos => {
        let postsContainer = document.getElementById('posts');
        articulos.forEach(articulo => {
            let post = document.createElement('div');
            post.innerHTML = `
                <h2>${articulo.titulo}</h2>
                <p><strong>Categoría:</strong> ${articulo.categoria}</p>
                <p><strong>Etiquetas:</strong> ${articulo.etiquetas.join(', ')}</p>
                <a href="articulo.html?id=${articulo.id}">Leer más</a>
                <hr>
            `;
            postsContainer.appendChild(post);
        });
    });
