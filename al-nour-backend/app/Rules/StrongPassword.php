<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class StrongPassword implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        // Minimum 8 characters
        if (strlen($value) < 8) {
            $fail('The :attribute must be at least 8 characters.');
            return;
        }

        // At least one uppercase letter
        if (!preg_match('/[A-Z]/', $value)) {
            $fail('The :attribute must contain at least one uppercase letter.');
            return;
        }

        // At least one lowercase letter
        if (!preg_match('/[a-z]/', $value)) {
            $fail('The :attribute must contain at least one lowercase letter.');
            return;
        }

        // At least one number
        if (!preg_match('/[0-9]/', $value)) {
            $fail('The :attribute must contain at least one number.');
            return;
        }

        // At least one special character
        if (!preg_match('/[@$!%*?&#^()_+=\-\[\]{}|;:,.<>~]/', $value)) {
            $fail('The :attribute must contain at least one special character (@$!%*?&#^()_+=-[]{}|;:,.<>~).');
            return;
        }
    }

    /**
     * Get the validation error message (for older Laravel versions).
     *
     * @return string
     */
    public function message(): string
    {
        return 'The :attribute must be at least 8 characters and contain uppercase, lowercase, number, and special character.';
    }
}
