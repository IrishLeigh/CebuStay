<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\HouseRule;

class HouseRuleController extends Controller
{
    /**
     * Update house rules.
     *
     * @param Request $request
     * @param int $propertyId
     * @return \Illuminate\Http\JsonResponse
     */
    public function create(Request $request)
    {
        $this->enableCors($request);
        $houseRule = new HouseRule();
        

        if (!$houseRule) {
            return response()->json(['message' => 'House rule not found for the given property id.'], 404);
        }

        // Retrieve custom rules from request
        $customRules = $request->input('custom_rules', '');

        // Process custom rules to separate lines
        $customRulesArray = explode("\n", $customRules);

        // Remove empty lines
        $customRulesArray = array_filter($customRulesArray, 'strlen');

        // Join lines back with new lines
        $houseRule->custom_rules = implode("\n", $customRulesArray);

        $houseRule->propertyid = $request->input('propertyid');
        $houseRule->smoking_allowed = $request->input('smoking_allowed');
        $houseRule->pets_allowed = $request->input('pets_allowed');
        $houseRule->parties_events_allowed = $request->input('parties_events_allowed');
        $houseRule->noise_restrictions = $request->input('noise_restrictions');
        $houseRule->quiet_hours_start = $request->input('quiet_hours_start');
        $houseRule->quiet_hours_end = $request->input('quiet_hours_end');
        $houseRule->check_in_from = $request->input('check_in_from');
        $houseRule->check_in_until = $request->input('check_in_until');
        $houseRule->check_out_from = $request->input('check_out_from');
        $houseRule->check_out_until = $request->input('check_out_until');

        $houseRule->save();

        return response()->json([
            'status' => 'Success.',
            'message' => 'House rule updated successfully.',
            'houseRule' => $houseRule,
        ]);
    }
}
