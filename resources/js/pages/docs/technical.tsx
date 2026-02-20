import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Technical Documentation',
        href: '/docs/technical',
    },
];

export default function TechnicalDocs() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Technical Documentation" />

            <div className="mx-auto max-w-5xl space-y-8 p-6">
                {/* Header */}
                <div className="rounded-xl border bg-linear-to-r from-purple-50 to-pink-50 p-8 dark:from-purple-950 dark:to-pink-950">
                    <h1 className="mb-2 text-4xl font-bold text-gray-900 dark:text-white">
                        🛠️ Technical Documentation
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                        Documentazione tecnica dell'applicazione TimeLine
                    </p>
                </div>

                {/* Stack Tecnologico */}
                <section className="rounded-xl border bg-white p-6 shadow-sm dark:bg-neutral-800">
                    <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                        📚 Stack Tecnologico
                    </h2>
                    
                    <div className="space-y-6">
                        {/* Backend */}
                        <div>
                            <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                                Backend
                            </h3>
                            <div className="grid gap-3 md:grid-cols-2">
                                <div className="rounded-lg border bg-red-50 p-4 dark:bg-red-950">
                                    <h4 className="mb-2 font-semibold text-red-900 dark:text-red-100">
                                        Laravel 11
                                    </h4>
                                    <p className="text-sm text-red-800 dark:text-red-200">
                                        Framework PHP per la gestione del backend, routing, database e autenticazione
                                    </p>
                                </div>
                                
                                <div className="rounded-lg border bg-purple-50 p-4 dark:bg-purple-950">
                                    <h4 className="mb-2 font-semibold text-purple-900 dark:text-purple-100">
                                        Inertia.js
                                    </h4>
                                    <p className="text-sm text-purple-800 dark:text-purple-200">
                                        Adapter per creare SPA con Laravel + React senza API
                                    </p>
                                </div>
                                
                                <div className="rounded-lg border bg-blue-50 p-4 dark:bg-blue-950">
                                    <h4 className="mb-2 font-semibold text-blue-900 dark:text-blue-100">
                                        SQLite
                                    </h4>
                                    <p className="text-sm text-blue-800 dark:text-blue-200">
                                        Database relazionale embedded per persistenza dati
                                    </p>
                                </div>
                                
                                <div className="rounded-lg border bg-orange-50 p-4 dark:bg-orange-950">
                                    <h4 className="mb-2 font-semibold text-orange-900 dark:text-orange-100">
                                        Laravel Fortify
                                    </h4>
                                    <p className="text-sm text-orange-800 dark:text-orange-200">
                                        Autenticazione, registrazione, 2FA e gestione password
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Frontend */}
                        <div>
                            <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                                Frontend
                            </h3>
                            <div className="grid gap-3 md:grid-cols-2">
                                <div className="rounded-lg border bg-cyan-50 p-4 dark:bg-cyan-950">
                                    <h4 className="mb-2 font-semibold text-cyan-900 dark:text-cyan-100">
                                        React 18 + TypeScript
                                    </h4>
                                    <p className="text-sm text-cyan-800 dark:text-cyan-200">
                                        Libreria UI con type-safety per componenti robusti
                                    </p>
                                </div>
                                
                                <div className="rounded-lg border bg-sky-50 p-4 dark:bg-sky-950">
                                    <h4 className="mb-2 font-semibold text-sky-900 dark:text-sky-100">
                                        Tailwind CSS
                                    </h4>
                                    <p className="text-sm text-sky-800 dark:text-sky-200">
                                        Framework CSS utility-first per styling rapido e consistente
                                    </p>
                                </div>
                                
                                <div className="rounded-lg border bg-violet-50 p-4 dark:bg-violet-950">
                                    <h4 className="mb-2 font-semibold text-violet-900 dark:text-violet-100">
                                        shadcn/ui
                                    </h4>
                                    <p className="text-sm text-violet-800 dark:text-violet-200">
                                        Componenti UI accessibili e personalizzabili
                                    </p>
                                </div>
                                
                                <div className="rounded-lg border bg-indigo-50 p-4 dark:bg-indigo-950">
                                    <h4 className="mb-2 font-semibold text-indigo-900 dark:text-indigo-100">
                                        Vite
                                    </h4>
                                    <p className="text-sm text-indigo-800 dark:text-indigo-200">
                                        Build tool veloce per sviluppo e produzione
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Architettura */}
                <section className="rounded-xl border bg-white p-6 shadow-sm dark:bg-neutral-800">
                    <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                        🏗️ Architettura
                    </h2>
                    
                    <div className="space-y-4">
                        <div className="rounded-lg bg-gray-50 p-4 dark:bg-neutral-900">
                            <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                                Pattern MVC con Inertia
                            </h3>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                L'applicazione segue il pattern MVC di Laravel dove i Controller gestiscono la logica, 
                                i Model rappresentano i dati, e le View sono componenti React renderizzati server-side 
                                con Inertia.js che elimina la necessità di API REST tradizionali.
                            </p>
                        </div>
                        
                        <div className="rounded-lg bg-gray-50 p-4 dark:bg-neutral-900">
                            <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                                SPA (Single Page Application)
                            </h3>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                Inertia.js permette navigazione client-side senza refresh della pagina, mantenendo 
                                lo state React e garantendo un'esperienza utente fluida.
                            </p>
                        </div>
                        
                        <div className="rounded-lg bg-gray-50 p-4 dark:bg-neutral-900">
                            <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                                Component-Based UI
                            </h3>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                L'interfaccia è costruita con componenti React riutilizzabili, organizzati in:
                                pages (pagine complete), components (componenti condivisi), layouts (strutture comuni).
                            </p>
                        </div>
                    </div>
                </section>

                {/* Database Schema */}
                <section className="rounded-xl border bg-white p-6 shadow-sm dark:bg-neutral-800">
                    <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                        🗄️ Database Schema
                    </h2>
                    
                    <div className="space-y-4">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b-2 border-gray-300 dark:border-gray-600">
                                        <th className="p-2 text-left">Tabella</th>
                                        <th className="p-2 text-left">Descrizione</th>
                                        <th className="p-2 text-left">Campi Principali</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    <tr className="border-b border-gray-200 dark:border-gray-700">
                                        <td className="p-2 font-mono">users</td>
                                        <td className="p-2">Utenti del sistema</td>
                                        <td className="p-2 text-xs">id, name, email, password</td>
                                    </tr>
                                    <tr className="border-b border-gray-200 dark:border-gray-700">
                                        <td className="p-2 font-mono">tasks</td>
                                        <td className="p-2">Task principali</td>
                                        <td className="p-2 text-xs">id, title, completed, user_id, expiration, completed_at</td>
                                    </tr>
                                    <tr className="border-b border-gray-200 dark:border-gray-700">
                                        <td className="p-2 font-mono">sub_tasks</td>
                                        <td className="p-2">Sotto-attività</td>
                                        <td className="p-2 text-xs">id, task_id, title, completed, completed_at</td>
                                    </tr>
                                    <tr className="border-b border-gray-200 dark:border-gray-700">
                                        <td className="p-2 font-mono">sessions</td>
                                        <td className="p-2">Sessioni utente</td>
                                        <td className="p-2 text-xs">id, user_id, ip_address, user_agent</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        
                        <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950">
                            <h3 className="mb-2 font-semibold text-blue-900 dark:text-blue-100">
                                Relazioni
                            </h3>
                            <ul className="list-disc space-y-1 pl-5 text-sm text-blue-800 dark:text-blue-200">
                                <li><code>users</code> → <code>tasks</code>: One-to-Many (un utente può avere molte task)</li>
                                <li><code>tasks</code> → <code>sub_tasks</code>: One-to-Many (una task può avere molte subtask)</li>
                                <li>Eliminazione CASCADE: cancellando una task si eliminano anche le sue subtask</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Features Implementate */}
                <section className="rounded-xl border bg-white p-6 shadow-sm dark:bg-neutral-800">
                    <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                        ✨ Features Implementate
                    </h2>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                Gestione Task
                            </h3>
                            <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700 dark:text-gray-300">
                                <li>CRUD completo (Create, Read, Update, Delete)</li>
                                <li>Assegnazione utenti</li>
                                <li>Date di scadenza e completamento</li>
                                <li>Validazione date coerenti</li>
                                <li>Statistiche real-time</li>
                                <li>Ricerca e filtraggio</li>
                                <li>Paginazione</li>
                            </ul>
                        </div>
                        
                        <div className="space-y-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                Gestione Subtask
                            </h3>
                            <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700 dark:text-gray-300">
                                <li>Aggiunta rapida da tabella</li>
                                <li>Gestione completa nel modal task</li>
                                <li>Pagina dettagli dedicata</li>
                                <li>Toggle stato completamento</li>
                                <li>Timeline attività</li>
                                <li>Navigazione fluida con modal persistence</li>
                            </ul>
                        </div>
                        
                        <div className="space-y-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                UI/UX
                            </h3>
                            <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700 dark:text-gray-300">
                                <li>Dark mode con persistenza</li>
                                <li>Responsive design</li>
                                <li>Modal interattive</li>
                                <li>Conferme eliminazione</li>
                                <li>Feedback visivi (hover, loading)</li>
                                <li>Breadcrumbs navigazione</li>
                            </ul>
                        </div>
                        
                        <div className="space-y-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                Autenticazione & Sicurezza
                            </h3>
                            <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700 dark:text-gray-300">
                                <li>Login/Registration</li>
                                <li>Password reset</li>
                                <li>Email verification</li>
                                <li>Two-Factor Authentication (2FA)</li>
                                <li>CSRF protection</li>
                                <li>Session management</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Struttura File */}
                <section className="rounded-xl border bg-white p-6 shadow-sm dark:bg-neutral-800">
                    <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                        📁 Struttura File Principale
                    </h2>
                    
                    <div className="space-y-3">
                        <div className="rounded-lg bg-gray-50 p-3 font-mono text-sm dark:bg-neutral-900">
                            <div className="text-gray-700 dark:text-gray-300">
                                <div>📂 <span className="font-bold">app/</span></div>
                                <div className="ml-4">📂 Http/Controllers/ - Controller Laravel</div>
                                <div className="ml-4">📂 Models/ - Eloquent models (Task, SubTask, User)</div>
                            </div>
                        </div>
                        
                        <div className="rounded-lg bg-gray-50 p-3 font-mono text-sm dark:bg-neutral-900">
                            <div className="text-gray-700 dark:text-gray-300">
                                <div>📂 <span className="font-bold">resources/</span></div>
                                <div className="ml-4">📂 js/pages/ - Pagine React/Inertia</div>
                                <div className="ml-4">📂 js/components/ - Componenti React riutilizzabili</div>
                                <div className="ml-4">📂 js/layouts/ - Layout comuni</div>
                                <div className="ml-4">📂 css/ - Stili globali</div>
                            </div>
                        </div>
                        
                        <div className="rounded-lg bg-gray-50 p-3 font-mono text-sm dark:bg-neutral-900">
                            <div className="text-gray-700 dark:text-gray-300">
                                <div>📂 <span className="font-bold">database/</span></div>
                                <div className="ml-4">📂 migrations/ - Schema database</div>
                                <div className="ml-4">📄 database.sqlite - Database SQLite</div>
                            </div>
                        </div>
                        
                        <div className="rounded-lg bg-gray-50 p-3 font-mono text-sm dark:bg-neutral-900">
                            <div className="text-gray-700 dark:text-gray-300">
                                <div>📂 <span className="font-bold">routes/</span></div>
                                <div className="ml-4">📄 web.php - Route principali</div>
                                <div className="ml-4">📄 settings.php - Route impostazioni</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* API Endpoints */}
                <section className="rounded-xl border bg-white p-6 shadow-sm dark:bg-neutral-800">
                    <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                        🔌 Principali Endpoints
                    </h2>
                    
                    <div className="space-y-2 overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="border-b-2">
                                <tr>
                                    <th className="p-2 text-left">Method</th>
                                    <th className="p-2 text-left">Endpoint</th>
                                    <th className="p-2 text-left">Descrizione</th>
                                </tr>
                            </thead>
                            <tbody className="text-xs">
                                <tr className="border-b">
                                    <td className="p-2"><code className="rounded bg-green-100 px-1 dark:bg-green-900">GET</code></td>
                                    <td className="p-2 font-mono">/dashboard</td>
                                    <td className="p-2">Dashboard principale</td>
                                </tr>
                                <tr className="border-b">
                                    <td className="p-2"><code className="rounded bg-green-100 px-1 dark:bg-green-900">GET</code></td>
                                    <td className="p-2 font-mono">/dashboardActivity</td>
                                    <td className="p-2">Vista tabellare task</td>
                                </tr>
                                <tr className="border-b">
                                    <td className="p-2"><code className="rounded bg-blue-100 px-1 dark:bg-blue-900">POST</code></td>
                                    <td className="p-2 font-mono">/tasks</td>
                                    <td className="p-2">Crea nuova task</td>
                                </tr>
                                <tr className="border-b">
                                    <td className="p-2"><code className="rounded bg-yellow-100 px-1 dark:bg-yellow-900">PATCH</code></td>
                                    <td className="p-2 font-mono">/tasks/{'{task}'}</td>
                                    <td className="p-2">Aggiorna task</td>
                                </tr>
                                <tr className="border-b">
                                    <td className="p-2"><code className="rounded bg-red-100 px-1 dark:bg-red-900">DELETE</code></td>
                                    <td className="p-2 font-mono">/tasks/{'{task}'}</td>
                                    <td className="p-2">Elimina task</td>
                                </tr>
                                <tr className="border-b">
                                    <td className="p-2"><code className="rounded bg-blue-100 px-1 dark:bg-blue-900">POST</code></td>
                                    <td className="p-2 font-mono">/tasks/{'{task}'}/subtasks</td>
                                    <td className="p-2">Crea subtask</td>
                                </tr>
                                <tr className="border-b">
                                    <td className="p-2"><code className="rounded bg-yellow-100 px-1 dark:bg-yellow-900">PATCH</code></td>
                                    <td className="p-2 font-mono">/subtasks/{'{subtask}'}</td>
                                    <td className="p-2">Aggiorna subtask</td>
                                </tr>
                                <tr className="border-b">
                                    <td className="p-2"><code className="rounded bg-yellow-100 px-1 dark:bg-yellow-900">PATCH</code></td>
                                    <td className="p-2 font-mono">/subtasks/{'{subtask}'}/toggle</td>
                                    <td className="p-2">Toggle completamento</td>
                                </tr>
                                <tr className="border-b">
                                    <td className="p-2"><code className="rounded bg-green-100 px-1 dark:bg-green-900">GET</code></td>
                                    <td className="p-2 font-mono">/subtasks/{'{subtask}'}/info</td>
                                    <td className="p-2">Dettagli subtask</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Setup & Development */}
                <section className="rounded-xl border bg-white p-6 shadow-sm dark:bg-neutral-800">
                    <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                        🚀 Setup & Development
                    </h2>
                    
                    <div className="space-y-4">
                        <div>
                            <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                                Requisiti
                            </h3>
                            <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700 dark:text-gray-300">
                                <li>PHP 8.2+</li>
                                <li>Composer</li>
                                <li>Node.js 18+ & npm</li>
                                <li>SQLite extension abilitata</li>
                            </ul>
                        </div>
                        
                        <div>
                            <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                                Installazione
                            </h3>
                            <div className="space-y-2 rounded-lg bg-gray-900 p-4 font-mono text-sm text-gray-100">
                                <div><span className="text-green-400"># Clone repository</span></div>
                                <div>git clone [repository-url]</div>
                                <div className="mt-3"><span className="text-green-400"># Install dependencies</span></div>
                                <div>composer install</div>
                                <div>npm install</div>
                                <div className="mt-3"><span className="text-green-400"># Setup environment</span></div>
                                <div>cp .env.example .env</div>
                                <div>php artisan key:generate</div>
                                <div className="mt-3"><span className="text-green-400"># Database</span></div>
                                <div>touch database/database.sqlite</div>
                                <div>php artisan migrate</div>
                                <div className="mt-3"><span className="text-green-400"># Run dev server</span></div>
                                <div>php artisan serve</div>
                                <div>npm run dev</div>
                            </div>
                        </div>
                        
                        <div>
                            <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                                Build Produzione
                            </h3>
                            <div className="rounded-lg bg-gray-900 p-4 font-mono text-sm text-gray-100">
                                <div>npm run build</div>
                                <div>php artisan optimize</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Performance & Best Practices */}
                <section className="rounded-xl border bg-white p-6 shadow-sm dark:bg-neutral-800">
                    <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                        ⚡ Performance & Best Practices
                    </h2>
                    
                    <div className="space-y-3">
                        <div className="rounded-lg bg-green-50 p-4 dark:bg-green-950">
                            <h3 className="mb-2 font-semibold text-green-900 dark:text-green-100">
                                Ottimizzazioni Implementate
                            </h3>
                            <ul className="list-disc space-y-1 pl-5 text-sm text-green-800 dark:text-green-200">
                                <li>Eager loading delle relazioni (with('user', 'subtasks'))</li>
                                <li>Paginazione lato server</li>
                                <li>Inertia partial reloads (solo i dati necessari)</li>
                                <li>React component memoization dove necessario</li>
                                <li>Debouncing ricerche</li>
                                <li>Lazy loading delle pagine</li>
                            </ul>
                        </div>
                        
                        <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950">
                            <h3 className="mb-2 font-semibold text-blue-900 dark:text-blue-100">
                                Best Practices Seguite
                            </h3>
                            <ul className="list-disc space-y-1 pl-5 text-sm text-blue-800 dark:text-blue-200">
                                <li>Type-safety completo con TypeScript</li>
                                <li>Component composition React</li>
                                <li>Gestione stato locale vs props</li>
                                <li>Validazione server-side e client-side</li>
                                <li>CSRF protection su tutti i form</li>
                                <li>Sanitizzazione input utente</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Manutenzione */}
                <section className="rounded-xl border bg-linear-to-r from-red-50 to-orange-50 p-6 dark:from-red-950 dark:to-orange-950">
                    <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                        🔧 Manutenzione & Troubleshooting
                    </h2>
                    
                    <div className="space-y-3">
                        <div>
                            <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                                Comandi Utili
                            </h3>
                            <div className="space-y-1 rounded-lg bg-gray-900 p-4 font-mono text-xs text-gray-100">
                                <div><span className="text-green-400"># Clear cache</span></div>
                                <div>php artisan cache:clear</div>
                                <div>php artisan config:clear</div>
                                <div>php artisan route:clear</div>
                                <div className="mt-2"><span className="text-green-400"># Reset database</span></div>
                                <div>php artisan migrate:fresh</div>
                                <div className="mt-2"><span className="text-green-400"># Check logs</span></div>
                                <div>tail -f storage/logs/laravel.log</div>
                            </div>
                        </div>
                        
                        <div>
                            <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                                Problemi Comuni
                            </h3>
                            <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700 dark:text-gray-300">
                                <li><strong>Assets non caricano:</strong> Esegui <code>npm run build</code></li>
                                <li><strong>Errori 500:</strong> Controlla <code>storage/logs/laravel.log</code></li>
                                <li><strong>Database locked:</strong> Chiudi connessioni SQLite aperte</li>
                                <li><strong>Session expired:</strong> Verifica configurazione session driver</li>
                            </ul>
                        </div>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}