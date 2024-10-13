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
        Schema::create('monthly_payment', function (Blueprint $table) {
            $table->id('mpid');
            $table->unsignedInteger('userid');
            $table->unsignedInteger('bookingid');
            $table->double('amount_due');
            $table->double('amount_paid');
            $table->string('status');
            $table->date('due_date');
            $table->int('bhid')->nullable();
            $table->timestamps();

            $table->foreign('userid')->references('userid')->on('users');
            $table->foreign('bookingid')->references('bookingid')->on('tbl_booking');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('monthly_payment');
    }
};
