export default function TermsPage() {
  return (
    <article className="prose dark:prose-invert pt-24 pb-48">
      <h1>Preguntas Frecuentes</h1>
      <section>
        <h2>¿Qué es Subtis?</h2>
        <p>Subtis es un servicio que te permite descargar subtítulos para tus películas.</p>
      </section>

      <section>
        <h2>¿Como funciona Subtis?</h2>
        <p>Subtis busca en varios proveedores de subtitulos el mejor subtitulo para tu pelicula.</p>
      </section>

      <section>
        <h2>¿Puedo mirar y/o descargar las películas desde Subtis?</h2>
        <p>No. Subtis solamente proporciona subtítulos.</p>
      </section>

      <section>
        <h2>Todavía no recibí mi subtítulo en mi email. ¿Cuando lo recibiré?</h2>
        <p>Si todavía no recibiste tu subtítulo por email, es probable que aún no esté disponible.</p>
      </section>

      <section>
        <h2>No encuentro mi película en la búsqueda. ¿Cómo puedo solucionarlo?</h2>
        <p>Si tu película no está en la búsqueda significa que por el momento no tenemos los subtítulos disponibles.</p>
      </section>

      <section>
        <h2>Mi subtítulo no está sincronizado con el video. ¿Qué puedo hacer?</h2>
        <p>
          Si descargaste el subtítulo desde la página de película, proba arrastrando y soltando el archivo de video para
          poder buscar el subtítulo correcto. En caso de que el problema persista podes escribirnos a soporte@subt.is
        </p>
      </section>

      <section>
        <h2>¿Cuál es el cliente o extensión de Subtis que debería usar?</h2>
        <p>Te recomendamos principalmente la extensión para Stremio.</p>
      </section>

      <section>
        <h2>¿Qué resoluciones soporta Subtis?</h2>
        <p>Soportamos títulos desde 480p hasta 2160p (4K). También soportamos títulos en 3D.</p>
      </section>

      <section>
        <h2>¿Qué publicadores o release groups soporta Subtis?</h2>
        <p>Soportamos los release groups más conocidos como YTS/YIFI, GalaxyRG, ETHEL y otros 75 más.</p>
      </section>

      <section>
        <h2>¿Soportan versiones extendidas como por ej "Director's Cut", "Extended Version"?</h2>
        <p>
          Por el momento no lo soportamos pero podes contactarnos al email enviándonos la versión que estas buscando.
        </p>
      </section>

      <section>
        <h2>¿Si utilizo la búsqueda por archivo, el video se sube a algún servidor?</h2>
        <p>No, el video no se sube a ningún lado. Solo obtenemos la metadata del archivo.</p>
      </section>

      <section>
        <h2>¿Hay add-ons para software de Home Theaters como Plex o Kodi?</h2>
        <p>No, pero tenemos planes de hacerlo en el futuro.</p>
      </section>
    </article>
  );
}