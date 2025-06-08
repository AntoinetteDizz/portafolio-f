import Image from "next/image";

type ApiStatus = {
  status: string;
  timestamp?: string;
};

type SaludoData = {
  message: string;
  timestamp?: string;
};

export default async function Home() {
  // Aseguramos que la URL no termine con /
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL 
    ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '')
    : 'https://portafolio-b.onrender.com';
  
  // Estado inicial
  let apiStatus: ApiStatus = { 
    status: '✅ API corriendo correctamente',
    timestamp: new Date().toISOString()
  };

  let saludoData: SaludoData = { 
    message: 'No se pudo obtener el saludo del backend',
    timestamp: new Date().toISOString()
  };

  try {
    // 1. Verificar estado del backend (ruta raíz)
    const healthResponse = await fetch(API_BASE_URL, {
      cache: 'no-store',
      headers: {
        'Accept': 'text/html, application/json'
      }
    });

    if (!healthResponse.ok) {
      apiStatus.status = `❌ Error ${healthResponse.status}: ${healthResponse.statusText}`;
    }
  } catch (error) {
    apiStatus = {
      status: `❌ Error de conexión: ${error instanceof Error ? error.message : 'Falló la conexión'}`,
      timestamp: new Date().toISOString()
    };
    console.error('Error al verificar estado del backend:', error);
  }

  try {
    // 2. Obtener mensaje de saludo (ruta específica)
    const saludoResponse = await fetch(`${API_BASE_URL}/api/saludo`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (saludoResponse.ok) {
      saludoData = await saludoResponse.json();
    } else {
      saludoData.message = `⚠️ Error ${saludoResponse.status}: ${saludoResponse.statusText}`;
    }
  } catch (error) {
    saludoData = {
      message: `❌ Error de conexión: ${error instanceof Error ? error.message : 'Falló la conexión'}`,
      timestamp: new Date().toISOString()
    };
    console.error('Error al obtener saludo del backend:', error);
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />

        {/* Tarjeta de estado del API */}
        <div className="w-full max-w-md p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-all hover:shadow-xl">
          <div className="flex items-center gap-3 mb-2">
            <div className={`h-3 w-3 rounded-full ${
              apiStatus.status.includes('✅') ? 'bg-green-500' : 
              apiStatus.status.includes('⚠️') ? 'bg-yellow-500' : 'bg-red-500'
            } animate-pulse`} />
            <h3 className="font-medium text-gray-900 dark:text-white">Estado del Backend</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            {apiStatus.status}
          </p>
          <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            <span className="font-mono">Endpoint: </span>
            <span className="font-mono text-blue-600 dark:text-blue-400 break-all">
              {API_BASE_URL}
            </span>
            {apiStatus.timestamp && (
              <div className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                Última verificación: {new Date(apiStatus.timestamp).toLocaleString()}
              </div>
            )}
          </div>
        </div>

        {/* Tarjeta del mensaje del backend */}
        <div className="w-full max-w-md p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg border border-blue-100 dark:border-gray-700 transition-all hover:shadow-xl">
          <h3 className="font-medium text-gray-900 dark:text-white mb-3">Comunicación con Backend</h3>
          <div className="px-4 py-3 bg-white/70 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
            <p className={`text-lg font-mono text-center ${
              saludoData.message.includes('❌') ? 'text-red-500 dark:text-red-400' : 
              saludoData.message.includes('⚠️') ? 'text-yellow-500 dark:text-yellow-300' :
              'text-blue-600 dark:text-blue-300'
            }`}>
              {saludoData.message}
            </p>
          </div>
          <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            <span className="font-mono">Endpoint: </span>
            <span className="font-mono text-blue-600 dark:text-blue-400 break-all">
              {API_BASE_URL}/api/saludo
            </span>
            {saludoData.timestamp && (
              <div className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                Última actualización: {new Date(saludoData.timestamp).toLocaleString()}
              </div>
            )}
          </div>
        </div>

        <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2 tracking-[-.01em]">
            El backend está corriendo en{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold break-all">
              {API_BASE_URL}
            </code>
          </li>
          <li className="tracking-[-.01em]">
            Frontend conectado {apiStatus.status.includes('✅') ? 'correctamente' : 'con problemas'}.
          </li>
        </ol>
      </main>
    </div>
  );
}

/*import Image from "next/image";

type ApiStatus = {
  status: string;
  timestamp?: string;
};

type SaludoData = {
  message: string;
  timestamp?: string;
};

export default async function Home() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://portafolio-b.onrender.com';
  
  // Estado inicial con marcas de tiempo para diagnóstico
  let apiStatus: ApiStatus = { 
    status: '⚠️ Probando conexión con el backend...',
    timestamp: new Date().toISOString()
  };

  let saludoData: SaludoData = { 
    message: '⌛ Cargando mensaje del backend...',
    timestamp: new Date().toISOString()
  };

  try {
    // 1. Verificar estado del backend (ruta raíz)
    const healthResponse = await fetch(API_BASE_URL, {
      cache: 'no-store',
      headers: {
        'Accept': 'text/html, application/json'
      }
    });

    if (healthResponse.ok) {
      const contentType = healthResponse.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        apiStatus = await healthResponse.json();
      } else {
        apiStatus.status = '✅ API corriendo correctamente';
      }
    } else {
      apiStatus.status = `❌ Error ${healthResponse.status}: ${healthResponse.statusText}`;
    }
  } catch (error) {
    apiStatus = {
      status: `❌ Error de conexión: ${error instanceof Error ? error.message : 'Falló la conexión'}`,
      timestamp: new Date().toISOString()
    };
    console.error('Error al verificar estado del backend:', error);
  }

  try {
    // 2. Obtener mensaje de saludo (ruta específica)
    const saludoResponse = await fetch(`${API_BASE_URL}/api/saludo`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (saludoResponse.ok) {
      saludoData = await saludoResponse.json();
    } else {
      saludoData.message = `⚠️ Error ${saludoResponse.status}: ${saludoResponse.statusText}`;
    }
  } catch (error) {
    saludoData = {
      message: `❌ Error de conexión: ${error instanceof Error ? error.message : 'Falló la conexión'}`,
      timestamp: new Date().toISOString()
    };
    console.error('Error al obtener saludo del backend:', error);
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />

        <a
          href="/hola-mundo"
          className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-green-600 text-white gap-2 hover:bg-green-700 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span>Hola Mundo</span>
        </a>

        {/* Tarjeta de estado del API }
        <div className="w-full max-w-md p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-all hover:shadow-xl">
          <div className="flex items-center gap-3 mb-2">
            <div className={`h-3 w-3 rounded-full ${
              apiStatus.status.includes('✅') ? 'bg-green-500' : 
              apiStatus.status.includes('⚠️') ? 'bg-yellow-500' : 'bg-red-500'
            } animate-pulse`} />
            <h3 className="font-medium text-gray-900 dark:text-white">Estado del Backend</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            {apiStatus.status}
          </p>
          <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            <span className="font-mono">Endpoint: </span>
            <span className="font-mono text-blue-600 dark:text-blue-400 break-all">
              {API_BASE_URL}
            </span>
            {apiStatus.timestamp && (
              <div className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                Última verificación: {new Date(apiStatus.timestamp).toLocaleString()}
              </div>
            )}
          </div>
        </div>

        {/* Tarjeta del mensaje del backend }
        <div className="w-full max-w-md p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg border border-blue-100 dark:border-gray-700 transition-all hover:shadow-xl">
          <h3 className="font-medium text-gray-900 dark:text-white mb-3">Comunicación con Backend</h3>
          <div className="px-4 py-3 bg-white/70 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
            <p className={`text-lg font-mono text-center ${
              saludoData.message.includes('❌') ? 'text-red-500 dark:text-red-400' : 
              saludoData.message.includes('⚠️') ? 'text-yellow-500 dark:text-yellow-300' :
              'text-blue-600 dark:text-blue-300'
            }`}>
              {saludoData.message}
            </p>
          </div>
          <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            <span className="font-mono">Endpoint: </span>
            <span className="font-mono text-blue-600 dark:text-blue-400 break-all">
              {API_BASE_URL}/api/saludo
            </span>
            {saludoData.timestamp && (
              <div className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                Última actualización: {new Date(saludoData.timestamp).toLocaleString()}
              </div>
            )}
          </div>
        </div>

        <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2 tracking-[-.01em]">
            El backend está corriendo en{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold break-all">
              {API_BASE_URL}
            </code>
          </li>
          <li className="tracking-[-.01em]">
            Frontend conectado {apiStatus.status.includes('✅') ? 'correctamente' : 'con problemas'}.
          </li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
        </div>
      </main>
    </div>
  );
}*/


/*import Image from "next/image";

export default async function Home() {
  let apiStatus = { status: 'API sin conexión' };
  let saludoData = { message: 'No se pudo obtener el saludo del backend' };

  try {
    const healthResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}`, { cache: 'no-store' });
    if (healthResponse.ok) {
      apiStatus = await healthResponse.json();
    }
  } catch (error) {
    console.error('Error al obtener estado del backend:', error);
  }

  try {
    const saludoResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/saludo`, { cache: 'no-store' });
    if (saludoResponse.ok) {
      saludoData = await saludoResponse.json();
    }
  } catch (error) {
    console.error('Error al obtener saludo del backend:', error);
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />

        <a
          href="/hola-mundo"
          className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-green-600 text-white gap-2 hover:bg-green-700 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span>Hola Mundo</span>
        </a>

        {/* Tarjeta de estado del API }
        <div className="w-full max-w-md p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-all hover:shadow-xl">
          <div className="flex items-center gap-3 mb-2">
            <div className={`h-3 w-3 rounded-full ${apiStatus.status === 'API corriendo correctamente' ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
            <h3 className="font-medium text-gray-900 dark:text-white">Estado del Backend</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            {apiStatus.status}
          </p>
          <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            <span className="font-mono">Endpoint: </span>
            <span className="font-mono text-blue-600 dark:text-blue-400">
              {process.env.NEXT_PUBLIC_API_URL}api
            </span>
          </div>
        </div>

        {/* Tarjeta del mensaje del backend }
        <div className="w-full max-w-md p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg border border-blue-100 dark:border-gray-700 transition-all hover:shadow-xl">
          <h3 className="font-medium text-gray-900 dark:text-white mb-3">Comunicación con Backend</h3>
          <div className="px-4 py-3 bg-white/70 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
            <p className="text-lg font-mono text-center text-blue-600 dark:text-blue-300">
              {saludoData.message}
            </p>
          </div>
          <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            <span className="font-mono">Endpoint: </span>
            <span className="font-mono text-blue-600 dark:text-blue-400">
              {process.env.NEXT_PUBLIC_API_URL}api/saludo
            </span>
          </div>
        </div>

        <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2 tracking-[-.01em]">
            El backend está corriendo en{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
              {process.env.NEXT_PUBLIC_API_URL || 'localhost:3000'}
            </code>
          </li>
          <li className="tracking-[-.01em]">
            Frontend conectado correctamente.
          </li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
        </div>
      </main>
    </div>
  );
}*/



/*import Image from "next/image";

export default async function Home() {
  // Fetch al backend (NestJS)
  const response = await fetch('http://localhost:3000/api/saludo');
  const saludoBackend = await response.text();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        
        {/* Muestra el mensaje del backend }
        <div className="bg-black/[.05] dark:bg-white/[.06] px-4 py-2 rounded font-[family-name:var(--font-geist-mono)]">
          Mensaje del backend: <strong>{saludoBackend}</strong>
        </div>

        <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2 tracking-[-.01em]">
            El backend está corriendo en{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
              localhost:3000
            </code>
          </li>
          <li className="tracking-[-.01em]">
            Frontend conectado correctamente.
          </li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
        </div>
      </main>
    </div>
  );
}*/

/*import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2 tracking-[-.01em]">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
              src/app/page.tsx
            </code>
            .
          </li>
          <li className="tracking-[-.01em]">
            Save and see your changes instantly.
          </li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}*/
