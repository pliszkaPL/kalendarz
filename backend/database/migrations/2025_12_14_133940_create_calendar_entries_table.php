<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('calendar_entries', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name', 255);
            $table->date('date');
            $table->string('icon', 10)->nullable(); // emoji
            $table->string('background_color', 7); // hex color
            $table->string('text_color', 7); // hex color
            $table->uuid('template_id')->nullable();
            $table->uuid('group_id')->nullable();
            $table->json('tags')->nullable();
            $table->text('description')->nullable();
            $table->json('recurrence')->nullable(); // RecurrenceRule as JSON
            $table->json('custom_data')->nullable();
            $table->boolean('is_archived')->default(false);
            $table->timestamps();
            
            $table->index(['user_id', 'date']);
            $table->index('group_id');
            $table->index('template_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('calendar_entries');
    }
};
