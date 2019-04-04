<?php

namespace app\commands;

use app\models\PhoneBook;
use tebazil\yii2seeder\Seeder;
use Yii;
use yii\console\Controller;
use yii\db\JsonExpression;

class SeederController extends Controller
{
    public function actionUser()
    {
        Yii::$app->db->createCommand("TRUNCATE auth_assignment")->execute();
        Yii::$app->db->createCommand("TRUNCATE user")->execute();

        Yii::$app->db->createCommand()->batchInsert('user', [
            'id',
            'username',
            'auth_key',
            'access_token_expired_at',
            'password_hash',
            'password_reset_token',
            'email',
            'unconfirmed_email',
            'confirmed_at',
            'registration_ip',
            'last_login_at',
            'last_login_ip',
            'blocked_at',
            'status',
            'role',
            'created_at',
            'updated_at'
        ], [
            [
                1,
                'admin',
                'dVN8fzR_KzJ_lBrymfXI6qyH2QzyXYUU',
                '2017-06-04 00:13:29',
                '$2y$13$9Gouh1ZbewVEh4bQIGsifOs8/RWW/7RIs0CAGNd7tapXFm9.WxiXS',
                null,
                'admin@demo.com',
                'admin@demo.com',
                time(),
                '127.0.0.1',
                time(),
                '127.0.0.1',
                null,
                10,
                99,
                time(),
                time()
            ],
            [
                2,
                'staff',
                'Xm-zZRREtAIKsFlINVRLSw3U7llbx_5a',
                '2017-05-30 20:30:31',
                '$2y$13$TKh5pEy0RFTmkC9Kjvb9A.WR/I1QVzYHdfYDw0m7MnHnN0bsv96Jq',
                null,
                'staff@demo.com',
                'staff@demo.com',
                time(),
                '127.0.0.1',
                time(),
                '127.0.0.1',
                null,
                10,
                50,
                time(),
                time()
            ],
        ])->execute();

        Yii::$app->db->createCommand()->batchInsert('user', [
            'id',
            'username',
            'auth_key',
            'access_token_expired_at',
            'password_hash',
            'password_reset_token',
            'email',
            'unconfirmed_email',
            'confirmed_at',
            'registration_ip',
            'last_login_at',
            'last_login_ip',
            'blocked_at',
            'status',
            'role',
            'created_at',
            'updated_at',
            'name',
            'phone',
            'address',
            'rw',
            'kel_id',
            'kec_id',
            'kabkota_id',
        ], [
            [
                3,
                'user',
                'rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',
                '2017-06-04 00:13:02',
                '$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',
                null,
                'user@demo.com',
                'user@demo.com',
                time(),
                '127.0.0.1',
                time(),
                '127.0.0.1',
                null,
                10,
                10,
                time(),
                time(),
                'User Kota Bandung Satu',
                '0857123456',
                'Jl. Alamat Kota Bandung Satu',
                2,
                6178,
                446,
                22,
            ],
            [
                4,
                'user.bandung',
                'rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',
                '2017-06-04 00:13:02',
                '$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',
                null,
                'user.bandung@demo.com',
                'user.bandung@demo.com',
                time(),
                '127.0.0.1',
                time(),
                '127.0.0.1',
                null,
                10,
                10,
                time(),
                time(),
                'User Kota Bandung Dua',
                '0857123456',
                'Jl. Alamat Kota Bandung Dua',
                2,
                6178,
                446,
                22,
            ],
            [
                5,
                'user.bekasi',
                'rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',
                '2017-06-04 00:13:02',
                '$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',
                null,
                'user.bekasi@demo.com',
                'user.bekasi@demo.com',
                time(),
                '127.0.0.1',
                time(),
                '127.0.0.1',
                null,
                10,
                10,
                time(),
                time(),
                'User Kota Bekasi',
                '0857123456',
                'Jl. Alamat Kota Bekasi',
                9,
                6228,
                452,
                23,
            ],
            [
                6,
                'user.tasikmalaya',
                'rNXSqIas_43RdpG0e5_7d1W06iK8pXJ8',
                '2017-06-04 00:13:02',
                '$2y$13$nd/F3g6jjIa1/Sk6JZxZ5uVq0OpsbOmW1OdnbDG6BpFqgkFbQotjm',
                null,
                'user.tasikmalaya@demo.com',
                'user.tasikmalaya@demo.com',
                time(),
                '127.0.0.1',
                time(),
                '127.0.0.1',
                null,
                10,
                10,
                time(),
                time(),
                'User Kota Tasikmalaya',
                '0857123456',
                'Jl. Alamat Kota Tasikmalaya',
                11,
                6341,
                466,
                26,
            ],
        ])->execute();

        $auth = Yii::$app->authManager;

        $admin = $auth->getRole('admin');
        $auth->assign($admin, 1);

        $staff = $auth->getRole('staff');
        $auth->assign($staff, 2);

        $user = $auth->getRole('user');

        $auth->assign($user, 3);
        $auth->assign($user, 4);
        $auth->assign($user, 5);
        $auth->assign($user, 6);
    }

    public function actionPhoneBook()
    {
        Yii::$app->db->createCommand("TRUNCATE phonebooks")->execute();

        $seeder = new Seeder();
        $generator = $seeder->getGeneratorConfigurator();
        $faker = $generator->getFakerConfigurator();

        $kabKota = [22, 23, 26];

        $seeder->table('phonebooks')->columns([
            'id',
            'name' => $faker->company,
            'description' => $faker->text,
            'address' => $faker->address,
            'phone_numbers' => new JsonExpression([
                [
                    'type' => 'phone',
                    'phone_number' => '022-123456',
                ],
                [
                    'type' => 'message',
                    'phone_number' => '022-098763',
                ],
            ]),
            'kabkota_id' => $faker->randomElement($kabKota),
            'status' => PhoneBook::STATUS_ACTIVE,
            'seq' => 1,
            'latitude' => $faker->latitude('-6.148534', '-7.484602'),
            'longitude' => $faker->longitude('106.022438', '108.680921'),
            'cover_image_path' => 'https://dummyimage.com/wsxga',
            'created_at' => time(),
            'updated_at' => time(),
        ])->rowQuantity(50);

        $seeder->refill();
    }
}