<?php

namespace App\Http\Controllers;

use App\Exceptions\RequestDataException;
use App\Service\User;
use Exception;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Validator;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    /**
     * @param  Request  $request
     *
     * @return User
     * @throws Exception
     */
    public function getUser(Request $request): User
    {
        $user = json_decode($request->header('x-authenticated-userid'), true);
        if (!$user) {
            throw new RequestDataException("Invalid user!", 400);
        }
        $valid = Validator::make($user, [
            'uuid'        => 'required',
            'first_name' => 'required',
            'last_name'  => 'required',
            'role'      => 'required',
        ]);


        if ($valid->fails()) {
            throw new RequestDataException("Invalid user!", 400);
        }
        $userData = new User();
        $userData->setUuid($user['uuid']);
        $userData->setFirstName($user['first_name']);
        $userData->setLastName($user['last_name']);
        $userData->setRole($user['role']);

        return $userData;
    }
}
