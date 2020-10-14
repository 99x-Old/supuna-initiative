<?php

namespace App\Listeners;

use App\Events\FeedUpdated;
use Illuminate\Support\Facades\Log;
use Kafka\Producer;
use Kafka\ProducerConfig;

class SendFeedUpdated
{

    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param FeedUpdated $event
     * @return void
     */
    public function handle(FeedUpdated $event)
    {
        $data = [
            "service" => 'notification',
            "action" => 'feed:updated',
            "body" => [
                'reference' => $event->reference
            ],
        ];

        $config = ProducerConfig::getInstance();
        $config->setMetadataRefreshIntervalMs(10000);
        $config->setMetadataBrokerList('ennoble-x-kafka:9092');
        $config->setBrokerVersion('1.0.0');
        $config->setRequiredAck(1);
        $config->setIsAsyn(false);
        $config->setProduceInterval(1000);
        $producer = new Producer(
            function () use ($data) {
                return [
                    [
                        'topic' => 'notification',
                        'value' => json_encode($data),
                    ],
                ];
            }
        );
        $producer->success(function ($result) {
            Log::info($result);
        });
        $producer->error(function ($errorCode) {
            Log::error($errorCode);
        });
        $producer->send(true);
    }
}
