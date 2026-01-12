<?php

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
        Schema::create('messages', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('chat_session_id');
            $table->foreign('chat_session_id')->references('id')->on('chat_sessions')->onDelete('cascade');
            $table->enum('role', ['user', 'assistant']); 
            $table->text('content'); 
            $table->json('suggested_category_slugs')->nullable(); 
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
