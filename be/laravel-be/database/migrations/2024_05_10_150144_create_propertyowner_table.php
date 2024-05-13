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
        Schema::create('property_owner', function (Blueprint $table) {
            $table->increments('propertyownerid');
            $table->unsignedInteger('propertyownershipid');
            $table->foreign('propertyownershipid')->references('propertyownershipid')->on('property_ownership');
            $table->unsignedInteger('propertycalendarid');
            $table->foreign('propertycalendarid')->references('propertycalendarid')->on('propertycalendar');
            $table->string('firstname');
            $table->string('lastname');
            $table->string('displayname');
            $table->date('dateofbirth');
            $table->string('contactnumber');
            $table->string('language');
            $table->string('email');
            $table->string('country_region');
            $table->string('province');
            $table->string('city');
            $table->string('primary_address');
            $table->string('zipcode');
            $table->string('nationality');
            $table->string('describe');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('property_owner');
    }
};
