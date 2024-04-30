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
        Schema::create('amenity', function (Blueprint $table) {
            $table->increments('amenityid');
            $table->unsignedInteger('propertyid');
            $table->foreign('propertyid')->references('propertyid')->on('property');
            $table->string('amenity_name');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('amenity');
    }
};
