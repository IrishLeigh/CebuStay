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
        Schema::create('tbl_bookinghistory', function (Blueprint $table) {
            $table->increments('bhid');
            $table->unsignedInteger('userid');
            $table->unsignedInteger('propertyid');
            $table->unsignedInteger('unitid');
            $table->unsignedInteger('bookerid');
            $table->unsignedInteger('guestid');
            $table->unsignedInteger('pid')->nullable(true);

            $table->integer('stay_length');
            $table->integer('guest_count');
            $table->date('checkin_date');
            $table->date('checkout_date');
            $table->double('total_price');
            $table->string('special_request')->nullable(true);
            $table->time('arrival_time');
            $table->string('status');
            $table->date('booking_date');
            $table->enum('type', ['reservation', 'booking']);
            $table->enum('check_type', ['checkin', 'checkout']);

            $table->foreign('userid')->references('userid')->on('users');
            $table->foreign('propertyid')->references('propertyid')->on('property');
            $table->foreign('unitid')->references('unitid')->on('unitdetails');
            $table->foreign('bookerid')->references('bookerid')->on('tbl_booker');
            $table->foreign('guestid')->references('guestid')->on('tbl_guest');
            $table->foreign('pid')->references('pid')->on('tbl_payment');

            $table->index(['userid', 'propertyid', 'bookerid', 'guestid', 'pid']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tbl_bookinghistory');
    }
};
