<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePaymentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Only admins can update payments
        return $this->user() && $this->user()->isAdmin();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'student_id' => ['sometimes', 'required', 'integer', 'exists:students,id'],
            'fee_type_id' => ['sometimes', 'nullable', 'integer', 'exists:fee_types,id'],
            'amount' => ['sometimes', 'required', 'numeric', 'min:0', 'max:999999.99'],
            'due_date' => ['sometimes', 'required', 'date'],
            'paid_date' => ['nullable', 'date', 'before_or_equal:today'],
            'status' => ['sometimes', 'required', 'in:pending,paid,overdue,cancelled'],
            'payment_method' => ['nullable', 'string', 'max:50'],
            'month' => ['sometimes', 'required', 'string', 'max:50'],
            'description' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
