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
        Schema::create('tbl_payout', function (Blueprint $table) {
            $table->id('payout_id'); 
            $table->unsignedBigInteger('userid'); 
            $table->unsignedBigInteger('propertyid'); 
            $table->unsignedBigInteger('pid'); 
            $table->date('payout_date'); 
            $table->string('status'); 
            $table->string('batch_id')->nullable(); 
            $table->string('item_id')->nullable();
            
            $table->timestamps();
    
            $table->foreign('userid')->references('userid')->on('users'); 
            $table->foreign('propertyid')->references('propertyid')->on('property'); 
            $table->foreign('pid')->references('pid')->on('tbl_payment'); 
        });
    }
    

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tbl_payout');
    }
};
