<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Payment;
use Carbon\Carbon;

class PaymentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $payments = [
            [
                'student_name' => 'أحمد محمد',
                'amount' => 1500.00,
                'due_date' => Carbon::parse('2024-05-01'),
                'paid_date' => Carbon::parse('2024-04-28'),
                'status' => 'paid',
                'payment_method' => 'نقدي',
                'invoice_number' => 'INV-2024-001',
                'month' => 'مايو 2024',
            ],
            [
                'student_name' => 'فاطمة علي',
                'amount' => 1500.00,
                'due_date' => Carbon::parse('2024-05-01'),
                'paid_date' => null,
                'status' => 'pending',
                'payment_method' => null,
                'invoice_number' => 'INV-2024-002',
                'month' => 'مايو 2024',
            ],
            [
                'student_name' => 'محمد حسن',
                'amount' => 1500.00,
                'due_date' => Carbon::parse('2024-04-01'),
                'paid_date' => null,
                'status' => 'overdue',
                'payment_method' => null,
                'invoice_number' => 'INV-2024-003',
                'month' => 'أبريل 2024',
            ],
            [
                'student_name' => 'سارة أحمد',
                'amount' => 1500.00,
                'due_date' => Carbon::parse('2024-05-01'),
                'paid_date' => Carbon::parse('2024-05-01'),
                'status' => 'paid',
                'payment_method' => 'تحويل بنكي',
                'invoice_number' => 'INV-2024-004',
                'month' => 'مايو 2024',
            ],
            [
                'student_name' => 'يوسف إبراهيم',
                'amount' => 1500.00,
                'due_date' => Carbon::parse('2024-05-01'),
                'paid_date' => Carbon::parse('2024-04-30'),
                'status' => 'paid',
                'payment_method' => 'بطاقة',
                'invoice_number' => 'INV-2024-005',
                'month' => 'مايو 2024',
            ],
            [
                'student_name' => 'مريم خالد',
                'amount' => 1500.00,
                'due_date' => Carbon::parse('2024-05-01'),
                'paid_date' => null,
                'status' => 'pending',
                'payment_method' => null,
                'invoice_number' => 'INV-2024-006',
                'month' => 'مايو 2024',
            ],
            [
                'student_name' => 'عمر سعيد',
                'amount' => 1500.00,
                'due_date' => Carbon::parse('2024-03-01'),
                'paid_date' => null,
                'status' => 'overdue',
                'payment_method' => null,
                'invoice_number' => 'INV-2024-007',
                'month' => 'مارس 2024',
            ],
            [
                'student_name' => 'نور عبدالرحمن',
                'amount' => 1500.00,
                'due_date' => Carbon::parse('2024-05-01'),
                'paid_date' => Carbon::parse('2024-05-02'),
                'status' => 'paid',
                'payment_method' => 'نقدي',
                'invoice_number' => 'INV-2024-008',
                'month' => 'مايو 2024',
            ],
            [
                'student_name' => 'ياسمين كريم',
                'amount' => 1500.00,
                'due_date' => Carbon::parse('2024-05-01'),
                'paid_date' => null,
                'status' => 'pending',
                'payment_method' => null,
                'invoice_number' => 'INV-2024-009',
                'month' => 'مايو 2024',
            ],
            [
                'student_name' => 'زينب طارق',
                'amount' => 1500.00,
                'due_date' => Carbon::parse('2024-05-01'),
                'paid_date' => Carbon::parse('2024-04-29'),
                'status' => 'paid',
                'payment_method' => 'تحويل بنكي',
                'invoice_number' => 'INV-2024-010',
                'month' => 'مايو 2024',
            ],
        ];

        foreach ($payments as $payment) {
            Payment::create($payment);
        }
    }
}
