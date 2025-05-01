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
        Schema::create('bedroomtype', function (Blueprint $table) {
            $table->increments('bedroomid');
            $table->unsignedInteger('unitroomid');
            $table->foreign('unitroomid')->references('unitroomid')->on('unitrooms');
            $table->string('bedroomnum');
            $table->integer('singlebed')->default(0);
            $table->integer('bunkbed')->default(0);
            $table->integer('largebed')->default(0);
            $table->integer('superlargebed')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bedroomtype');
    }
};
