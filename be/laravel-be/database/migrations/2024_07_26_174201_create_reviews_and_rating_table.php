<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reviewsandratings', function (Blueprint $table) {
            $table->increments('rid');
            $table->unsignedInteger('userid');
            $table->foreign('userid')->references('userid')->on('users');
            $table->unsignedInteger('propertyid');
            $table->foreign('propertyid')->references('propertyid')->on('property');
            $table->integer('rating')->nullable();
            $table->text('review')->nullable();
            $table->string('unitname')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviewsandratings');
    }
};
