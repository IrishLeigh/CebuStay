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
        Schema::create('booking_policy', function (Blueprint $table) {
            $table->increments('bookingpolicyid');
            $table->unsignedInteger('propertyid');
            $table->foreign('propertyid')->references('propertyid')->on('property');
            $table->boolean('isCancellationPolicy');
            $table->integer('cancellationDays')->nullable(true);
            $table->integer('cancellationCharge')->nullable(true);
            $table->boolean('isModificationPolicy');
            $table->integer('modificationDays')->nullable(true);
            $table->integer('modificationCharge')->nullable(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookingpolicy');
    }
};
