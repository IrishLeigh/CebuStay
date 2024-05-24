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
            $table->boolean('is_cancel_plan')->default(false);
            $table->integer('cancel_days')->nullable(true);
            $table->boolean('non_refundable');
            $table->boolean('modification_plan');
            $table->boolean('offer_discount');
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
