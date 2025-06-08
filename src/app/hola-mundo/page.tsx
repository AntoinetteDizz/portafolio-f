import Link from 'next/link';

export default function HolaMundoPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-500 mb-6">
          ¡Hola Mundo!
        </h1>
        
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Esta es una página independiente con su propia ruta
        </p>

        <div className="bg-white dark:bg-gray-700/90 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600">
          <p className="font-mono text-sm text-gray-800 dark:text-gray-200">
            Ruta: <span className="text-blue-600 dark:text-blue-400">/hola-mundo</span>
          </p>
        </div>

        <Link href="/" passHref>
          <div className="mt-8 inline-block px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">
            Volver al Home
          </div>
        </Link>
      </div>
    </main>
  );
}
