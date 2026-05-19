<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreGradeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Only teachers can create grades
        return $this->user() && $this->user()->isTeacher();
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
            'subject_id' => ['required', 'integer', 'exists:subjects,id'],
            'score' => ['required', 'numeric', 'min:0', 'max:' . ($this->input('max_score', 20))],
            'max_score' => ['required', 'numeric', 'min:1', 'max:100'],
            'term' => ['required', 'in:T1,T2,T3'],
            'type' => ['required', 'in:devoir,composition,oral,projet,examen'],
            'title' => ['required', 'string', 'min:2', 'max:200'],
            'graded_at' => ['required', 'date', 'before_or_equal:today'],
            'comment' => ['nullable', 'string', 'max:500'],
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
            'student_id.required' => 'معرف الطالب مطلوب',
            'student_id.exists' => 'الطالب غير موجود',
            'subject_id.required' => 'معرف المادة مطلوب',
            'subject_id.exists' => 'المادة غير موجودة',
            'score.required' => 'الدرجة مطلوبة',
            'score.max' => 'الدرجة يجب أن لا تتجاوز الدرجة القصوى',
            'term.required' => 'الفصل الدراسي مطلوب',
            'term.in' => 'الفصل الدراسي غير صالح',
            'type.required' => 'نوع التقييم مطلوب',
            'graded_at.before_or_equal' => 'تاريخ التقييم يجب أن يكون اليوم أو قبله',
        ];
    }
}
