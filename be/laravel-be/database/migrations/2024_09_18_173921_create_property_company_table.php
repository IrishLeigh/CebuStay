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
        Schema::create('property_company', function (Blueprint $table) {
            $table->increments('propertycompanyid');
            $table->unsignedInteger('propertyownershipid');
            $table->foreign('propertyownershipid')->references('propertyownershipid')->on('property_ownership')->onDelete('cascade');
            $table->string('legal_business_name');
            $table->text('company_description');
            $table->string('company_photo')->nullable(); // Assuming this might store a URL or file path
            $table->string('street');
            $table->string('barangay');
            $table->string('city');
            $table->string('zipcode');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('property_company');
    }
};
