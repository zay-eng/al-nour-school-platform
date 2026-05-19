<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class StorePaymentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Only admins can create payments
        return $this->user() && $this->user()->role === 'admin';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'student_id' => ['required', 'integer', 'exists:students,id'],
            'fee_type_id' => ['nullable', 'integer', 'exists:fee_types,id'],
            'amount' => ['required', 'numeric', 'min:0', 'max:999999.99'],
            'due_date' => ['required', 'date'],
            'paid_date' => ['nullable', 'date', 'before_or_equal:today'],
            'status' => ['required', 'in:pending,paid,overdue,cancelled'],
            'payment_method' => ['nullable', 'string', 'max:50'],
            'month' => ['required', 'string', 'max:50'],
            'description' => ['nullable', 'string', 'max:1000'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'student_name.required' => 'اسم التلميذ مطلوب',
            'student_name.regex' => 'اسم التلميذ يجب أن يحتوي على أحرف عربية فقط',
            'amount.required' => 'المبلغ مطلوب',
            'amount.numeric' => 'المبلغ يجب أن يكون رقماً',
            'amount.min' => 'المبلغ يجب أن يكون أكبر من أو يساوي 0',
            'amount.max' => 'المبلغ كبير جداً',
            'due_date.required' => 'تاريخ الاستحقاق مطلوب',
            'due_date.date' => 'تاريخ الاستحقاق غير صحيح',
            'paid_date.date' => 'تاريخ الدفع غير صحيح',
            'paid_date.before_or_equal' => 'تاريخ الدفع لا يمكن أن يكون في المستقبل',
            'status.required' => 'الحالة مطلوبة',
            'status.in' => 'الحالة غير صحيحة',
            'payment_method.in' => 'طريقة الدفع غير صحيحة',
            'month.required' => 'الشهر مطلوب',
            'description.max' => 'الوصف طويل جداً',
        ];
    }

    /**
     * Handle a failed validation attempt.
     *
     * @param  \Illuminate\Contracts\Validation\Validator  $validator
     * @return void
     *
     * @throws \Illuminate\Http\Exceptions\HttpResponseException
     */
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'Validation errors',
            'errors' => $validator->errors()
        ], 422));
    }

    /**
     * Handle a failed authorization attempt.
     *
     * @return void
     *
     * @throws \Illuminate\Http\Exceptions\HttpResponseException
     */
    protected function failedAuthorization()
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'Forbidden. Only administrators can create payments.'
        ], 403));
    }
}
