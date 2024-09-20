<?php

return [
    'supports_credentials' => true,

    'allowed_origins' => ['*'], // Use specific origins if possible, e.g., ['http://localhost:3000']
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'allowed_methods' => ['*'],
    'max_age' => 0,
    'paths' => ['api/*'],
];

