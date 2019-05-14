export default [
    {
        "id": 1,
        "title": "Survey Pengguna",
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
    }
]
