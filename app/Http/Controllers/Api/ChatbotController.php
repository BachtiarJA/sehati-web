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

        // 2. Teks pagar pembatas instruksi sistem yang super ketat
        $systemInstruction = "Kamu adalah SehatiBot, asisten medis pintar untuk aplikasi pengingat obat Sehati dan Klinik Sehati Medika. "
            . "Tugasmu HANYA menjawab pertanyaan seputar fitur aplikasi Sehati (seperti jadwal obat, alarm, verifikasi AI), "
            . "informasi operasional klinik (layanan, khitan, booking dokter, jadwal dokter, poli), atau edukasi kesehatan dasar harian.\n\n"
            . "⚠️ ATURAN MUTLAK:/n"
            . "Jika pertanyaan pengguna berada di luar konteks aplikasi Medvora, di luar Klinik Sehati Medika, atau tidak ada hubungannya dengan kesehatan "
            . "(misalnya bertanya tentang kodingan pemrograman, matematika, resep makanan umum, politik, gosip selebriti, lelucon umum, atau hal di luar medis lainnya), "
            . "kamu WAJIB menjawab HANYA dengan kalimat ini secara utuh tanpa ada tambahan kata atau karakter lain:\n"
            . "Maaf, saya belum memahami pertanyaan tersebut. Silakan hubungi nomor administrasi Klinik Sehati Medika di 0822-1013-0822.\n\n"
            . "Pertanyaan pengguna: " . $userMessage;

        try {
            // 3. Ambil respon langsung dari model Gemini 1.5 Flash
            $response = Http::post("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={$apiKey}", [
                'contents' => [
                    [
                        'parts' => [
                            ['text' => $systemInstruction]
                        ]
                    ]
                ],
                'generationConfig' => [
                    'temperature' => 0.2, // Mengunci kreativitas AI agar patuh pada aturan teks di atas
                ]
            ]);

            $result = $response->json();
            $botReply = $result['candidates'][0]['content']['parts'][0]['text'] ?? null;

            // Jika respon dari Gemini kosong atau gagal parsing, lempar ke fallback manual
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