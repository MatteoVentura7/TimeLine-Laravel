<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Task extends Model
{
    protected $fillable = [
        'title',
        'completed',
        'user_id',
        'completed_at',
        'expiration',

    ];

    protected $casts = [
        'completed'    => 'boolean',
        'created_at'   => 'datetime',
        'updated_at'   => 'datetime',
        'completed_at' => 'datetime',
        'expiration' => 'datetime',  
    ];

    protected $appends = [
        'created_at_formatted',
        'completed_at_formatted',
        'created_at_iso',
        'expiration_formatted'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /* ======================
       Accessors (Carbon)
       ====================== */

    public function getCreatedAtFormattedAttribute()
    {
        return $this->created_at
            ? $this->created_at->setTimezone('Europe/Rome')->format('d/m/Y H:i')
            : null;
    }

    public function getCompletedAtFormattedAttribute()
    {
        return $this->completed_at
            ? $this->completed_at->setTimezone('Europe/Rome')->format('d/m/Y H:i')
            : null;
    }

    public function getCreatedAtIsoAttribute()
{
    return $this->created_at
        ? $this->created_at->utc()->toISOString()
        : null;
}

    public function getExpirationFormattedAttribute ()
{
    return $this->expiration
        ? $this->expiration->setTimezone('Europe/Rome')->format('d/m/Y H:i')
        : null;
}

}
