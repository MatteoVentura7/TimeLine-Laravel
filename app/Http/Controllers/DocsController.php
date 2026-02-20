<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class DocsController extends Controller
{
    public function userGuide()
    {
        return Inertia::render('docs/user-guide');
    }

    public function technical()
    {
        return Inertia::render('docs/technical');
    }
}