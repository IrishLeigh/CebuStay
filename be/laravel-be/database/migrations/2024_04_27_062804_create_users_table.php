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
        Schema::create('users', function (Blueprint $table) {
            $table->increments('userid');
            $table->string('firstname');
            $table->string('lastname');
            $table->string('email')->unique();
            $table->string('password');
            $table->string('cellnumber')->nullable();
            $table->string('accounttype')->default('tourist');
            $table->boolean('isverified')->default(false);
            $table->string('verificationtoken')->nullable();
            $table->datetime('verification_token_expires_at')->nullable();
            $table->date('birthday')->nullable(); 
            $table->string('country')->nullable(); 
            $table->string('paypalmail')->nullable();
            $table->string('paypalphonenumber')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
