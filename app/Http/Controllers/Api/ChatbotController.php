<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ChatbotController extends Controller
{
    /**
     * 💬 POST: Fitur Chatbot Medvora AI Terfokus & Berpagar Besi
     */
    public function chat(Request $request)
    {
        // 1. Validasi input dari aplikasi mobile Flutter
        $request->validate([
            'pesan' => 'required|string',
        ]);

        $apiKey = env('GEMINI_API_KEY');
        $userMessage = $request->pesan;

        // 2. Teks pagar pembatas murni tanpa dicampur pesan user
        $promptSistem = "Kamu adalah SehatiBot, asisten medis pintar untuk aplikasi pengingat obat Sehati dan Klinik Sehati Medika. "
            . "Tugasmu HANYA menjawab pertanyaan seputar kesehatan, gejala penyakit, obat-obatan, dan pertolongan pertama.\n\n"
            . "⚠️ ATURAN MUTLAK:\n"
            . "Jika pertanyaan pengguna berada di luar konteks medis atau kesehatan "
            . "(misalnya tentang kodingan pemrograman, matematika, politik, lelucon umum, atau hal non-medis lainnya), "
            . "kamu WAJIB menjawab HANYA dengan kalimat ini secara utuh tanpa tambahan kata lain:\n"
            . "Maaf, saya belum memahami pertanyaan tersebut. Silakan hubungi nomor administrasi Klinik Sehati Medika di 0822-1013-0822.";

        try {
            // 🔥 PERBAIKAN UTAMA: Pisahkan systemInstruction dan contents sesuai dokumentasi resmi Gemini
            $response = Http::post("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={$apiKey}", [
                'systemInstruction' => [
                    'parts' => [
                        ['text' => $promptSistem]
                    ]
                ],
                'contents' => [
                    [
                        'parts' => [
                            ['text' => $userMessage] // Pesan user berdiri sendiri di sini
                        ]
                    ]
                ],
                'generationConfig' => [
                    'temperature' => 0.4 // ⚡ Diturunkan agar AI konsisten dan patuh pada aturan
                ]
            ]);

            $result = $response->json();
            $botReply = $result['candidates'][0]['content']['parts'][0]['text'] ?? null;

            if (!$botReply) {
                $botReply = "Maaf, saya belum memahami pertanyaan tersebut. Silakan hubungi nomor administrasi Klinik Sehati Medika di 0822-1013-0822.";
            }

            return response()->json([
                'status' => 'success',
                'balasan' => trim($botReply)
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mendapatkan balasan dari AI: ' . $e->getMessage()
            ], 500);
        }
    }
}