export default [
    {
        "id": 1,
        "title": "Survey Pengguna",
        "description": "Survey ini digunakan untuk mengetahui latar belakang pengguna.",
        "form": {
            "fields": [
                {
                    "name": "name",
                    "type": "text",
                    "label": "Nama Anda"
                },
                {
                    "name": "age",
                    "type": "text",
                    "label": "Umur"
                },
                {
                    "name": "occupation",
                    "type": "radio",
                    "label": "Pekerjaan Anda saat ini",
                    "options": [
                        {
                            "value": "ASN",
                            "label": "Aparatur Sipil Negara"
                        },
                        {
                            "value": "SWASTA",
                            "label": "Pegawai Swasta"
                        },
                        {
                            "value": "UNEMPLOYMENT",
                            "label": "Tidak Bekerja"
                        }
                    ]
                },
                {
                    "name": "internet_knowledge",
                    "type": "radio",
                    "label": "Tingkat pemahaman Anda terhadap Internet",
                    "options": [
                        {
                            "value": "HIGH",
                            "label": "Sangat Paham"
                        },
                        {
                            "value": "MEDIUM",
                            "label": "Paham"
                        },
                        {
                            "value": "LOW",
                            "label": "Kurang Paham"
                        }
                    ]
                },
                {
                    "name": "internet_usage",
                    "type": "select",
                    "label": "Saya biasanya menggunakan Internet untuk",
                    "options": [
                        {
                            "value": "BROWSING",
                            "label": "Browsing"
                        },
                        {
                            "value": "SOCIAL",
                            "label": "Sosial Media"
                        },
                        {
                            "value": "CHAT",
                            "label": "Chatting / Komunikasi"
                        },
                        {
                            "value": "EMAIL",
                            "label": "Membuka Email"
                        },
                        {
                            "value": "ECOMMERCE",
                            "label": "Berjualan"
                        },
                        {
                            "value": "WORK",
                            "label": "Bekerja Sehari-Hari"
                        },
                        {
                            "value": "NONE",
                            "label": "Tidak Tahu / Tidak Pernah"
                        }
                    ]
                }
            ]
        }
    },
    {
        "id": 2,
        "title": "Survey Kepuasan Penggunaan Aplikasi Sapa Warga",
        "description": "Survey ini digunakan untuk mengetahui latar belakang pengguna.",
        "form": {
            "fields": [
                {
                    "name": "used",
                    "type": "radio",
                    "label": "Berapa lama Anda telah menggunakan aplikasi Sapa Warga?",
                    "options": [
                        {
                            "value": "< 1",
                            "label": "Kurang dari 1 Bulan"
                        },
                        {
                            "value": "1-3",
                            "label": "1-3 Bulan"
                        },
                        {
                            "value": "> 3",
                            "label": "Lebih dari 3 Bulan"
                        }
                    ]
                },
                {
                    "name": "operational",
                    "type": "radio",
                    "label": "Secara garis besar apakah aplikasi Sapa Warga membantu anda dalam menjalani operasional sebagai RW?",
                    "options": [
                        {
                            "value": "YES",
                            "label": "Ya"
                        },
                        {
                            "value": "No",
                            "label": "Tidak"
                        }
                    ]
                },
                {
                    "name": "most",
                    "type": "radio",
                    "label": "Fitur apa yang paling sering digunakan oleh anda dalam Aplikasi Sapa Warga?",
                    "options": [
                        {
                            "value": "SAMSAT",
                            "label": "Pembayaran E-Samsat"
                        },
                        {
                            "value": "PERIZINAN",
                            "label": "Perizinan"
                        },
                        {
                            "value": "ADMINISTRATION",
                            "label": "Administrasi"
                        },
                        {
                            "value": "PHONEBOOK",
                            "label": "Nomor Penting"
                        },
                        {
                            "value": "COMMODITY",
                            "label": "Info Harga"
                        },
                        {
                            "value": "PROCUREMENT",
                            "label": "Info Lelang"
                        },
                        {
                            "value": "LAPOR",
                            "label": "Lapor"
                        },
                        {
                            "value": "ASPIRASI",
                            "label": "Aspirasi"
                        },
                        {
                            "value": "POLLING",
                            "label": "Polling"
                        },
                        {
                            "value": "SURVEY",
                            "label": "Survey"
                        }
                    ]
                }
            ]
        }
    }
]
