<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CalendarEntry extends Model
{
    use HasUuids;

    protected $table = 'calendar_entries';

    protected $fillable = [
        'id',
        'user_id',
        'name',
        'date',
        'icon',
        'background_color',
        'text_color',
        'template_id',
        'group_id',
        'tags',
        'description',
        'recurrence',
        'custom_data',
        'is_archived',
    ];

    protected $casts = [
        'date' => 'date',
        'tags' => 'array',
        'recurrence' => 'array',
        'custom_data' => 'array',
        'is_archived' => 'boolean',
    ];

    /**
     * Get the user that owns the entry
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
