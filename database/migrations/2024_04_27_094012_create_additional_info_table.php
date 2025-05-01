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
        Schema::create('additional_info', function (Blueprint $table) {
            $table->increments('addid');
            $table->unsignedInteger('userid');
            $table->foreign('userid')->references('userid')->on('users');
            $table->string('payment_method_type')->nullable();
            $table->string('e_wallet_account')->nullable();
            $table->string('mastercard_number')->nullable();
            $table->unsignedSmallInteger('mastercard_expiration_month')->nullable();
            $table->unsignedSmallInteger('mastercard_expiration_year')->nullable();
            $table->string('mastercard_cvv', 4)->nullable();
            $table->string('cellphone_number', 20)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('additional_info');
    }
};
