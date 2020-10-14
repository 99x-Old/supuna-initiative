<?php

namespace App\Service\Response;

use Illuminate\Http\JsonResponse;

class DefaultResponse extends JsonResponse
{
    public function __construct($data = null, $status = 200, $headers = [], $options = 0)
    {
        $dataObject['data'] = $data;
        $dataObject['message'] = 'Successful!';

        parent::__construct($dataObject, $status, $headers, $options);
    }
}
