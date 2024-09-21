<?php

namespace App\Http\Controllers;

use App\Models\File;
use App\Models\UnitDetails;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use GuzzleHttp\Exception\GuzzleException;
use GuzzleHttp\Client;
use GuzzleHttp\Psr7;
// use Illuminate\Http\Response;
use App\Models\Property;
use App\Models\UserFile;
use Symfony\Component\HttpFoundation\Response;

class FileController extends CORS
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
            // 'file_name' => 'required',
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

    public function updateCoverPhotosSingle(Request $request, $propertyid)
    {
        $this->enableCors($request);
        $accessToken = $this->token(); // Fetch Google Drive API token
        $success = false;
        $nochange = true; // Default to true; if changes occur, this will be set to false
        $client = new Client();

        // Handle file deletion
        if ($request->has('toDelete')) {
            $toDelete = json_decode($request->input('toDelete'), true); // Decode JSON string
            $failedDeletes = [];
            $successCount = 0;

            foreach ($toDelete as $fileData) {
                try {
                    $existingFile = File::find($fileData['id']);

                    if (!$existingFile) {
                        $failedDeletes[] = [
                            'id' => $fileData['id'],
                            'message' => 'File not found in database'
                        ];
                        continue; // Skip to the next file
                    }

                    // Delete the file from Google Drive
                    $deleteResponse = $client->request('DELETE', 'https://www.googleapis.com/drive/v3/files/' . $existingFile->file_id, [
                        'headers' => [
                            'Authorization' => 'Bearer ' . $accessToken,
                        ],
                    ]);

                    if ($deleteResponse->getStatusCode() == 204) {
                        $existingFile->delete();
                        $successCount++;
                        $nochange = false; // Change occurred: files deleted
                    } else {
                        $failedDeletes[] = [
                            'id' => $fileData['id'],
                            'message' => 'Failed to delete from Google Drive'
                        ];
                    }
                } catch (GuzzleException $e) {
                    $failedDeletes[] = [
                        'id' => $fileData['id'],
                        'message' => $e->getMessage(),
                    ];
                }
            }

            if (count($failedDeletes) > 0) {
                return response()->json([
                    'message' => 'Some files failed to delete',
                    'status' => 'partial_success',
                    'failed_deletes' => $failedDeletes
                ]);
            }
        }

        // Handle file upload
        if ($request->hasFile('files')) {
            $files = $request->file('files');
            $folderId = \Config('services.google.folder_id');
            $uploadedFiles = $this->uploadMultipleFiles($files, $folderId, $propertyid);

            if ($uploadedFiles) {
                $success = true;
                $nochange = false; // Change occurred: files uploaded
            } else {
                // Handle case where uploadMultipleFiles might return an error or partial success
                return response()->json([
                    'message' => 'Failed to upload some files',
                    'status' => 'partial_success',
                    'errors' => $uploadedFiles['errors'] ?? []
                ]);
            }
        }

        // Handle the response
        if ($nochange) {
            // No changes were made
            return response()->json(['message' => 'No changes made', 'status' => 'null']);
        }

        // Changes were made
        if ($success) {
            $propertyimgs = File::where('propertyid', $propertyid)
                ->whereNull('unitid')
                ->where('iscover', 1)
                ->get();

            $imglist = $propertyimgs->map(function ($item) {
                return [
                    'id' => $item->id,
                    'src' => $item->file_url,
                    'caption' => $item->caption
                ];
            });
            return response()->json(['message' => 'Cover photos updated successfully', 'status' => 'success', 'coverPhotos' => $imglist]);
        } else {
            return response()->json(['message' => 'Failed to update cover photos', 'status' => 'error']);
        }
    }

    public function updateGalleryPhotosSingle(Request $request, $propertyid)
    {
        $this->enableCors($request);
        $accessToken = $this->token(); // Fetch Google Drive API token
        $success = false;
        $nochange = true; // Default to true; if changes occur, this will be set to false
        $client = new Client();

        // Handle file deletion
        if ($request->has('toDelete')) {
            $toDelete = json_decode($request->input('toDelete'), true); // Decode JSON string
            $failedDeletes = [];
            $successCount = 0;

            foreach ($toDelete as $fileData) {
                try {
                    $existingFile = File::find($fileData['id']);

                    if (!$existingFile) {
                        $failedDeletes[] = [
                            'id' => $fileData['id'],
                            'message' => 'File not found in database'
                        ];
                        continue; // Skip to the next file
                    }

                    // Delete the file from Google Drive
                    $deleteResponse = $client->request('DELETE', 'https://www.googleapis.com/drive/v3/files/' . $existingFile->file_id, [
                        'headers' => [
                            'Authorization' => 'Bearer ' . $accessToken,
                        ],
                    ]);

                    if ($deleteResponse->getStatusCode() == 204) {
                        $existingFile->delete();
                        $successCount++;
                        $nochange = false; // Change occurred: files deleted
                    } else {
                        $failedDeletes[] = [
                            'id' => $fileData['id'],
                            'message' => 'Failed to delete from Google Drive'
                        ];
                    }
                } catch (GuzzleException $e) {
                    $failedDeletes[] = [
                        'id' => $fileData['id'],
                        'message' => $e->getMessage(),
                    ];
                }
            }

            // if (count($failedDeletes) > 0) {
            //     return response()->json([
            //         'message' => 'Some files failed to delete',
            //         'status' => 'partial_success',
            //         'failed_deletes' => $failedDeletes
            //     ]);
            // }
        }

        // Handle file upload
        if ($request->hasFile('files')) {
            $files = $request->file('files');
            $folderId = \Config('services.google.folder_id');
            $uploadedFiles = $this->uploadMultipleFiles_Gallery($files, $folderId, $propertyid);

            if ($uploadedFiles) {
                $success = true;
                $nochange = false; // Change occurred: files uploaded
            } else {
                // Handle case where uploadMultipleFiles might return an error or partial success
                return response()->json([
                    'message' => 'Failed to upload some files',
                    'status' => 'partial_success',
                    'errors' => $uploadedFiles['errors'] ?? []
                ]);
            }
        }

        // Handle the response
        if ($nochange) {
            // No changes were made
            return response()->json(['message' => 'No changes made', 'status' => 'null']);
        }

        // Changes were made
        if ($success) {
            $propertyimgs = File::where('propertyid', $propertyid)
                ->whereNull('unitid')
                ->where('iscover', 0)
                ->get();

            $imglist = $propertyimgs->map(function ($item) {
                return [
                    'id' => $item->id,
                    'src' => $item->file_url,
                    'caption' => $item->caption
                ];
            });
            return response()->json(['message' => 'Gallery photos updated successfully', 'status' => 'success', 'galleryPhotos' => $imglist]);
        }
    }

    public function uploadMultipleFiles_Gallery(array $files, string $folderId, string $propertyid)
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
                // $file_url = "https://drive.google.com/thumbnail?id=$file_id";
                $file_url = "https://lh3.googleusercontent.com/d/$file_id=w1000?authuser=0";
                $newFile = new File(); // Assuming File model namespace
                $newFile->file_name = $name;
                $newFile->file_id = $file_id;
                $newFile->file_url = $file_url;
                $newFile->propertyid = $propertyid;
                $newFile->iscover = 0;
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

    public function uploadFiles(Request $request)
    {
        $this->enableCors($request);
        $folderId = \Config('services.google.folder_id'); // Assuming you send folder_id along with files
        $propertyid = $request->propertyid;
        $files = $request->file('files'); // Array of files
        $hasNonImage = false;

        if ($files == null) {
            return response()->json(['message' => 'Please select at least one file', 'status' => 'error']);
        } else if (count($files) > 15) {
            return response()->json(['message' => 'The maximum number of files is 15', 'status' => 'error']);
        }
        foreach ($files as $file) {
            if ($file->getSize() > 2 * 1024 * 1024) { // 2MB in bytes
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
                // $file_url = "https://drive.google.com/thumbnail?id=$file_id";
                $file_url = "https://lh3.googleusercontent.com/d/$file_id=w1000?authuser=0";
                $newFile = new File(); // Assuming File model namespace
                $newFile->file_name = $name;
                $newFile->file_id = $file_id;
                $newFile->file_url = $file_url;
                $newFile->propertyid = $propertyid;
                $newFile->iscover = 1;
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

    public function addCaption(Request $request)
    {
        $this->enableCors($request);
        $id = $request->id;
        $caption = $request->caption;

        $file = File::find($id);
        $propertyid = $file->propertyid;
        $file->caption = $caption;
        $file->save();
        $propertyimgs = File::where('propertyid', $propertyid)
            ->whereNull('unitid')
            ->where('iscover', $request->input('iscover') ?: 0)
            ->get();


        $imglist = $propertyimgs->map(function ($item) {
            return [
                'id' => $item->id,
                'src' => $item->file_url,
                'caption' => $item->caption
            ];
        });
        return response()->json(['status' => 'success', 'message' => 'File caption added', 'coverPhotos' => $imglist]);
    }

    public function getImgByProperty($propertyid)   //GETTING COVER IMG OF A PROPERTY
    {
        $propertyimgs = File::where('propertyid', $propertyid)
            ->whereNull('unitid')
            ->where('iscover', 1)
            ->get();

        $imglist = $propertyimgs->map(function ($item) {
            return [
                'id' => $item->id,
                'src' => $item->file_url,
                'caption' => $item->caption
            ];
        });

        return response()->json(['img' => $imglist]);
    }

    public function getImgByProperty_gallery($propertyid)   //GETTING COVER IMG OF A PROPERTY
    {
        $propertyimgs = File::where('propertyid', $propertyid)
            ->whereNull('unitid')
            ->where('iscover', 0)
            ->get();

        $imglist = $propertyimgs->map(function ($item) {
            return [
                'id' => $item->id,
                'src' => $item->file_url,
                'caption' => $item->caption
            ];
        });

        return response()->json(['img' => $imglist]);
    }

    public function getAllFirstImg(Request $request)
    {
        $this->enableCors($request);
        $allproperties = Property::all();
        $result = [];

        foreach ($allproperties as $property) {
            // Get the first file associated with this property where unitid is null
            $firstFile = File::where('propertyid', $property->propertyid)
                ->whereNull('unitid')
                ->first();

            // If there is a file, add its information to the result array
            if ($firstFile) {
                $result[] = [
                    'propertyid' => $property->propertyid,
                    'file_id' => $firstFile->id,
                    'src' => $firstFile->file_url, // Assuming file_url is a field in your File model
                    // Add any other information you need
                ];
            }
        }

        // Return the result
        return response()->json($result);
    }


    public function uploadAvatar(Request $request)
    {
        $this->enableCors($request);
        // $validation = $request->validate([
        //     'file' => 'file|required',
        //     'file_name' => 'required',
        // ]);

        $accessToken = $this->token();
        $userid = $request->userid;
        $name = $request->file->getClientOriginalName();
        $path = $request->file->getRealPath();
        $folderId = \Config('services.google.avatar_folderid');

        $client = new Client();

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
            $uploadedfile = new UserFile();
            $uploadedfile->file_name = $name;
            $uploadedfile->userid = $userid;
            $uploadedfile->file_id = $file_id;
            $uploadedfile->file_url = $file_url;
            $uploadedfile->isavatar = true;
            $uploadedfile->save();

            return response()->json(['message' => 'Image uploaded successfully', 'status' => 'success']);
        } catch (GuzzleException $e) {
            return response()->json(['message' => 'Failed to upload image', 'status' => 'error']);
        }
    }

    public function getUserAvatar(Request $request)
    {
        try {
            $this->enableCors($request);
            $userid = $request->userid;

            $src_userimg = UserFile::where('userid', $userid)
                ->where('isavatar', true)
                ->first();
            if (!$src_userimg) {
                return response()->json(['status' => 'error', 'message' => 'No image found']);
            } else {
                return response()->json(['status' => 'success', 'src' => $src_userimg->file_url]);
            }


        } catch (GuzzleException $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
        }

    }

    public function updateAvatar(Request $request)
    {
        $this->enableCors($request);

        $accessToken = $this->token();
        $userid = $request->userid;
        $name = $request->file->getClientOriginalName();
        $path = $request->file->getRealPath();
        $folderId = \Config('services.google.avatar_folderid');

        $client = new Client();

        try {
            // Find the existing image for the user
            $existingFile = UserFile::where('userid', $userid)->first();
            if (!$existingFile) {
                return response()->json(['message' => 'No existing image found for this user', 'status' => 'error']);
            }

            // Delete the existing file from Google Drive
            $deleteResponse = $client->request('DELETE', 'https://www.googleapis.com/drive/v3/files/' . $existingFile->file_id, [
                'headers' => [
                    'Authorization' => 'Bearer ' . $accessToken,
                ],
            ]);

            // Delete the existing file record from the database
            $existingFile->delete();

            // Upload the new file to Google Drive
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

            // Save the new file record to the database
            $uploadedfile = new UserFile();
            $uploadedfile->file_name = $name;
            $uploadedfile->userid = $userid;
            $uploadedfile->file_id = $file_id;
            $uploadedfile->file_url = $file_url;
            $uploadedfile->isavatar = true;
            $uploadedfile->save();

            return response()->json(['message' => 'Image updated successfully', 'status' => 'success']);
        } catch (GuzzleException $e) {
            return response()->json(['message' => 'Failed to update image', 'status' => 'error']);
        }
    }

    public function uploadLogo(Request $request)
    {
        $this->enableCors($request);
        // $validation = $request->validate([
        //     'file' => 'file|required',
        //     'file_name' => 'required',
        // ]);

        $accessToken = $this->token();
        $userid = $request->userid;
        $name = $request->file->getClientOriginalName();
        $path = $request->file->getRealPath();
        $folderId = \Config('services.google.avatar_folderid');

        $client = new Client();

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
            $uploadedfile = new UserFile();
            $uploadedfile->file_name = $name;
            $uploadedfile->userid = $userid;
            $uploadedfile->file_id = $file_id;
            $uploadedfile->file_url = $file_url;
            $uploadedfile->isavatar = false;
            $uploadedfile->save();

            return response()->json(['message' => 'Image uploaded successfully', 'status' => 'success']);
        } catch (GuzzleException $e) {
            return response()->json(['message' => 'Failed to upload image', 'status' => 'error']);
        }
    }

    public function getCompanyLogo(Request $request)
    {
        try {
            $this->enableCors($request);
            $userid = $request->userid;

            $src_userimg = UserFile::where('userid', $userid)
                ->where('isavatar', false)
                ->first();
            if (!$src_userimg) {
                return response()->json(['status' => 'error', 'message' => 'No image found']);
            } else {
                return response()->json(['status' => 'success', 'src' => $src_userimg->file_url]);
            }


        } catch (GuzzleException $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
        }

    }

    public function updateCompanyLogo(Request $request)
    {
        $this->enableCors($request);

        $accessToken = $this->token();
        $userid = $request->userid;
        $name = $request->file->getClientOriginalName();
        $path = $request->file->getRealPath();
        $folderId = \Config('services.google.avatar_folderid');

        $client = new Client();

        try {
            // Find the existing image for the user
            $existingFile = UserFile::where('userid', $userid)->first();
            if (!$existingFile) {
                return response()->json(['message' => 'No existing image found for this user', 'status' => 'error']);
            }

            // Delete the existing file from Google Drive
            $deleteResponse = $client->request('DELETE', 'https://www.googleapis.com/drive/v3/files/' . $existingFile->file_id, [
                'headers' => [
                    'Authorization' => 'Bearer ' . $accessToken,
                ],
            ]);

            // Delete the existing file record from the database
            $existingFile->delete();

            // Upload the new file to Google Drive
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

            // Save the new file record to the database
            $uploadedfile = new UserFile();
            $uploadedfile->file_name = $name;
            $uploadedfile->userid = $userid;
            $uploadedfile->file_id = $file_id;
            $uploadedfile->file_url = $file_url;
            $uploadedfile->isavatar = false;
            $uploadedfile->save();

            return response()->json(['message' => 'Image updated successfully', 'status' => 'success']);
        } catch (GuzzleException $e) {
            return response()->json(['message' => 'Failed to update image', 'status' => 'error']);
        }
    }

    public function uploadUnitFiles(Request $request)
    {
        $folderId = \Config('services.google.folder_id'); // Assuming you send folder_id along with files
        $propertyid = $request->propertyid;
        $unitid = $request->unitid; // New unitid parameter
        $files = $request->file('files'); // Array of files
        $hasNonImage = false;

        if ($files == null) {
            return response()->json(['message' => 'Please select at least one file', 'status' => 'error']);
        } else if (count($files) > 15) {
            return response()->json(['message' => 'The maximum number of files is 15', 'status' => 'error']);
        }
        foreach ($files as $file) {
            if ($file->getSize() > 2 * 1024 * 1024) { // 2MB in bytes
                return response()->json(['message' => 'A file size exceeds the maximum limit of 2MB', 'status' => 'error']);
            }
            if (!in_array($file->getClientOriginalExtension(), ['jpg', 'jpeg', 'png', 'gif'])) {
                $hasNonImage = true;
                break;
            }
        }

        if ($hasNonImage) {
            return response()->json(['message' => 'A file is not an image file', 'status' => 'error']);
        }

        $uploadedFiles = $this->uploadMultipleUnitFiles($files, $folderId, $propertyid, $unitid);
        // Process the uploaded files as needed
        return response()->json(['status' => 'success', 'message' => 'Files uploaded']);
    }

    public function uploadMultipleUnitFiles(array $files, string $folderId, string $propertyid, ?string $unitid)
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

                $newFile = new File(); // Assuming PropertyFile model namespace
                $newFile->file_name = $name;
                $newFile->file_id = $file_id;
                $newFile->file_url = $file_url;
                $newFile->propertyid = $propertyid;
                $newFile->unitid = $unitid; // Set unitid
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

    public function updateMultiunitImg(Request $request, $unitid)
    {
        $this->enableCors($request);
        $accessToken = $this->token(); // Fetch Google Drive API token
        $success = false;
        $nochange = true; // Default to true; if changes occur, this will be set to false
        $client = new Client();

        // Handle file deletion
        if ($request->has('toDelete')) {
            $toDelete = json_decode($request->input('toDelete'), true); // Decode JSON string
            $failedDeletes = [];
            $successCount = 0;

            foreach ($toDelete as $fileData) {
                try {
                    $existingFile = File::find($fileData['id']);

                    if (!$existingFile) {
                        $failedDeletes[] = [
                            'id' => $fileData['id'],
                            'message' => 'File not found in database'
                        ];
                        continue; // Skip to the next file
                    }

                    // Delete the file from Google Drive
                    $deleteResponse = $client->request('DELETE', 'https://www.googleapis.com/drive/v3/files/' . $existingFile->file_id, [
                        'headers' => [
                            'Authorization' => 'Bearer ' . $accessToken,
                        ],
                    ]);

                    if ($deleteResponse->getStatusCode() == 204) {
                        $existingFile->delete();
                        $successCount++;
                        $nochange = false; // Change occurred: files deleted
                    } else {
                        $failedDeletes[] = [
                            'id' => $fileData['id'],
                            'message' => 'Failed to delete from Google Drive'
                        ];
                    }
                } catch (GuzzleException $e) {
                    $failedDeletes[] = [
                        'id' => $fileData['id'],
                        'message' => $e->getMessage(),
                    ];
                }
            }
        }

        // Handle file upload
        if ($request->hasFile('files')) {
            $files = $request->file('files');
            $folderId = \Config('services.google.folder_id');
            $uploadedFiles = $this->uploadMultipleFiles_multiunit($files, $folderId, $unitid);

            if ($uploadedFiles) {
                $success = true;
                $nochange = false; // Change occurred: files uploaded
            } else {
                // Handle case where uploadMultipleFiles might return an error or partial success
                return response()->json([
                    'message' => 'Failed to upload some files',
                    'status' => 'partial_success',
                    'errors' => $uploadedFiles['errors'] ?? []
                ]);
            }
        }

        if ($nochange) {
            return response()->json(['status' => 'success', 'message' => 'No changes made']);
        } else {
            $propertyimgs = File::where('unitid', $unitid)
                ->where('iscover', 0)
                ->get();

            $imglist = $propertyimgs->map(function ($item) {
                return [
                    'id' => $item->id,
                    'src' => $item->file_url,
                    'caption' => $item->caption
                ];
            });
            return response()->json(['status' => 'success', 'message' => 'Files deleted or uploaded', 'updatedUnitImg' => $imglist]);
        }
    }


    public function uploadMultipleFiles_multiunit(array $files, string $folderId, string $unitid)
    {
        $accessToken = $this->token();
        $client = new Client();
        $uploadedFiles = [];
        $propertyid = UnitDetails::where('unitid', $unitid)->first()->propertyid;
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
                // $file_url = "https://drive.google.com/thumbnail?id=$file_id";
                $file_url = "https://lh3.googleusercontent.com/d/$file_id=w1000?authuser=0";
                $newFile = new File(); // Assuming File model namespace
                $newFile->file_name = $name;
                $newFile->file_id = $file_id;
                $newFile->file_url = $file_url;
                $newFile->propertyid = $propertyid;
                $newFile->unitid = $unitid;
                $newFile->iscover = 0;
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


}
