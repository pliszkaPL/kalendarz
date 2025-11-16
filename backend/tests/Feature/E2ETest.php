<?php

test('e2e registration tests pass', function () {
    $output = [];
    $returnCode = 0;
    
    exec('cd ' . base_path('../e2e-tests') . ' && npm test -- tests/registration.spec.js 2>&1', $output, $returnCode);
    
    $outputString = implode("\n", $output);
    echo $outputString;
    
    expect($returnCode)->toBe(0, "E2E registration tests failed:\n" . $outputString);
})->group('e2e');

test('e2e authentication tests pass', function () {
    $output = [];
    $returnCode = 0;
    
    exec('cd ' . base_path('../e2e-tests') . ' && npm test -- tests/authentication.spec.js 2>&1', $output, $returnCode);
    
    $outputString = implode("\n", $output);
    echo $outputString;
    
    expect($returnCode)->toBe(0, "E2E authentication tests failed:\n" . $outputString);
})->group('e2e');
