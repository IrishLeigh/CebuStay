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
        Schema::create('tbl_userimg', function (Blueprint $table) {
            $table->increments('userimg_id');
            $table->unsignedInteger('userid');
            $table->foreign('userid')->references('userid')->on('users');
            $table->string('file_name');
            $table->string('file_id');
            $table->string('file_url');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('userimg');
    }
};
