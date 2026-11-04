import fs from "node:fs";
import path from "node:path";

// Búsquedas alineadas al perfil editorial de Players of Life Torreón
const SECCIONES = [
  {
    categoria: "Brands",
    query:
      "Torreón franquicias OR marcas OR inversiones empresariales OR aperturas negocios Laguna",
  },
  {
    categoria: "Focus",
    query:
      "Torreón directores OR empresarios Laguna OR liderazgo innovación negocios desarrollo",
  },
  {
    categoria: "Reels",
    query:
      "Torreón networking OR tendencias estilo vida OR eventos ejecutivos Torreon",
  },
  {
    categoria: "Time out",
    query:
      "Torreón restaurantes apertura OR gastronomia Parras Laguna OR mixologia lugares fin de semana",
  },
  {
    categoria: "RPM",
    query:
      "autos gama alta Mexico OR automotriz Coahuila inversiones OR lanzamientos automotrices",
  },
  {
    categoria: "Lights",
    query:
      "Torreón gala beneficencia OR exposiciones cultura arte Laguna OR premiaciones eventos sociales",
  },
];

async function recolectarNoticias() {
  console.log(
    "Extrayendo notas al estilo Players of Life (Negocios y Lifestyle Laguna)...",
  );
  const todasLasNoticias = [];

  for (const sec of SECCIONES) {
    try {
      const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(sec.query)}&hl=es-419&gl=MX&ceid=MX:es-419`;
      const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

      const respuesta = await fetch(apiUrl);
      const datos = await respuesta.json();

      if (datos.status === "ok" && datos.items) {
        const notasSeccion = datos.items.slice(0, 4).map((item) => ({
          titulo: item.title,
          enlace: item.link,
          fecha: item.pubDate,
          categoria: sec.categoria,
          fuente: item.author || "Redacción Laguna",
        }));

        todasLasNoticias.push(...notasSeccion);
        console.log(
          `✓ ${sec.categoria}: ${notasSeccion.length} artículos recopilados.`,
        );
      }
    } catch (error) {
      console.error(`Error en sección ${sec.categoria}:`, error.message);
    }
  }

  const rutaArchivo = path.join(process.cwd(), "src", "data", "noticias.json");
  const carpetaDestino = path.dirname(rutaArchivo);

  if (!fs.existsSync(carpetaDestino)) {
    fs.mkdirSync(carpetaDestino, { recursive: true });
  }

  fs.writeFileSync(rutaArchivo, JSON.stringify(todasLasNoticias, null, 2));
  console.log(
    `\n¡Completado! Base editorial cargada con ${todasLasNoticias.length} notas.`,
  );
}

recolectarNoticias();
