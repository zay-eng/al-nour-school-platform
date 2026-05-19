<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PaymentController extends Controller
{
    /**
     * Display a listing of payments with filters and search.
     */
    public function index(Request $request)
    {
        $query = Payment::query();

        // Search
        if ($request->has('search') && $request->search) {
            $query->search($request->search);
        }

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->status($request->status);
        }

        // Filter by month
        if ($request->has('month') && $request->month !== 'all') {
            $query->where('month', $request->month);
        }

        // Pagination
        $perPage = $request->get('per_page', 10);
        $payments = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json($payments);
    }

    /**
     * Get financial statistics.
     */
    public function statistics()
    {
        $totalRevenue = Payment::where('status', 'paid')->sum('amount');
        $paidPayments = Payment::where('status', 'paid')->count();
        $pendingPayments = Payment::where('status', 'pending')->count();
        $overduePayments = Payment::overdue()->count();

        return response()->json([
            'totalRevenue' => $totalRevenue,
            'paidPayments' => $paidPayments,
            'pendingPayments' => $pendingPayments,
            'overduePayments' => $overduePayments,
        ]);
    }

    /**
     * Store a newly created payment.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'student_name' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'due_date' => 'required|date',
            'paid_date' => 'nullable|date',
            'status' => 'required|in:pending,paid,overdue',
            'payment_method' => 'nullable|string|max:255',
            'month' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Generate invoice number
        $lastPayment = Payment::latest('id')->first();
        $nextId = $lastPayment ? $lastPayment->id + 1 : 1;
        $invoiceNumber = 'INV-' . date('Y') . '-' . str_pad($nextId, 3, '0', STR_PAD_LEFT);

        $payment = Payment::create([
            'student_name' => $request->student_name,
            'amount' => $request->amount,
            'due_date' => $request->due_date,
            'paid_date' => $request->paid_date,
            'status' => $request->status,
            'payment_method' => $request->payment_method,
            'invoice_number' => $invoiceNumber,
            'month' => $request->month,
            'description' => $request->description,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Payment created successfully',
            'data' => $payment
        ], 201);
    }

    /**
     * Display the specified payment.
     */
    public function show($id)
    {
        $payment = Payment::find($id);

        if (!$payment) {
            return response()->json([
                'success' => false,
                'message' => 'Payment not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $payment
        ]);
    }

    /**
     * Update the specified payment.
     */
    public function update(Request $request, $id)
    {
        $payment = Payment::find($id);

        if (!$payment) {
            return response()->json([
                'success' => false,
                'message' => 'Payment not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'student_name' => 'sometimes|required|string|max:255',
            'amount' => 'sometimes|required|numeric|min:0',
            'due_date' => 'sometimes|required|date',
            'paid_date' => 'nullable|date',
            'status' => 'sometimes|required|in:pending,paid,overdue',
            'payment_method' => 'nullable|string|max:255',
            'month' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $payment->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Payment updated successfully',
            'data' => $payment
        ]);
    }

    /**
     * Remove the specified payment.
     */
    public function destroy($id)
    {
        $payment = Payment::find($id);

        if (!$payment) {
            return response()->json([
                'success' => false,
                'message' => 'Payment not found'
            ], 404);
        }

        $payment->delete();

        return response()->json([
            'success' => true,
            'message' => 'Payment deleted successfully'
        ]);
    }

    /**
     * Export payments to Excel (placeholder - implement with package like maatwebsite/excel).
     */
    public function export(Request $request)
    {
        // This would use a package like maatwebsite/excel
        // For now, return the data that can be exported on frontend
        $query = Payment::query();

        if ($request->has('status') && $request->status !== 'all') {
            $query->status($request->status);
        }

        $payments = $query->get();

        return response()->json([
            'success' => true,
            'data' => $payments
        ]);
    }
}
