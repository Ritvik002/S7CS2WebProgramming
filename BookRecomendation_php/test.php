<?php
header('Content-Type: application/json');

$booksJson = file_get_contents('data/books.json');
$tagsJson = file_get_contents('data/tags.json');

echo json_encode([
    'books' => json_decode($booksJson, true),
    'tags' => json_decode($tagsJson, true),
    'php_version' => PHP_VERSION,
    'json_last_error' => json_last_error(),
    'json_last_error_msg' => json_last_error_msg()
]);
?>