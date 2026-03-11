<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TaskFile extends Model
{
    protected $fillable = [
        'task_id',
        'original_name',
        'stored_name',
        'path',
        'mime_type',
        'size',
    ];

    protected $appends = ['url'];

    public function task()
    {
        return $this->belongsTo(Task::class);
    }

    public function getUrlAttribute()
    {
        return route('task-files.download', $this->id);
    }
}
