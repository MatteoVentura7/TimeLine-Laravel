import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'User Guide',
        href: '/docs/user-guide',
    },
];

export default function UserGuide() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User Guide" />

            <div className="mx-auto max-w-5xl space-y-8 p-6">
                {/* Header */}
                <div className="rounded-xl border bg-linear-to-r from-blue-50 to-indigo-50 p-8 dark:from-blue-950 dark:to-indigo-950">
                    <h1 className="mb-2 text-4xl font-bold text-gray-900 dark:text-white">
                        📖 User Guide
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                        Guida completa all'utilizzo dell'applicazione TimeLine
                    </p>
                </div>

                {/* Panoramica */}
                <section className="rounded-xl border bg-white p-6 shadow-sm dark:bg-neutral-800">
                    <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                        🎯 Panoramica
                    </h2>
                    <p className="mb-4 text-gray-700 dark:text-gray-300">
                        TimeLine è un'applicazione di gestione task e progetti che ti permette di:
                    </p>
                    <ul className="list-disc space-y-2 pl-6 text-gray-700 dark:text-gray-300">
                        <li>Creare e gestire attività (task) con date di scadenza</li>
                        <li>Organizzare task complesse con sotto-attività (subtask)</li>
                        <li>Assegnare task ai membri del team</li>
                        <li>Monitorare lo stato di completamento</li>
                        <li>Visualizzare statistiche e progressi</li>
                    </ul>
                </section>

                {/* Dashboard */}
                <section className="rounded-xl border bg-white p-6 shadow-sm dark:bg-neutral-800">
                    <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                        🏠 Dashboard
                    </h2>
                    <p className="mb-4 text-gray-700 dark:text-gray-300">
                        La dashboard è la schermata principale e offre una vista d'insieme delle tue attività:
                    </p>
                    <div className="space-y-4">
                        <div className="rounded-lg border-l-4 border-blue-500 bg-blue-50 p-4 dark:bg-blue-950">
                            <h3 className="mb-2 font-semibold text-blue-900 dark:text-blue-100">
                                Lista Task Recenti
                            </h3>
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                                Visualizza le ultime 5 task create. Clicca su una task per aprire i dettagli completi.
                            </p>
                        </div>
                        <div className="rounded-lg border-l-4 border-green-500 bg-green-50 p-4 dark:bg-green-950">
                            <h3 className="mb-2 font-semibold text-green-900 dark:text-green-100">
                                Form Creazione Task
                            </h3>
                            <p className="text-sm text-green-800 dark:text-green-200">
                                Crea rapidamente nuove task inserendo titolo, utente assegnato, data di inizio e scadenza.
                            </p>
                        </div>
                        <div className="rounded-lg border-l-4 border-purple-500 bg-purple-50 p-4 dark:bg-purple-950">
                            <h3 className="mb-2 font-semibold text-purple-900 dark:text-purple-100">
                                Statistiche
                            </h3>
                            <p className="text-sm text-purple-800 dark:text-purple-200">
                                Grafico che mostra il rapporto tra task completate e da completare.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Activity */}
                <section className="rounded-xl border bg-white p-6 shadow-sm dark:bg-neutral-800">
                    <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                        📋 Activity (Gestione Task)
                    </h2>
                    <div className="space-y-4">
                        <p className="text-gray-700 dark:text-gray-300">
                            La pagina Activity mostra tutte le task in una tabella dettagliata:
                        </p>
                        
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Funzionalità principali:
                        </h3>
                        
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <span className="text-2xl">✅</span>
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white">Completamento Task</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Clicca sulla checkbox per segnare una task come completata. Ti verrà chiesto di inserire data e ora di completamento.
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                                <span className="text-2xl">➕</span>
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white">Aggiunta Rapida Subtask</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Clicca l'icona verde "+" per aggiungere velocemente una subtask senza aprire il modal completo.
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                                <span className="text-2xl">ℹ️</span>
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white">Dettagli Task</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Clicca l'icona info per aprire il modal con tutti i dettagli, subtask e possibilità di modifica.
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                                <span className="text-2xl">🗑️</span>
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white">Eliminazione</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Clicca l'icona cestino per eliminare definitivamente una task (con conferma).
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                                <span className="text-2xl">🔍</span>
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white">Ricerca</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Usa la barra di ricerca in alto per filtrare task per titolo. 
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Modal Task */}
                <section className="rounded-xl border bg-white p-6 shadow-sm dark:bg-neutral-800">
                    <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                        🔧 Modal Dettagli Task
                    </h2>
                    <p className="mb-4 text-gray-700 dark:text-gray-300">
                        Il modal dei dettagli ti permette di gestire completamente una task:
                    </p>
                    
                    <div className="space-y-4">
                        <div className="rounded-lg bg-gray-50 p-4 dark:bg-neutral-900">
                            <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                                Modalità Visualizzazione
                            </h3>
                            <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700 dark:text-gray-300">
                                <li>Vedi titolo, utente assegnato e stato</li>
                                <li>Date di creazione, scadenza e completamento</li>
                                <li>Lista delle subtask con possibilità di gestirle</li>
                            </ul>
                        </div>
                        
                        <div className="rounded-lg bg-gray-50 p-4 dark:bg-neutral-900">
                            <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                                Modalità Modifica (Click su "Edit")
                            </h3>
                            <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700 dark:text-gray-300">
                                <li>Modifica titolo e utente assegnato</li>
                                <li>Cambia stato di completamento (con validazione date)</li>
                                <li>Modifica date di creazione, scadenza e completamento</li>
                                <li>Il sistema valida che le date siano coerenti</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Subtask */}
                <section className="rounded-xl border bg-white p-6 shadow-sm dark:bg-neutral-800">
                    <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                        📝 Gestione Subtask
                    </h2>
                    <div className="space-y-4">
                        <p className="text-gray-700 dark:text-gray-300">
                            Le subtask sono sotto-attività che compongono una task principale:
                        </p>
                        
                        <div className="space-y-3">
                            <div>
                                <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                                    Nel Modal Task:
                                </h3>
                                <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700 dark:text-gray-300">
                                    <li>Clicca "Subtasks (^)" per espandere/comprimere la lista</li>
                                    <li>Clicca "+ Add subtask" per aggiungerne una nuova</li>
                                    <li>Checkbox per completare/scompletare</li>
                                    <li>Icona info (ℹ️) per vedere dettagli e modificare</li>
                                    <li>Icona cestino per eliminare (con conferma)</li>
                                </ul>
                            </div>
                            
                            <div>
                                <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                                    Pagina Dettagli Subtask:
                                </h3>
                                <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700 dark:text-gray-300">
                                    <li>Visualizza task di appartenenza</li>
                                    <li>Stato completamento (clicca per cambiarlo)</li>
                                    <li>Timeline con date di creazione, modifica e completamento</li>
                                    <li>Bottone "Edit" per modificare il titolo</li>
                                    <li>Bottone "Delete" per eliminarla (con conferma)</li>
                                    <li>Bottone "← Back" per tornare all'Activity con il modal già aperto</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Tips */}
                <section className="rounded-xl border bg-linear-to-r from-amber-50 to-yellow-50 p-6 dark:from-amber-950 dark:to-yellow-950">
                    <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                        💡 Tips & Tricks
                    </h2>
                    <div className="space-y-3">
                        <div className="flex items-start gap-3">
                            <span className="text-xl">🚀</span>
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white">
                                    Aggiunta Rapida
                                </h4>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    Usa il bottone verde "+" nella tabella Activity per aggiungere subtask senza aprire il modal completo della task.
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                            <span className="text-xl">🔄</span>
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white">
                                    Navigazione Fluida
                                </h4>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    Quando torni indietro dalla pagina dettagli subtask, il modal della task madre si riapre automaticamente.
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                            <span className="text-xl">📊</span>
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white">
                                    Statistiche Real-time
                                </h4>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    Le statistiche nella dashboard si aggiornano in tempo reale quando completi o crei task.
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                            <span className="text-xl">🎨</span>
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white">
                                    Dark Mode
                                </h4>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    Cambia tema dalla sidebar cliccando sull'icona sole/luna per passare tra modalità chiara e scura.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Support */}
                <section className="rounded-xl border bg-white p-6 shadow-sm dark:bg-neutral-800">
                    <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                        🆘 Supporto
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300">
                        Per problemi tecnici o domande sull'utilizzo dell'applicazione, contatta l'amministratore di sistema.
                    </p>
                </section>
            </div>
        </AppLayout>
    );
}