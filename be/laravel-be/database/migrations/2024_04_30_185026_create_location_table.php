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
        Schema::create('location', function (Blueprint $table) {
            $table->increments('locationid');
            $table->unsignedInteger('propertyid');
            $table->foreign('propertyid')->references('propertyid')->on('property');
            $table->string('country');
            $table->string('city');
            $table->string('address');
            $table->string('zipcode');
            $table->string('pinloc');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('location');
    }
};
