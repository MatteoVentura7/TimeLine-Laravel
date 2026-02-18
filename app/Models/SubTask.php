<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SubTask extends Model
{
    protected $fillable = [
        'task_id',
        'title',
        'completed',
        'completed_at',
    ];

    protected $casts = [
        'completed' => 'boolean',
        'completed_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function task()
    {
        return $this->belongsTo(Task::class);
    }
}