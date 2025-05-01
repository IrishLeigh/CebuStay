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
        Schema::create('tbl_payment', function (Blueprint $table) {
            $table->increments('pid');
            $table->unsignedInteger('bookingid');
            $table->foreign('bookingid')->references('bookingid')->on('tbl_booking');
            $table->string('paymentid');
            $table->string('linkid');
            $table->double('amount');
            $table->double('refund_amount')->nullable(0);
            $table->string('description');
            $table->string('status');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tbl_payment');
    }
};
