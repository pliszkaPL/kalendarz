<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CalendarGroup extends Model
{
    use HasUuids;

    protected $table = 'calendar_groups';

    protected $fillable = [
        'id',
        'user_id',
        'name',
        'color',
        'tags',
        'description',
    ];

    protected $casts = [
        'tags' => 'array',
    ];

    /**
     * Get the user that owns the group
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
