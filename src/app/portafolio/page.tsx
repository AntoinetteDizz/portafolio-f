"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

export default function Home() {
  const [seccion, setSeccion] = useState("presentacion");
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [progress, setProgress] = useState(0);
  const [showPlayer, setShowPlayer] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  const galeria = [
    "/ilustraciones/1.jpg",
    "/ilustraciones/2.jpg",
    "/ilustraciones/3.jpg",
    "/ilustraciones/4.jpg",
    "/ilustraciones/5.jpg",
    "/ilustraciones/6.jpg",
    "/ilustraciones/7.jpg",
    "/ilustraciones/8.jpg",
    "/ilustraciones/9.png",
    "/ilustraciones/10.png"
  ];

  const songs = [
    {
      title: "Suggest a Question!",
      artist: "Wii Everybody Votes Channel OST",
      src: "/musica/Wii Everybody Votes Channel OST_ Suggest a Question!.mp3"
    },
    {
      title: "GIRL",
      artist: "Daoko",
      src: "/musica/GIRL - Daoko.mp3"
    },
    {
      title: "Twisted (Rock)",
      artist: "Nxcre",
      src: "/musica/Nxcre - Twisted (Rock).mp3"
    },
    {
      title: "FUNK MI CAMINO",
      artist: "Sayfalse",
      src: "/musica/Sayfalse - FUNK MI CAMINO.mp3"
    },
    {
      title: "DueeMI",
      artist: "DueeMI",
      src: "/musica/- tLDk2DueeMI.m4a"
    },
    {
      title: "DueeMI",
      artist: "DueeMI",
      src: "/musica/- tLDk2DueeMI.m4a"
    },
    {
      title: "São Paulo feat. Anitta",
      artist: "The Weeknd",
      src: "/musica/The Weeknd - São Paulo feat. Anitta (Official Music Video).mp3"
    }
  ];

  const [imagenSeleccionada, setImagenSeleccionada] = useState<string | null>(null);
  const currentSong = songs[currentSongIndex];

  // Controlar reproducción
  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Cambiar canción
  const changeSong = (index: number) => {
    setCurrentSongIndex(index);
    setIsPlaying(false);
    setProgress(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  // Control de volumen
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // Control de progreso
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    setProgress(newProgress);
    if (audioRef.current) {
      audioRef.current.currentTime = (newProgress / 100) * audioRef.current.duration;
    }
  };

  // Actualizar progreso
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
    };

    audio.addEventListener('timeupdate', updateProgress);
    return () => audio.removeEventListener('timeupdate', updateProgress);
  }, []);

  // Limpieza al desmontar
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center p-4"
      style={{ backgroundImage: "url('/941898.jpg')" }}
    >
      {/* Elemento de audio oculto */}
      <audio 
        ref={audioRef}
        src={currentSong.src}
        loop
        hidden
      />

      <div className="bg-white border border-gray-600 w-full max-w-[1000px] h-[600px] rounded-md shadow-xl flex flex-col">
        {/* Encabezado tipo ventana XP */}
        <div className="bg-blue-800 text-white px-6 py-2 text-lg font-bold flex justify-between items-center">
          <span>Portafolio</span>
          <button className="text-base border border-white px-3 py-1 rounded hover:bg-red-600">X</button>
        </div>

        {/* Contenedor principal con scroll interno */}
        <div className="flex flex-grow overflow-hidden">
          {/* Barra lateral fija */}
          <div className="bg-gray-200 border-r border-gray-400 w-[200px] py-6 px-3 space-y-4 text-lg font-bold">
            {[
              { id: "presentacion", label: "Presentación", icon: "/323.png" },
              { id: "tecnologias", label: "Tecnologías", icon: "/139_1.png" },
              { id: "proyectos", label: "Proyectos", icon: "/20.png" },
              { id: "recursos", label: "Recursos", icon: "/1016_1.png" },
              { id: "ilustraciones", label: "Ilustraciones", icon: "/899.png" },
              { id: "contacto", label: "Contacto", icon: "/1081.png" },
            ].map(({ id, label, icon }) => (
              <button
                key={id}
                onClick={() => setSeccion(id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded border transition-colors
                  ${
                    seccion === id
                      ? "bg-[#217498] text-white border-gray-600 shadow-inner"
                      : "bg-gray-100 text-black border-gray-300 hover:bg-white"
                  }`}
              >
                <Image src={icon} alt={label} width={32} height={32} />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Área de contenido con scroll */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-base bg-white">
            {seccion === "presentacion" && (
            <div className="border border-gray-400 rounded-md bg-gradient-to-br from-white to-[#f0f8ff] shadow-[inset_0_0_3px_#ccc] p-6 space-y-6">
            
            {/* Título superior con icono tipo XP */}
            <div className="flex justify-center w-full mb-4">
                <h2 className="text-blue-900 text-2xl font-bold">¡BIENVENIDO A MI PORTAFOLIO!</h2>
            </div>

            <div className="flex flex-col items-center">
            {/* Avatar con marco estilo XP - Versión con blue-900 */}
            <div className="p-1 bg-gradient-to-br from-blue-900 to-[#3b82f6] border-[3px] border-white shadow-xl mb-3">
            <Image 
                src="/avatar-1.png" 
                alt="Perfil" 
                width={250}
                height={250}
                className="border-2 border-blue-100 shadow-md"
            />
            </div>
            
            {/* Información personal con emojis */}
            <div className="bg-blue-900 text-white px-6 py-2 rounded-md shadow-md text-center">
                <p className="font-bold text-lg">Soy Antonietta Palazzo / Aelnolegustas</p>
                <div className="flex justify-center gap-3 text-sm mt-1 items-center">
                <span>🎂 23 años</span>
                <span className="text-blue-200">|</span>
                <span>📚 Estudiante de Informática</span>
                <span className="text-blue-200">|</span>
                <span>🌴 Venezuela</span>
                </div>
            </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6">

                {/* Panel de texto estilo tarjeta */}
                <div className="flex-1 bg-white border border-gray-300 rounded-lg p-4 shadow-md space-y-3">
                <h3 className="text-xl font-bold text-blue-800 border-b pb-2">Desarrolladora en Formación</h3>
                
                <p className="text-gray-800">
                    Como futura ingeniera informática, me especializo en el desarrollo de software robusto 
                    y eficiente, con experiencia práctica en múltiples lenguajes de programación y frameworks.
                    Combino mis habilidades técnicas con mi pasión por el arte digital para crear interfaces 
                    intuitivas y visualmente atractivas.
                </p>
                
                <div className="bg-yellow-50 p-3 rounded border border-yellow-100">
                    <h4 className="font-semibold text-yellow-700 mb-1">Enfoque Técnico-Creativo</h4>
                    <p className="text-sm">
                        Mi metodología combina las mejores prácticas de ingeniería de software con 
                        un enfoque creativo para resolver problemas complejos. Dominio de estructuras 
                        de datos, algoritmos y patrones de diseño, complementado con:
                    </p>
                    <ul className="mt-2 text-sm space-y-1">
                    <li className="flex items-start gap-2">
                        <span className="text-yellow-600">•</span>
                        <span>Sensibilidad artística para el diseño de interfaces</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-yellow-600">•</span>
                        <span>Habilidad para crear ilustraciones y gráficos personalizados</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-yellow-600">•</span>
                        <span>Enfoque estético en el desarrollo frontend</span>
                    </li>
                    </ul>
                </div>

                <div className="bg-purple-50 p-3 rounded border border-purple-100 mt-3">
                    <h4 className="font-semibold text-purple-700 mb-1">Dos Pasiones, Un Propósito</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                        <p className="font-medium text-purple-800 flex items-center gap-1">
                        <Image src="/139_1.png" alt="Tecnología" width={16} height={16} />
                        Tecnología:
                        </p>
                        <ul className="space-y-1 mt-1">
                        <li className="flex items-center gap-1">
                            <span className="text-blue-600">▲</span> Programación avanzada
                        </li>
                        <li className="flex items-center gap-1">
                            <span className="text-blue-600">▲</span> Desarrollo web
                        </li>
                        <li className="flex items-center gap-1">
                            <span className="text-blue-600">▲</span> Bases de datos
                        </li>
                        </ul>
                    </div>
                    <div>
                        <p className="font-medium text-purple-800 flex items-center gap-1">
                        <Image src="/899.png" alt="Arte" width={16} height={16} />
                        Arte Digital:
                        </p>
                        <ul className="space-y-1 mt-1">
                        <li className="flex items-center gap-1">
                            <span className="text-pink-600">◉</span> Ilustración profesional
                        </li>
                        <li className="flex items-center gap-1">
                            <span className="text-pink-600">◉</span> Diseño gráfico
                        </li>
                        </ul>
                    </div>
                    </div>
                    <p className="mt-2 text-sm italic text-purple-600">
                    &quot;En cada línea de código veo estructura, en cada trazo digital veo expresión - 
                    mi objetivo es unir ambos mundos&quot;
                    </p>
                </div>
                </div>
            </div>
            </div>
        )}

            {seccion === "tecnologias" && (
              <div className="space-y-6">
                <h2 className="bg-blue-800 text-white px-3 py-2 rounded text-lg font-bold">
                  Tecnologías de Desarrollo
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="font-bold text-blue-800 mb-2">Lenguajes de Programación</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <Image src="/java.png" alt="Java" width={45} height={45} />
                        <span>Java</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Image src="/piton.png" alt="Python" width={45} height={45} />
                        <span>Python</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Image src="/c-.png" alt="C++" width={45} height={45} />
                        <span>C++</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="font-bold text-blue-800 mb-2">Bases de Datos</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <Image src="/postgre.png" alt="PostgreSQL" width={45} height={45} />
                        <span>PostgreSQL</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Image src="/mongodb_original_logo_icon_146424.png" alt="MongoDB" width={45} height={45} />
                        <span>MongoDB</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="font-bold text-blue-800 mb-2">Desarrollo Web</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <Image src="/html.png" alt="HTML" width={45} height={45} />
                        <span>HTML</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Image src="/css-3.png" alt="CSS" width={45} height={45} />
                        <span>CSS</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {seccion === "proyectos" && (
              <div>
                <h2 className="bg-blue-800 text-white px-3 py-2 rounded text-lg font-bold mb-4">
                  Proyectos Recientes
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      titulo: "Perceptrón Multicapa para Clasificación de Emociones en Texto",
                      repo: "Repositorio de GitHub",
                      url: "https://github.com/AntoinetteDizz/Multilayer-Perceptron.git",
                    },
                    {
                      titulo: "Juego de Damas 4x4 con Pygame",
                      repo: "Repositorio de GitHub",
                      url: "https://github.com/AntoinetteDizz/JuegoDamas_IA.git",
                    },
                    {
                      titulo: "Agente Inteligente (Q-Learning) para el Juego de Damas",
                      repo: "Repositorio de GitHub",
                      url: "https://github.com/AntoinetteDizz/JuegoDamas_QLearning.git",
                    },
                    {
                      titulo: "Sistema de Gestión de Supermercado",
                      repo: "Repositorio de GitHub",
                      url: "https://github.com/Callaquenoveo/Proyecto-Cassandra.git",
                    },
                  ].map((p, i) => (
                    <a
                      key={i}
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white border p-4 rounded shadow-sm hover:shadow-md transition-shadow duration-200 block"
                    >
                      <div className="flex items-center gap-3">
                        <Image src="/github (1).png" alt="icono" width={60} height={60} style={{ opacity: 0.7 }} />
                        <div>
                          <p className="font-semibold text-sm">{p.titulo}</p>
                          <p className="text-[12px] text-gray-500">{p.repo}</p>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {seccion === "ilustraciones" && (
              <div className="space-y-6 relative">
                <h2 className="bg-blue-800 text-white px-3 py-2 rounded text-lg font-bold">
                  Ilustraciones
                </h2>

                {/* Galería de miniaturas */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {galeria.map((src, index) => (
                    <div
                      key={index}
                      onClick={() => setImagenSeleccionada(src)}
                      className="w-full h-[180px] cursor-pointer overflow-hidden rounded-md shadow-md hover:shadow-lg transition-all duration-300 group"
                    >
                      <img
                        src={src}
                        alt={`Ilustración ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>

                {/* Modal con navegación */}
                {imagenSeleccionada && (
                <div
                  className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
                  onClick={() => setImagenSeleccionada(null)}
                >
                  <div
                    className="relative flex items-center justify-center w-full h-full"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Botón cerrar */}
                    <button
                      onClick={() => setImagenSeleccionada(null)}
                      className="absolute top-4 right-4 text-white text-2xl font-bold hover:scale-110 transition-transform"
                      aria-label="Cerrar"
                    >
                      ✕
                    </button>

                    {/* Flecha izquierda */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const idx = galeria.indexOf(imagenSeleccionada);
                        const anterior = galeria[(idx - 1 + galeria.length) % galeria.length];
                        setImagenSeleccionada(anterior);
                      }}
                      className="absolute left-4 text-white text-4xl font-bold hover:scale-110 transition-transform select-none"
                    >
                      ←
                    </button>

                    {/* Imagen grande */}
                    <img
                      src={imagenSeleccionada}
                      alt="Ilustración ampliada"
                      className="max-w-[90%] max-h-[90%] rounded shadow-lg border-4 border-white"
                    />

                    {/* Flecha derecha */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const idx = galeria.indexOf(imagenSeleccionada);
                        const siguiente = galeria[(idx + 1) % galeria.length];
                        setImagenSeleccionada(siguiente);
                      }}
                      className="absolute right-4 text-white text-4xl font-bold hover:scale-110 transition-transform select-none"
                    >
                      →
                    </button>
                  </div>
                </div>
              )}
              </div>
            )}

            {seccion === "recursos" && (
              <div className="space-y-6">
                <h2 className="bg-blue-800 text-white px-3 py-2 rounded text-lg font-bold">
                  Recursos Creativos
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="font-bold text-blue-800 mb-2">Diseño Gráfico</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <Image src="/ilustrador.png" alt="ilustrador" width={45} height={45} />
                        <span>Adobe Illustrator</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Image src="/photoshop.png" alt="photoshop" width={45} height={45} />
                        <span>Adobe Photoshop</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Image src="/canva.png" alt="Canva" width={55} height={55} />
                        <span>Canva</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="font-bold text-blue-800 mb-2">Dibujo Digital</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <Image src="/ibis.png" alt="Ibis Paint" width={60} height={60} />
                        <span>Ibis Paint X</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Image src="/sai.png" alt="Paint Tool SAI" width={60} height={60} />
                        <span>Paint Tool SAI</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {seccion === "contacto" && (
              <div>
                <h2 className="text-blue-800 text-xl font-bold mb-2">Contacto</h2>
                <p className="text-gray-600 text-base">
                  Puedes escribirme a:{" "}
                  <span className="font-mono text-blue-600">antoniettadizz@email.com</span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Reproductor de música flotante */}
        {showPlayer && (
          <div className="fixed bottom-16 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-3 z-50 w-64">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{currentSong.title}</p>
                  <p className="text-xs text-gray-500 truncate">{currentSong.artist}</p>
                </div>
                <button 
                  onClick={togglePlayPause}
                  className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-blue-700 text-sm"
                >
                  {isPlaying ? '❚❚' : '▶'}
                </button>
              </div>
              
              {/* Barra de progreso interactiva */}
              <input
                type="range"
                min="0"
                max="100"
                step="0.1"
                value={progress}
                onChange={handleProgressChange}
                className="w-full h-1.5 rounded-full appearance-none bg-gray-200 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600"
              />
              
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Volumen:</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-full h-1.5 rounded-full appearance-none bg-gray-200 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600"
                />
              </div>
              
              {/* Selector de canciones */}
              <div className="text-xs">
                <span className="text-gray-500">Canciones:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {songs.map((song, index) => (
                    <button
                      key={index}
                      onClick={() => changeSong(index)}
                      className={`px-2 py-1 rounded text-xs ${currentSongIndex === index ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer tipo barra de tareas */}
        <div className="bg-gray-300 border-t border-gray-500 px-4 py-2 flex justify-between items-center text-sm">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSeccion("presentacion")}
              className="flex items-center gap-2 px-3 py-1 bg-gray-100 border border-gray-500 rounded-sm hover:bg-white"
            >
              <Image src="/323.png" alt="Inicio" width={18} height={18} />
              <span className="font-semibold">Inicio</span>
            </button>
            <div className="flex items-center gap-2 px-3 py-1 bg-gray-200 border border-gray-500 rounded-sm">
              <Image src="/199.png" alt="Sección activa" width={16} height={16} />
              <span className="capitalize">{seccion}</span>
            </div>

            {/* Botón para mostrar/ocultar el reproductor */}
            <button 
              onClick={() => setShowPlayer(!showPlayer)}
              className="flex items-center gap-1 px-2 py-1 bg-gray-100 border border-gray-500 rounded-sm hover:bg-white"
            >
              <Image src="/307.png" alt="Reproductor" width={16} height={16} />
              <span>{isPlaying ? 'Reproduciendo...' : 'Reproductor'}</span>
            </button>
          </div>
          <div className="flex items-center gap-2 pr-2 text-gray-800">
            <Image src="/192.png" alt="Lupa" width={14} height={14} />
            <span>{new Date().toLocaleDateString("es-ES")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}