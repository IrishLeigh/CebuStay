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
            $table->string('firstname');
            $table->string('lastname');
            $table->string('displayname');
            $table->date('dateofbirth');
            $table->string('contactnumber');
            $table->string('email');
            $table->string('street');
            $table->string('barangay');
            $table->string('city');
            $table->string('primary_address') ->nullable(); 
            $table->string('zipcode');
            $table->string('describe');
            $table->string('calendar');

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
