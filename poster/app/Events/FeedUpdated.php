<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class FeedUpdated
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * @var string
     */
    public $reference;

    /**
     * Create a new event instance.
     *
     * @param string $reference
     */
    public function __construct(string $reference)
    {
        $this->reference = $reference;
    }
}
