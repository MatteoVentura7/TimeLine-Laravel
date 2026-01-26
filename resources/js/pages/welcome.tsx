import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome({ canRegister = true }: { canRegister?: boolean }) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700"
                    rel="stylesheet"
                />
            </Head>

            <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                {/* NAVBAR */}
                <header className="w-full py-4 px-6 lg:px-12 flex justify-end items-center border-b border-gray-200 dark:border-gray-700">
                    {auth.user ? (
                        <Link
                            href={dashboard()}
                            className="rounded-lg border border-transparent bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 transition-colors"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <div className="flex gap-4">
                            <Link
                                href={login()}
                                className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800 transition"
                            >
                                Log in
                            </Link>
                            {canRegister && (
                                <Link
                                    href={register()}
                                    className="rounded-lg border border-blue-600 bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 transition"
                                >
                                    Register
                                </Link>
                            )}
                        </div>
                    )}
                </header>

                {/* HERO */}
                <main className="flex flex-1 flex-col-reverse lg:flex-row items-center justify-between max-w-6xl mx-auto px-6 lg:px-12 py-12 gap-12">
                    {/* TESTO HERO */}
                    <div className="flex flex-col gap-6 text-center lg:text-left lg:max-w-lg">
                        <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                            Welcome to <span className="text-blue-600 dark:text-blue-400">Argomedia</span>
                        </h1>
                        <p className="text-lg text-gray-700 dark:text-gray-300">
                            Manage your activities simply, quickly and professionally. Everything you need to organize your work in one place.
                        </p>
                        {!auth.user && (
                            <div className="flex justify-center lg:justify-start gap-4">
                                <Link
                                    href={login()}
                                    className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800 transition"
                                >
                                    Log in
                                </Link>
                                {canRegister && (
                                    <Link
                                        href={register()}
                                        className="rounded-lg border border-blue-600 bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 transition"
                                    >
                                        Register
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>

                    {/* IMMAGINE HERO */}
                    <div className="relative w-full max-w-md lg:max-w-lg">
                        <div className="rounded-xl overflow-hidden shadow-lg bg-white dark:bg-gray-800">
                            <img
                                src="/LOGO_ARGOMEDIA.png"
                                alt="Argomedia Logo"
                                className="w-full h-auto object-contain p-6"
                            />
                        </div>
                    </div>
                </main>

                {/* FOOTER */}
                <footer className="py-6 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
                    &copy; {new Date().getFullYear()} Argomedia. All rights reserved.
                </footer>
            </div>
        </>
    );
}
