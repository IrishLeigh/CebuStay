<?php
//cross origin
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
}

// Access-Control headers are received during OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

    exit(0);
}

$host = 'localhost'; // XAMPP default host
$username = 'root'; // XAMPP default username
$password = ''; // XAMPP default password (empty by default)
$database = 'cebustaydb'; // Replace with your actual database name

// Create connection
$conn = new mysqli($host, $username, $password, $database);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} else {
    echo "Connected successfully";
}

// Read incoming JSON data
$data = json_decode(file_get_contents("php://input"), true);

// Check if data is received
if ($data !== null) {
    if (isset($data['firstname']) && isset($data['lastname']) && isset($data['email']) && isset($data['password']) && isset($data['account_type']) && isset($data['account_created']) && isset($data['is_verified'])) {
        // Prepare and bind the insert statement
        $stmt = $conn->prepare("INSERT INTO users (firstname, lastname, email, password, account_type, account_created, is_verified) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssssi", $data['firstname'], $data['lastname'], $data['email'], $data['password'], $data['account_type'], $data['account_created'], $data['is_verified']);

        // Execute the statement
        if ($stmt->execute()) {
            // If insert successful
            $response = array(
                'status' => 'success',
                'message' => 'Data inserted successfully'
            );
        } else {
            // If insert failed
            $response = array(
                'status' => 'error',
                'message' => 'Error inserting data'
            );
        }

        // Close statement
        $stmt->close();
    } else {
        $response = array(
            'status' => 'error',
            'message' => 'A field is missing'
        );
    }
} else {
    // If no data is received
    $response = array(
        'status' => 'error',
        'message' => 'No data received'
    );
}

// Close connection
$conn->close();

// Send the response back as JSON
header('Content-Type: application/json');
echo json_encode($response);
