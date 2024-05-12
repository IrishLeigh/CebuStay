<?php

namespace App\Http\Controllers;

use App\Models\File;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use GuzzleHttp\Exception\GuzzleException;
use GuzzleHttp\Client;
use GuzzleHttp\Psr7;
// use Illuminate\Http\Response;
use App\Models\Property;
use Symfony\Component\HttpFoundation\Response;

class FileController extends Controller
{
    private function token()
    {
        $client_id = \Config('services.google.client_id');
        $client_secret = \Config('services.google.client_secret');
        $refresh_token = \Config('services.google.refresh_token');
        $folder_id = \Config('services.google.folder_id');

        $response = Http::post('https://oauth2.googleapis.com/token', [

            'client_id' => $client_id,
            'client_secret' => $client_secret,
            'refresh_token' => $refresh_token,
            'grant_type' => 'refresh_token',

        ]);
        //dd($response);
        $accessToken = json_decode((string) $response->getBody(), true)['access_token'];

        return $accessToken;
    }
    public function store(Request $request)
    {
        $validation = $request->validate([
            'file' => 'file|required',
            'file_name' => 'required',
        ]);

        $accessToken = $this->token();
        $name = $request->file->getClientOriginalName();
        $path = $request->file->getRealPath();
        $folderId = \Config('services.google.folder_id');

        $client = new Client();

        try {
            $metadata = [
                'name' => $request->file_name,
                'parents' => [$folderId],
            ];

            $fileContents = file_get_contents($path);

            // Create multipart form data
            $multipart = [
                [
                    'name' => 'metadata',
                    'contents' => json_encode($metadata),
                    'headers' => [
                        'Content-Type' => 'application/json',
                    ],
                ],
                [
                    'name' => 'file',
                    'contents' => $fileContents,
                    'filename' => $name,
                ],
            ];

            // Create a new PSR-7 multipart stream
            $stream = new Psr7\MultipartStream($multipart);

            $response = $client->request('POST', 'https://www.googleapis.com/upload/drive/v3/files', [
                'headers' => [
                    'Authorization' => 'Bearer ' . $accessToken,
                    'Content-Type' => 'multipart/related; boundary=' . $stream->getBoundary(),
                ],
                'body' => $stream,
            ]);

            $file_id = json_decode($response->getBody()->getContents())->id;

            $uploadedfile = new File;
            $uploadedfile->file_name = $request->file_name;
            $uploadedfile->file_id = $file_id;
            $uploadedfile->save();

            return response()->json(['message' => 'Image uploaded successfully', 'status' => 'success']);
        } catch (GuzzleException $e) {
            return response()->json(['message' => 'Failed to upload image', 'status' => 'error']);
        }
    }

    public function uploadFiles(Request $request)
    {
        $folderId = \Config('services.google.folder_id'); // Assuming you send folder_id along with files
        $propertyid = $request->propertyid;
        $files = $request->file('files'); // Array of files
        $hasNonImage = false;

        if ($files == null) {
            return response()->json(['message' => 'Please select at least one file', 'status' => 'error']);
        } else if (count($files) > 5) { // Check if any file is greater than 15MB
            return response()->json(['message' => 'The maximum number of files is 5', 'status' => 'error']);
        }
        foreach ($files as $file) {
            if ($file->getSize() > 5 * 1024 * 1024) { // 5MB in bytes
                return response()->json(['message' => 'A file size exceeds the maximum limit of 15MB', 'status' => 'error']);
            }
            if (!in_array($file->getClientOriginalExtension(), ['jpg', 'jpeg', 'png', 'gif'])) {
                $hasNonImage = true;
                break;
            }
        }

        if ($hasNonImage) {
            return response()->json(['message' => 'A file is not an image file', 'status' => 'error']);
        }

        $uploadedFiles = $this->uploadMultipleFiles($files, $folderId, $propertyid);
        // Process the uploaded files as needed
        return response()->json(['status' => 'success', 'message' => 'Files uploaded']);
    }


    public function uploadMultipleFiles(array $files, string $folderId, string $propertyid)
    {
        $accessToken = $this->token();
        $client = new Client();
        $uploadedFiles = [];

        foreach ($files as $file) {
            // Validate each file if necessary
            if (!$file->isValid()) {
                continue; // Skip invalid files
            }

            $name = $file->getClientOriginalName();
            $path = $file->getRealPath();

            try {
                $metadata = [
                    'name' => $name,
                    'parents' => [$folderId],
                ];

                $fileContents = file_get_contents($path);

                // Create multipart form data
                $multipart = [
                    [
                        'name' => 'metadata',
                        'contents' => json_encode($metadata),
                        'headers' => [
                            'Content-Type' => 'application/json',
                        ],
                    ],
                    [
                        'name' => 'file',
                        'contents' => $fileContents,
                        'filename' => $name,
                    ],
                ];

                // Create a new PSR-7 multipart stream
                $stream = new Psr7\MultipartStream($multipart);

                $response = $client->request('POST', 'https://www.googleapis.com/upload/drive/v3/files', [
                    'headers' => [
                        'Authorization' => 'Bearer ' . $accessToken,
                        'Content-Type' => 'multipart/related; boundary=' . $stream->getBoundary(),
                    ],
                    'body' => $stream,
                ]);

                $file_id = json_decode($response->getBody()->getContents())->id;
                $file_url = "https://drive.google.com/thumbnail?id=$file_id";

                $newFile = new File(); // Assuming File model namespace
                $newFile->file_name = $name;
                $newFile->file_id = $file_id;
                $newFile->file_url = $file_url;
                $newFile->propertyid = $propertyid;
                $newFile->save();

                $uploadedFiles[] = [
                    'file_name' => $name,
                    'file_id' => $file_id,
                ];
            } catch (GuzzleException $e) {
                // Handle any exceptions if needed
                continue; // Skip this file and move to the next one
            }
        }

        return response()->json(['status' => 'success', 'message' => 'Files uploaded']);
    }

    public function getImgByProperty($propertyid)
    {
        $propertyimgs = File::where('propertyid', $propertyid)->get();
        $imglist = $propertyimgs->map(function ($item) {
            return [
                'id' => $item->id,
                'src' => $item->file_url
            ];
        });
        return response()->json(['img' => $imglist]);
    }
    public function getAllFirstImg(Request $request)
    {
        $this->enableCors($request);
        $allproperties = Property::all();
        // Array to store the results
        $result = [];

        // Loop through each property
        foreach ($allproperties as $property) {
            // Get the first file associated with this property
            $firstFile = File::where('propertyid', $property->propertyid)->first();

            // If there is a file, add its information to the result array
            if ($firstFile) {
                $result[] = [
                    'propertyid' => $property->propertyid,
                    'file_id' => $firstFile->id,
                    'src' => $firstFile->file_url, // Assuming path is a field in your File model
                    // Add any other information you need
                ];
            }
        }

        // Return the result
        return response()->json($result);
    }

}
