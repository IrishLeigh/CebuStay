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
        Schema::create('house_rules', function (Blueprint $table) {
            $table->increments('houserulesid');
            $table->unsignedInteger('propertyid');
            $table->foreign('propertyid')->references('propertyid')->on('property');
            $table->boolean('smoking_allowed')->default(false);
            $table->boolean('pets_allowed')->default(false);
            $table->boolean('parties_events_allowed')->default(false);
            $table->string('noise_restrictions')->nullable();
            $table->time('quiet_hours_start')->nullable();
            $table->time('quiet_hours_end')->nullable();
            $table->text('custom_rules')->nullable();
            $table->time('check_in_from')->nullable();
            $table->time('check_in_until')->nullable();
            $table->time('check_out_from')->nullable();
            $table->time('check_out_until')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('house_rules');
    }
};
