<?php
header('Content-Type: application/json');

// Read books from JSON file
function getBooks() {
    try {
        $jsonContent = file_get_contents('data/books.json');
        if ($jsonContent === false) {
            throw new Exception('Unable to read books data');
        }
        
        $data = json_decode($jsonContent, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception('Invalid JSON format');
        }
        
        return $data['books'] ?? [];
    } catch (Exception $e) {
        return ['error' => $e->getMessage()];
    }
}

// Get tags from POST request
$requestTags = isset($_POST['tags']) ? json_decode($_POST['tags'], true) : [];
$books = getBooks();

if (empty($requestTags)) {
    echo json_encode($books);
} else {
    // Filter books by tags
    $filteredBooks = array_filter($books, function($book) use ($requestTags) {
        if (!isset($book['tags']) || !is_array($book['tags'])) {
            return false;
        }
        $bookTags = array_map('strtolower', $book['tags']);
        $requestTags = array_map('strtolower', $requestTags);
        return count(array_intersect($requestTags, $bookTags)) === count($requestTags);
    });
    
    echo json_encode(array_values($filteredBooks));
}
?>