"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { fetchTecnologias, fetchProyectos, groupTecnologiasByCategoria, groupTecnologiasByCategoriaFiltered } from "../services/api";
import { Tecnologia, Proyecto, TecnologiaCategoria } from "../types";

export default function Home() {
  const [seccion, setSeccion] = useState("presentacion");
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [progress, setProgress] = useState(0);
  const [showPlayer, setShowPlayer] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Estados para datos dinámicos del backend
  const [tecnologias, setTecnologias] = useState<Tecnologia[]>([]);
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [tecnologiasAgrupadas, setTecnologiasAgrupadas] = useState<TecnologiaCategoria[]>([]);
  const [tecnologiasDesarrollo, setTecnologiasDesarrollo] = useState<TecnologiaCategoria[]>([]);
  const [tecnologiasRecursos, setTecnologiasRecursos] = useState<TecnologiaCategoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Verificar si es móvil al cargar y en redimensiones
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

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
      title: "São Paulo feat. Anitta",
      artist: "The Weeknd",
      src: "/musica/The Weeknd - São Paulo feat. Anitta (Official Music Video).mp3"
    }
  ];

  const [imagenSeleccionada, setImagenSeleccionada] = useState<string | null>(null);
  const currentSong = songs[currentSongIndex];

  // Refs para los sonidos
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);
  const navSoundRef = useRef<HTMLAudioElement | null>(null);

  // Función para reproducir sonido de click
  const playClickSound = () => {
    try {
      if (clickSoundRef.current) {
        clickSoundRef.current.currentTime = 0;
        clickSoundRef.current.volume = 0.3;
        clickSoundRef.current.play().catch(e => console.log("Error click:", e));
      }
    } catch (e) {
      console.log("Error con clickSound:", e);
    }
  };

  // Función para reproducir sonido de navegación
  const playNavSound = () => {
    try {
      if (navSoundRef.current) {
        navSoundRef.current.currentTime = 0;
        navSoundRef.current.volume = 0.3;
        navSoundRef.current.play().catch(e => console.log("Error nav:", e));
      }
    } catch (e) {
      console.log("Error con navSound:", e);
    }
  };

  // Controlar reproducción
  const togglePlayPause = () => {
    playClickSound();
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Cambiar canción
  const changeSong = (index: number) => {
    playClickSound();
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
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = (newProgress / 100) * audioRef.current.duration;
    }
  };

  // Actualizar progreso
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100 || 0);
      }
    };

    audio.addEventListener('timeupdate', updateProgress);
    return () => {
      if (audio) {
        audio.removeEventListener('timeupdate', updateProgress);
      }
    };
  }, []);

  // Precargar sonidos al montar
  useEffect(() => {
    if (clickSoundRef.current) clickSoundRef.current.load();
    if (navSoundRef.current) navSoundRef.current.load();
  }, []);

  // Alternar menú en móvil
  const [menuAbierto, setMenuAbierto] = useState(false);

  // Cargar datos del backend
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Cargar tecnologías y proyectos en paralelo
        const [tecnologiasData, proyectosData] = await Promise.all([
          fetchTecnologias(),
          fetchProyectos()
        ]);
        
        setTecnologias(tecnologiasData);
        setProyectos(proyectosData);
        
        // Agrupar tecnologías por categoría (todas)
        const agrupadas = groupTecnologiasByCategoria(tecnologiasData);
        setTecnologiasAgrupadas(agrupadas);
        
        // Agrupar tecnologías para la sección de desarrollo
        const categoriasDesarrollo = [
          "Tecnologías de Desarrollo",
          "Frameworks", 
          "Bases de Datos",
          "Desarrollo Web"
        ];
        const tecnologiasDesarrolloAgrupadas = groupTecnologiasByCategoriaFiltered(tecnologiasData, categoriasDesarrollo);
        setTecnologiasDesarrollo(tecnologiasDesarrolloAgrupadas);
        
        // Agrupar tecnologías para la sección de recursos
        const categoriasRecursos = [
          "Diseño Gráfico",
          "Dibujo Digital"
        ];
        const tecnologiasRecursosAgrupadas = groupTecnologiasByCategoriaFiltered(tecnologiasData, categoriasRecursos);
        setTecnologiasRecursos(tecnologiasRecursosAgrupadas);
        
      } catch (err) {
        console.error('Error cargando datos:', err);
        setError('Error al cargar los datos. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center p-2 md:p-4"
      style={{ backgroundImage: "url('/941898.jpg')" }}
    >
      {/* Elementos de audio */}
      <audio 
        ref={audioRef}
        src={currentSong.src}
        loop
        hidden
        onError={(e) => console.error("Error cargando audio:", e.currentTarget.error)}
      />
      <audio ref={clickSoundRef} src="/sonidos/Windows XP Start.wav" preload="auto" hidden />
      <audio ref={navSoundRef} src="/sonidos/Windows XP Start.wav" preload="auto" hidden />

      <div className="bg-white border border-gray-600 w-full max-w-[1000px] h-[90vh] md:h-[600px] rounded-md shadow-xl flex flex-col mx-2">
        {/* Encabezado tipo ventana XP */}
        <div className="bg-blue-800 text-white px-4 md:px-6 py-2 text-lg font-bold flex justify-between items-center">
          <span>Portafolio</span>
          <button 
            onClick={() => playClickSound()}
            className="text-base border border-white px-3 py-1 rounded hover:bg-red-600"
          >
            X
          </button>
        </div>

        {/* Contenedor principal con scroll interno */}
        <div className="flex flex-grow overflow-hidden flex-col md:flex-row">
          {/* Botón de menú para móviles */}
          {isMobile && (
            <button
              onClick={() => {
                playNavSound();
                setMenuAbierto(!menuAbierto);
              }}
              className="md:hidden bg-gray-200 border-b border-gray-400 p-2 flex items-center justify-center"
            >
              <Image 
                src="/20.png" 
                alt="Menú" 
                width={24} 
                height={24} 
                className="mr-2"
              />
              <span className="font-semibold">Menú</span>
            </button>
          )}

          {/* Barra lateral fija - Responsive */}
          <div className={`${isMobile ? (menuAbierto ? "block" : "hidden") : "block"} bg-gray-200 border-r border-gray-400 w-full md:w-[200px] py-4 md:py-6 px-2 md:px-3 space-y-2 md:space-y-4 text-base md:text-lg font-bold`}>
            {[
              { id: "presentacion", label: "Presentación", icon: "/323.png" },
              { id: "tecnologias", label: "Tecnologías", icon: "/139_1.png" },
              { id: "proyectos", label: "Proyectos", icon: "/1081.png" },
              { id: "recursos", label: "Recursos", icon: "/1016_1.png" },
              { id: "ilustraciones", label: "Ilustraciones", icon: "/899.png" },
              { id: "contacto", label: "Contacto", icon: "/1010.png" },
            ].map(({ id, label, icon }) => (
              <button
                key={id}
                onClick={() => {
                  playNavSound();
                  setSeccion(id);
                  if (isMobile) setMenuAbierto(false);
                }}
                className={`w-full flex items-center gap-2 md:gap-3 px-2 md:px-3 py-1 md:py-2 rounded border transition-colors text-sm md:text-base
                  ${
                    seccion === id
                      ? "bg-[#217498] text-white border-gray-600 shadow-inner"
                      : "bg-gray-100 text-black border-gray-300 hover:bg-white"
                  }`}
              >
                <Image src={icon} alt={label} width={isMobile ? 24 : 32} height={isMobile ? 24 : 32} />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Área de contenido con scroll */}
          <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-4 md:space-y-6 text-sm md:text-base bg-white">
            {seccion === "presentacion" && (
              <div className="border border-gray-400 rounded-md bg-gradient-to-br from-white to-[#f0f8ff] shadow-[inset_0_0_3px_#ccc] p-4 md:p-6 space-y-4 md:space-y-6">
                {/* Título superior */}
                <div className="flex justify-center w-full mb-3 md:mb-4">
                  <h2 className="text-blue-900 text-xl md:text-2xl font-bold">¡BIENVENIDO A MI PORTAFOLIO!</h2>
                </div>

                <div className="flex flex-col items-center">
                  {/* Avatar con marco estilo XP */}
                  <div className="p-1 bg-gradient-to-br from-blue-900 to-[#3b82f6] border-[3px] border-white shadow-xl mb-3">
                    <Image 
                      src="/avatar-1.png" 
                      alt="Perfil" 
                      width={isMobile ? 150 : 250}
                      height={isMobile ? 150 : 250}
                      className="border-2 border-blue-100 shadow-md"
                    />
                  </div>
                  
                  {/* Información personal con emojis */}
                  <div className="bg-blue-900 text-white px-4 md:px-6 py-2 rounded-md shadow-md text-center w-full">
                    <p className="font-bold text-base md:text-lg">Soy Antonietta Palazzo / Aelnolegustas</p>
                    <div className="flex flex-col md:flex-row justify-center gap-1 md:gap-3 text-xs md:text-sm mt-1 items-center">
                      <span>🎂 23 años</span>
                      <span className="hidden md:inline text-blue-200">|</span>
                      <span>📚 Estudiante de Informática</span>
                      <span className="hidden md:inline text-blue-200">|</span>
                      <span>🌴 Venezuela</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
                  {/* Panel de texto estilo tarjeta */}
                  <div className="flex-1 bg-white border border-gray-300 rounded-lg p-3 md:p-4 shadow-md space-y-2 md:space-y-3">
                    <h3 className="text-lg md:text-xl font-bold text-blue-800 border-b pb-2">Desarrolladora en Formación</h3>
                    
                    <p className="text-gray-800 text-sm md:text-base">
                      Como futura ingeniera informática, me especializo en el desarrollo de software robusto 
                      y eficiente, con experiencia práctica en múltiples lenguajes de programación y frameworks.
                      Combino mis habilidades técnicas con mi pasión por el arte digital para crear interfaces 
                      intuitivas y visualmente atractivas.
                    </p>
                    
                    <div className="bg-yellow-50 p-2 md:p-3 rounded border border-yellow-100">
                      <h4 className="font-semibold text-yellow-700 text-sm md:text-base mb-1">Enfoque Técnico-Creativo</h4>
                      <p className="text-xs md:text-sm">
                        Mi metodología combina las mejores prácticas de ingeniería de software con 
                        un enfoque creativo para resolver problemas complejos. Dominio de estructuras 
                        de datos, algoritmos y patrones de diseño, complementado con:
                      </p>
                      <ul className="mt-2 text-xs md:text-sm space-y-1">
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

                    <div className="bg-purple-50 p-2 md:p-3 rounded border border-purple-100 mt-2 md:mt-3">
                      <h4 className="font-semibold text-purple-700 text-sm md:text-base mb-1">Dos Pasiones, Un Propósito</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 text-xs md:text-sm">
                        <div>
                          <p className="font-medium text-purple-800 flex items-center gap-1">
                            <Image src="/139_1.png" alt="Tecnología" width={isMobile ? 12 : 16} height={isMobile ? 12 : 16} />
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
                            <Image src="/899.png" alt="Arte" width={isMobile ? 12 : 16} height={isMobile ? 12 : 16} />
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
                      <p className="mt-2 text-xs md:text-sm italic text-purple-600">
                        &ldquo;En cada línea de código veo estructura, en cada trazo digital veo expresión - 
                        mi objetivo es unir ambos mundos&rdquo;
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {seccion === "tecnologias" && (
              <div className="space-y-4 md:space-y-6">
                <h2 className="bg-blue-800 text-white px-3 py-2 rounded text-base md:text-lg font-bold">
                  Tecnologías de Desarrollo
                </h2>
                
                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-800"></div>
                    <span className="ml-2 text-gray-600">Cargando tecnologías...</span>
                  </div>
                ) : error ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                    <p className="text-red-600">{error}</p>
                    <button 
                      onClick={() => window.location.reload()} 
                      className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Reintentar
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {tecnologiasDesarrollo.map((categoria, index) => (
                      <div key={index} className="bg-gray-50 p-3 md:p-4 rounded-lg border border-gray-200 shadow-md">
                        <h3 className="font-bold text-blue-800 text-sm md:text-base mb-2">
                          {categoria.categoria}
                        </h3>
                        <ul className="space-y-2">
                          {categoria.tecnologias.map((tecnologia) => (
                            <li key={tecnologia.id} className="flex items-center gap-2">
                              <Image 
                                src={tecnologia.imagen} 
                                alt={tecnologia.nombre} 
                                width={isMobile ? 30 : 45} 
                                height={isMobile ? 30 : 45}
                                onError={(e) => {
                                  // Fallback a un ícono genérico si la imagen falla
                                  const target = e.target as HTMLImageElement;
                                  target.src = "/file.svg";
                                }}
                              />
                              <span className="text-sm md:text-base">{tecnologia.nombre}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {seccion === "proyectos" && (
              <div>
                <h2 className="bg-blue-800 text-white px-3 py-2 rounded text-base md:text-lg font-bold mb-3 md:mb-4">
                  Proyectos Recientes
                </h2>
                
                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-800"></div>
                    <span className="ml-2 text-gray-600">Cargando proyectos...</span>
                  </div>
                ) : error ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                    <p className="text-red-600">{error}</p>
                    <button 
                      onClick={() => window.location.reload()} 
                      className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Reintentar
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                    {proyectos.map((proyecto, i) => (
                      <a
                        key={proyecto.id}
                        href={proyecto.urlRepo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white border border-black rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                      >
                        {/* Contenedor de imagen con relación de aspecto 16:9 */}
                        <div className="w-full aspect-video relative overflow-hidden bg-gray-100 border-b border-black">
                          <Image 
                            src={proyecto.imagen} 
                            alt={`Captura de ${proyecto.titulo}`}
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            quality={85}
                            priority={i < 2} // Prioriza la carga de las primeras imágenes
                            onError={(e) => {
                              // Fallback a una imagen genérica si la imagen falla
                              const target = e.target as HTMLImageElement;
                              target.src = "/file.svg";
                            }}
                          />
                        </div>
                        
                        {/* Contenido textual */}
                        <div className="p-3 md:p-4">
                          <div className="flex items-start gap-3">
                            <div className="bg-gray-100 p-2 rounded-full flex-shrink-0">
                              <Image 
                                src="/github (1).png" 
                                alt="GitHub" 
                                width={24} 
                                height={24}
                              />
                            </div>
                            <div>
                              <h3 className="font-semibold text-sm md:text-base leading-tight mb-1 line-clamp-2">
                                {proyecto.titulo}
                              </h3>
                              <p className="text-xs text-gray-500">Repositorio de GitHub</p>
                            </div>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}

            {seccion === "ilustraciones" && (
              <div className="space-y-4 md:space-y-6 relative">
                <h2 className="bg-blue-800 text-white px-3 py-2 rounded text-base md:text-lg font-bold">
                  Ilustraciones
                </h2>

                {/* Galería de miniaturas */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-4">
                  {galeria.map((src, index) => (
                    <div
                      key={index}
                      onClick={() => setImagenSeleccionada(src)}
                      className="w-full h-[120px] md:h-[180px] cursor-pointer overflow-hidden rounded-md shadow-md hover:shadow-lg transition-all duration-300 group"
                    >
                      <Image
                        src={src}
                        alt={`Ilustración ${index + 1}`}
                        width={200}
                        height={200}
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
                        className="absolute top-2 md:top-4 right-2 md:right-4 text-white text-xl md:text-2xl font-bold hover:scale-110 transition-transform"
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
                        className="absolute left-2 md:left-4 text-white text-2xl md:text-4xl font-bold hover:scale-110 transition-transform select-none"
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
                        className="absolute right-2 md:right-4 text-white text-2xl md:text-4xl font-bold hover:scale-110 transition-transform select-none"
                      >
                        →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {seccion === "recursos" && (
              <div className="space-y-4 md:space-y-6">
                <h2 className="bg-blue-800 text-white px-3 py-2 rounded text-base md:text-lg font-bold">
                  Recursos Creativos
                </h2>
                
                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-800"></div>
                    <span className="ml-2 text-gray-600">Cargando recursos...</span>
                  </div>
                ) : error ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                    <p className="text-red-600">{error}</p>
                    <button 
                      onClick={() => window.location.reload()} 
                      className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Reintentar
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {tecnologiasRecursos.map((categoria, index) => (
                      <div key={index} className="bg-gray-50 p-3 md:p-4 rounded-lg border border-gray-200 shadow-md">
                        <h3 className="font-bold text-blue-800 text-sm md:text-base mb-2">
                          {categoria.categoria}
                        </h3>
                        <ul className="space-y-2">
                          {categoria.tecnologias.map((tecnologia) => (
                            <li key={tecnologia.id} className="flex items-center gap-2">
                              <Image 
                                src={tecnologia.imagen} 
                                alt={tecnologia.nombre} 
                                width={isMobile ? 30 : 45} 
                                height={isMobile ? 30 : 45}
                                onError={(e) => {
                                  // Fallback a un ícono genérico si la imagen falla
                                  const target = e.target as HTMLImageElement;
                                  target.src = "/file.svg";
                                }}
                              />
                              <span className="text-sm md:text-base">{tecnologia.nombre}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {seccion === "contacto" && (
            <div className="space-y-4 md:space-y-6">
              <h2 className="bg-blue-800 text-white px-3 py-2 rounded text-base md:text-lg font-bold mb-3 md:mb-4">
                Contacto
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {[
                  {
                    titulo: "Correo Electrónico",
                    plataforma: "Gmail",
                    texto: "Antonietta3012@gmail.com",
                    icono: "/gmail.png",
                    esLink: false
                  },
                  {
                    titulo: "Perfil de GitHub",
                    plataforma: "GitHub",
                    texto: "AntoinetteDizz",
                    icono: "/github (2).png",
                    esLink: false
                  },
                  {
                    titulo: "Perfil Profesional",
                    plataforma: "LinkedIn",
                    texto: "Antonietta Palazzo Díaz",
                    url: "https://ve.linkedin.com/in/antonietta-palazzo-1920332a1?trk=public_profile_samename-profile",
                    icono: "/linkedin.png",
                    esLink: true
                  },
                  {
                    titulo: "Cuenta Personal",
                    plataforma: "Instagram",
                    texto: "Attdzz",
                    url: "https://www.instagram.com/attdzz/",
                    icono: "/instagram (2).png",
                    esLink: true
                  }
                ].map((red, i) => (
                  red.esLink ? (
                    <a
                      key={i}
                      href={red.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={playClickSound}
                      className="bg-white border p-3 md:p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 block"
                    >
                      <div className="flex items-center gap-2 md:gap-3">
                        <Image 
                          src={red.icono} 
                          alt={red.plataforma} 
                          width={isMobile ? 40 : 60} 
                          height={isMobile ? 40 : 60}
                        />
                        <div>
                          <p className="font-semibold text-xs md:text-sm">{red.titulo}</p>
                          <p className="text-[10px] md:text-[12px] text-gray-500">{red.plataforma}</p>
                          <p className="text-xs md:text-sm mt-1 italic">{red.texto}</p>
                        </div>
                      </div>
                    </a>
                  ) : (
                    <div
                      key={i}
                      className="bg-white border p-3 md:p-4 rounded-lg shadow-md block"
                    >
                      <div className="flex items-center gap-2 md:gap-3">
                        <Image 
                          src={red.icono} 
                          alt={red.plataforma} 
                          width={isMobile ? 40 : 60} 
                          height={isMobile ? 40 : 60}
                        />
                        <div>
                          <p className="font-semibold text-xs md:text-sm">{red.titulo}</p>
                          <p className="text-[10px] md:text-[12px] text-gray-500">{red.plataforma}</p>
                          <p className="text-xs md:text-sm mt-1 italic">{red.texto}</p>
                        </div>
                      </div>
                    </div>
                  )
                ))}
              </div>

              {/* Mensaje adicional opcional */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded text-sm md:text-base shadow-md">
                <p className="text-gray-700">
                  ¡No dudes en contactarme! Estoy disponible para oportunidades laborales, colaboraciones
                  en proyectos o simplemente para charlar sobre tecnología y diseño.
                </p>
              </div>
            </div>
          )}
          </div>
        </div>

        {/* Reproductor de música flotante */}
        {showPlayer && (
          <div className={`fixed ${isMobile ? 'bottom-20 left-2 right-2' : 'bottom-16 right-4'} bg-white border border-gray-300 rounded-lg shadow-lg p-3 z-50 ${isMobile ? 'w-auto' : 'w-64'}`}>
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs md:text-sm font-medium truncate">{currentSong.title}</p>
                  <p className="text-[10px] md:text-xs text-gray-500 truncate">{currentSong.artist}</p>
                </div>
                <button 
                  onClick={togglePlayPause}
                  className="bg-blue-600 text-white rounded-full w-7 h-7 md:w-8 md:h-8 flex items-center justify-center hover:bg-blue-700 text-xs md:text-sm"
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
                className="w-full h-1.5 md:h-2 rounded-full appearance-none bg-gray-200 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:w-2 md:[&::-webkit-slider-thumb]:h-3 md:[&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600"
              />
              
              <div className="flex items-center gap-2">
                <span className="text-[10px] md:text-xs text-gray-500">Volumen:</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-full h-1.5 md:h-2 rounded-full appearance-none bg-gray-200 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:w-2 md:[&::-webkit-slider-thumb]:h-3 md:[&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600"
                />
              </div>
              
              {/* Selector de canciones */}
              <div className="text-[10px] md:text-xs">
                <span className="text-gray-500">Canciones:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {songs.map((song, index) => (
                    <button
                      key={index}
                      onClick={() => changeSong(index)}
                      className={`px-1.5 md:px-2 py-0.5 md:py-1 rounded text-[10px] md:text-xs ${currentSongIndex === index ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer tipo barra de tareas - Versión responsiva */}
        <div className="bg-gray-300 border-t border-gray-500 px-2 md:px-4 py-1 flex justify-between items-center text-xs sm:text-sm">
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto whitespace-nowrap">
            {/* Botón Inicio - Versión responsiva */}
            <button
              onClick={() => {
                playNavSound();
                setSeccion("presentacion");
              }}
              className="flex items-center gap-1 px-2 py-1 bg-gray-100 border border-gray-500 rounded-sm hover:bg-white min-w-fit"
            >
              <Image 
                src="/323.png" 
                alt="Inicio" 
                width={14} 
                height={14} 
                className="w-3 h-3 sm:w-4 sm:h-4" 
              />
              <span className="font-semibold hidden md:inline">Inicio</span>
            </button>

            {/* Sección activa - Versión responsiva */}
            <div className="flex items-center gap-1 px-2 py-1 bg-gray-200 border border-gray-500 rounded-sm min-w-fit">
              <Image 
                src="/199.png" 
                alt="Sección activa" 
                width={12} 
                height={12} 
                className="w-3 h-3 sm:w-4 sm:h-4" 
              />
              <span className="capitalize truncate max-w-[80px] sm:max-w-none">
                {seccion}
              </span>
            </div>

            {/* Botón Reproductor - Versión responsiva */}
            <button 
              onClick={() => {
                playClickSound();
                setShowPlayer(!showPlayer);
              }}
              className="flex items-center gap-1 px-1.5 sm:px-2 py-1 bg-gray-100 border border-gray-500 rounded-sm hover:bg-white min-w-fit"
            >
              <Image 
                src="/307.png" 
                alt="Reproductor" 
                width={12} 
                height={12} 
                className="w-3 h-3 sm:w-4 sm:h-4" 
              />
              <span className="hidden sm:inline">
                {isPlaying ? 'Reproduciendo...' : 'Reproductor'}
              </span>
              <span className="sm:hidden">
                {isPlaying ? '...' : 'Play'}
              </span>
            </button>
          </div>

          {/* Fecha y Hora - Versión responsiva */}
          <div className="flex items-center gap-1 pl-2 text-gray-800 min-w-fit">

            <Image 
              src="/1083.png" 
              alt="pc" 
              width={30}  
              height={30}
              className="w-7 h-7 sm:w-8 sm:h-8" 
            />
            
            <div className="flex flex-col leading-tight">
              {/* Hora en formato 12h con AM/PM */}
              <span className="text-xs sm:text-sm font-medium">
                {new Date().toLocaleTimeString("es-ES", {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                })}
              </span>
              {/* Fecha en formato dd/mm/yyyy */}
              <span className="text-[10px] sm:text-xs">
                {new Date().toLocaleDateString("es-ES", {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                }).replace(/\//g, '/')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}