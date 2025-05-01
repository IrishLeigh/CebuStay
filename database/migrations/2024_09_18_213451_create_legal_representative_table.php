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
        Schema::create('legal_representative', function (Blueprint $table) {
            $table->increments('legalrepresentativeid');
            $table->unsignedInteger('propertycompanyid');
            $table->foreign('propertycompanyid')->references('propertycompanyid')->on('property_company')->onDelete('cascade');
            $table->string('firstname');
            $table->string('lastname');
            $table->string('email');
            $table->string('phone_number');
            $table->string('position');
            $table->date('date_of_birth');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('legal_representative');
    }
};
